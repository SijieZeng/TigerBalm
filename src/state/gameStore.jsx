import { createContext, useContext, useReducer, useMemo } from 'react'
import { users as seedUsers, config } from '../data/mockData.js'
import { rollDrops, capacityFor, canCollectToday, getDiscountForCount } from '../data/engine.js'

/**
 * Central game store: Context + reducer.
 *
 * We keep a MUTABLE clone of the seed users so that gameplay (collect / discard)
 * mutates each user's ingredientTrack — which is what makes "the system learns
 * from me" visibly true when we re-roll map drops. The cuisine track (orders /
 * favorites) stays untouched: it only feeds candidate ranking.
 */

const GameContext = createContext(null)

function clone(obj) {
  return typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj))
}

function freshUsers() {
  return clone(seedUsers)
}

// Hand-picked scatter positions (% of map) so pins never overlap the HUD.
const PIN_SPOTS = [
  { x: 22, y: 30 }, { x: 64, y: 22 }, { x: 40, y: 46 },
  { x: 76, y: 52 }, { x: 18, y: 62 }, { x: 56, y: 70 },
  { x: 34, y: 78 }, { x: 80, y: 78 },
]

// Decorate engine drops with a stable unique id + a map position.
function decorateDrops(drops) {
  return drops.map((d, i) => ({ ...d, _uid: `${d.id}-${i}`, pos: PIN_SPOTS[i % PIN_SPOTS.length] }))
}

function makeDrops(user, n = 6) {
  return decorateDrops(rollDrops(user, n))
}

function activeUser(state) {
  return state.users.find((u) => u.id === state.activeUserId)
}

function initState() {
  const users = freshUsers()
  const first = users.find((u) => u.id === 'returning') ?? users[0]
  return {
    users,
    activeUserId: first.id,
    screen: 'home', // home | map | backpack | synth | coupon
    mapDrops: makeDrops(first, 6), // [{...ingredient, weight, _uid, pos}]
    synthSelection: [], // ingredient ids the user committed at synthesis
    coupon: null, // { dish, restaurant, tier }
    dayCount: 1,
    showWeights: false,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }

    case 'SWITCH_USER': {
      const user = state.users.find((u) => u.id === action.userId)
      return {
        ...state,
        activeUserId: action.userId,
        mapDrops: makeDrops(user, 6),
        synthSelection: [],
        coupon: null,
        screen: 'map',
      }
    }

    case 'REROLL_DROPS': {
      return { ...state, mapDrops: makeDrops(activeUser(state), 6) }
    }

    case 'COLLECT': {
      const users = state.users.map((u) => {
        if (u.id !== state.activeUserId) return u
        const cap = capacityFor(u)
        if (!canCollectToday(u)) return u
        if (u.backpack.length >= cap) return u // full handled by REPLACE flow
        return {
          ...u,
          backpack: [...u.backpack, action.ingredientId],
          dailyCollected: u.dailyCollected + 1,
          ingredientTrack: bump(u.ingredientTrack, 'collected', action.ingredientId),
        }
      })
      // remove the collected pin from the map
      const mapDrops = state.mapDrops.filter((d) => d.id !== action.ingredientId || d._uid !== action._uid)
      return { ...state, users, mapDrops }
    }

    case 'REPLACE_AND_COLLECT': {
      // Backpack full: discard `removeId` (negative signal) and add the new one.
      const users = state.users.map((u) => {
        if (u.id !== state.activeUserId) return u
        if (!canCollectToday(u)) return u
        const idx = u.backpack.indexOf(action.removeId)
        const backpack = idx >= 0 ? [...u.backpack.slice(0, idx), ...u.backpack.slice(idx + 1)] : [...u.backpack]
        backpack.push(action.ingredientId)
        let track = bump(u.ingredientTrack, 'discarded', action.removeId)
        track = bump(track, 'collected', action.ingredientId)
        return { ...u, backpack, dailyCollected: u.dailyCollected + 1, ingredientTrack: track }
      })
      const mapDrops = state.mapDrops.filter((d) => !(d.id === action.ingredientId && d._uid === action._uid))
      return { ...state, users, mapDrops }
    }

    case 'DISCARD_FROM_MAP': {
      // "Not interested" on a pin: negative signal, pin leaves map. No daily cost.
      const users = state.users.map((u) =>
        u.id === state.activeUserId
          ? { ...u, ingredientTrack: bump(u.ingredientTrack, 'discarded', action.ingredientId) }
          : u
      )
      const mapDrops = state.mapDrops.filter((d) => d._uid !== action._uid)
      return { ...state, users, mapDrops }
    }

    case 'DISCARD_FROM_BACKPACK': {
      const users = state.users.map((u) => {
        if (u.id !== state.activeUserId) return u
        const idx = u.backpack.indexOf(action.ingredientId)
        if (idx < 0) return u
        const backpack = [...u.backpack.slice(0, idx), ...u.backpack.slice(idx + 1)]
        return { ...u, backpack, ingredientTrack: bump(u.ingredientTrack, 'discarded', action.ingredientId) }
      })
      return { ...state, users }
    }

    case 'NEXT_DAY': {
      const users = state.users.map((u) =>
        u.id === state.activeUserId ? { ...u, dailyCollected: 0 } : u
      )
      const user = users.find((u) => u.id === state.activeUserId)
      return { ...state, users, dayCount: state.dayCount + 1, mapDrops: makeDrops(user, 6) }
    }

    case 'TOGGLE_SYNTH_ITEM': {
      const has = state.synthSelection.includes(action.ingredientId)
      const synthSelection = has
        ? state.synthSelection.filter((id) => id !== action.ingredientId)
        : [...state.synthSelection, action.ingredientId]
      return { ...state, synthSelection }
    }

    case 'CLEAR_SYNTH':
      return { ...state, synthSelection: [] }

    case 'SYNTHESIZE': {
      // Consume the committed ingredients; build a coupon from the chosen dish.
      const tier = getDiscountForCount(state.synthSelection.length)
      const users = state.users.map((u) => {
        if (u.id !== state.activeUserId) return u
        const backpack = [...u.backpack]
        for (const id of state.synthSelection) {
          const i = backpack.indexOf(id)
          if (i >= 0) backpack.splice(i, 1)
        }
        return { ...u, backpack }
      })
      return {
        ...state,
        users,
        coupon: { dish: action.dish, restaurant: action.restaurant, tier, ingredientsUsed: state.synthSelection.length },
        synthSelection: [],
        screen: 'coupon',
      }
    }

    case 'RESET_COUPON':
      return { ...state, coupon: null, screen: 'map' }

    case 'TOGGLE_WEIGHTS':
      return { ...state, showWeights: !state.showWeights }

    case 'RESET':
      return initState()

    default:
      return state
  }
}

// Immutable +1 to collected/discarded counters for an ingredient.
function bump(track, key, ingredientId) {
  const next = { collected: { ...track.collected }, discarded: { ...track.discarded } }
  next[key][ingredientId] = (next[key][ingredientId] ?? 0) + 1
  return next
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  const value = useMemo(() => {
    const user = activeUser(state)
    return {
      state,
      dispatch,
      user,
      capacity: capacityFor(user),
      canCollectToday: canCollectToday(user),
      config,
    }
  }, [state])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}
