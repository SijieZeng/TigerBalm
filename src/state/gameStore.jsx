import { createContext, useContext, useReducer, useMemo } from 'react'
import { users as seedUsers, config } from '../data/mockData.js'
import { rollDrops, capacityFor, totalSlotsFor, getDiscountForCount } from '../data/engine.js'

/**
 * Central game store: Context + reducer.
 *
 * Single returning user. We keep a MUTABLE clone so gameplay (collect / discard)
 * mutates the ingredient track — the hidden personalization signal. The cuisine
 * track (orders / favorites) stays untouched and only feeds cooked-candidate
 * ranking.
 *
 * Screens: home | map | kitchen | cooked | coupon | restaurant
 */

const GameContext = createContext(null)

function clone(obj) {
  return typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj))
}

// Scatter positions (% of map) tuned to sit inside the visible map area.
const PIN_SPOTS = [
  { x: 50, y: 30 }, { x: 74, y: 38 }, { x: 28, y: 42 },
  { x: 72, y: 60 }, { x: 26, y: 64 }, { x: 52, y: 70 },
  { x: 40, y: 84 }, { x: 64, y: 82 },
]

function decorateDrops(drops) {
  return drops.map((d, i) => ({ ...d, _uid: `${d.id}-${i}`, pos: PIN_SPOTS[i % PIN_SPOTS.length] }))
}

function makeDrops(user, n = 7) {
  return decorateDrops(rollDrops(user, n))
}

function activeUser(state) {
  return state.users[0]
}

function initState() {
  const users = clone(seedUsers)
  const user = users[0]
  return {
    users,
    screen: 'home',
    mapDrops: makeDrops(user, 7),
    potSelection: [], // ingredient ids dropped into the pot for cooking
    cooked: [], // the 3 candidate dishes produced by "Make"
    coupon: null, // { dish, restaurant, tier, ingredientsUsed }
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }

    case 'REROLL_DROPS':
      return { ...state, mapDrops: makeDrops(activeUser(state), 7) }

    case 'COLLECT': {
      // Unlimited daily picks; only the kitchen capacity gates a collect.
      const users = state.users.map((u, i) => {
        if (i !== 0) return u
        if (u.backpack.length >= capacityFor(u)) return u // full -> handled by REPLACE
        return {
          ...u,
          backpack: [...u.backpack, action.ingredientId],
          ingredientTrack: bump(u.ingredientTrack, 'collected', action.ingredientId),
        }
      })
      const mapDrops = state.mapDrops.filter((d) => d._uid !== action._uid)
      return { ...state, users, mapDrops }
    }

    case 'REPLACE_AND_COLLECT': {
      // Kitchen full: discard `removeId` (negative signal) and add the new one.
      const users = state.users.map((u, i) => {
        if (i !== 0) return u
        const idx = u.backpack.indexOf(action.removeId)
        const backpack = idx >= 0 ? [...u.backpack.slice(0, idx), ...u.backpack.slice(idx + 1)] : [...u.backpack]
        backpack.push(action.ingredientId)
        let track = bump(u.ingredientTrack, 'discarded', action.removeId)
        track = bump(track, 'collected', action.ingredientId)
        return { ...u, backpack, ingredientTrack: track }
      })
      const mapDrops = state.mapDrops.filter((d) => d._uid !== action._uid)
      return { ...state, users, mapDrops }
    }

    case 'PASS_INGREDIENT': {
      // "Pass" on the select sheet: negative signal, pin leaves the map.
      const users = state.users.map((u, i) =>
        i === 0 ? { ...u, ingredientTrack: bump(u.ingredientTrack, 'discarded', action.ingredientId) } : u
      )
      const mapDrops = state.mapDrops.filter((d) => d._uid !== action._uid)
      return { ...state, users, mapDrops }
    }

    case 'REMOVE_FROM_KITCHEN': {
      // Remove the specific backpack slot (index) — indices shift, so reset pot.
      const users = state.users.map((u, i) => {
        if (i !== 0) return u
        const id = u.backpack[action.index]
        if (id == null) return u
        const backpack = u.backpack.filter((_, k) => k !== action.index)
        return { ...u, backpack, ingredientTrack: bump(u.ingredientTrack, 'discarded', id) }
      })
      return { ...state, users, potSelection: [] }
    }

    case 'TOGGLE_POT_SLOT': {
      // Track pot by backpack SLOT INDEX so duplicate ingredients both count.
      const has = state.potSelection.includes(action.index)
      const potSelection = has
        ? state.potSelection.filter((i) => i !== action.index)
        : [...state.potSelection, action.index]
      return { ...state, potSelection }
    }

    case 'MAKE': {
      // Produce the cooked candidates (ranking still runs under the hood) and
      // move to the Cooked Cuisines screen. Ingredients are consumed on PICK.
      return { ...state, cooked: action.cooked, screen: 'cooked' }
    }

    case 'TRY_ANOTHER_BATCH':
      return { ...state, screen: 'kitchen', cooked: [] }

    case 'PICK_DISH': {
      // Consume the committed slots; build the coupon from the chosen dish.
      const tier = getDiscountForCount(state.potSelection.length)
      const chosen = new Set(state.potSelection)
      const users = state.users.map((u, i) => {
        if (i !== 0) return u
        const backpack = u.backpack.filter((_, k) => !chosen.has(k))
        return { ...u, backpack }
      })
      return {
        ...state,
        users,
        coupon: { dish: action.dish, restaurant: action.restaurant, tier, ingredientsUsed: state.potSelection.length },
        potSelection: [],
        cooked: [],
        screen: 'coupon',
      }
    }

    case 'GO_RESTAURANT':
      return { ...state, screen: 'restaurant' }

    case 'RESET_TO_MAP':
      return { ...state, coupon: null, screen: 'map' }

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
      totalSlots: totalSlotsFor(user),
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
