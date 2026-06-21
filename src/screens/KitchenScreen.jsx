import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { ingredientById } from '../data/mockData.js'
import { rankCandidateDishes } from '../data/engine.js'
import { asset } from '../asset.js'

const POT_IMAGE = asset('/images/ui/pot.png')

/** Mockup 4 — Ingredient Kitchen. Tap an ingredient to drop it in the pot,
 *  then Make. Cooking + selection live on this one page. */
export default function KitchenScreen() {
  const { state, dispatch, user, capacity, config } = useGame()
  const pot = state.potSelection // array of backpack slot indices
  const slots = Array.from({ length: capacity })
  const chosenIds = [...new Set(pot.map((i) => user.backpack[i]))] // distinct for ranking

  function make() {
    if (pot.length === 0) return
    // ranking still runs under the hood (hidden). Always surface exactly 3:
    // primary matches first, then pad with the next best allergen-safe dishes.
    const primary = rankCandidateDishes(user, chosenIds)
    let cooked = [...primary]
    if (cooked.length < 3) {
      const have = new Set(cooked.map((d) => d.id))
      const filler = rankCandidateDishes(user, []).filter((d) => !have.has(d.id))
      cooked = [...cooked, ...filler]
    }
    dispatch({ type: 'MAKE', cooked: cooked.slice(0, 3) })
  }

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* header */}
      <div className="flex items-center justify-between px-4 pb-3 pt-12">
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'map' })} className="text-2xl">←</button>
        <h1 className="text-lg font-bold">Ingredient Kitchen</h1>
        <button className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600">Rules</button>
      </div>

      {/* ingredient cards: usable slots + locked Plus slots (all fit in a row) */}
      <div className="relative px-3">
        <div className="mb-1 flex justify-end">
          <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold text-white">
            Uber Eats <span className="text-[#06C167]">Plus</span>
          </span>
        </div>
        <div className="flex gap-1.5">
          {slots.map((_, i) => {
            const id = user.backpack[i]
            const ing = id ? ingredientById[id] : null
            const inPot = pot.includes(i)
            return (
              <div key={i} className="relative flex-1">
                {ing ? (
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_POT_SLOT', index: i })}
                    className={`flex w-full flex-col items-center gap-0.5 rounded-2xl border-2 bg-white px-1 py-2.5 transition ${inPot ? 'border-[#06C167] opacity-40' : 'border-transparent shadow-sm'}`}
                  >
                    <span className="text-3xl">{ing.emoji}</span>
                    <span className="w-full truncate text-center text-[10px] font-medium text-neutral-700">{ing.name}</span>
                  </button>
                ) : (
                  <div className="flex w-full flex-col items-center gap-0.5 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-100 px-1 py-2.5">
                    <span className="text-3xl text-neutral-300">＋</span>
                    <span className="text-[10px] text-neutral-400">Empty</span>
                  </div>
                )}
                {ing && (
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FROM_KITCHEN', index: i })}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#06C167] text-[10px] font-bold text-white shadow"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            )
          })}
          {Array.from({ length: config.lockedSlots }).map((_, i) => (
            <div key={`lock-${i}`} className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-100 px-1 py-2.5 opacity-80">
              <span className="text-2xl">🔒</span>
              <span className="text-center text-[9px] font-medium leading-tight text-neutral-400">Plus Unlock</span>
            </div>
          ))}
        </div>
      </div>

      <p className="px-6 pt-5 text-center text-sm text-neutral-500">Tap ingredients to drop them in the pot and cook a dish!</p>

      {/* pot */}
      <div className="relative flex flex-1 items-center justify-center">
        <Pot emojis={pot.map((i) => user.backpack[i]).map((id) => ingredientById[id]?.emoji)} />
      </div>

      {/* recipe skeleton lines */}
      <div className="space-y-2 px-8 pb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-3 rounded-full bg-neutral-200" style={{ width: `${[100, 92, 70][i]}%` }} />
        ))}
      </div>

      {/* make */}
      <div className="px-4 pb-8">
        <motion.button
          whileTap={{ scale: pot.length ? 0.97 : 1 }}
          onClick={make}
          disabled={pot.length === 0}
          className="w-full rounded-full bg-black py-4 text-lg font-bold text-white transition disabled:opacity-30"
        >
          Make ✨ {pot.length > 0 && <span className="text-[#06C167]">({pot.length})</span>}
        </motion.button>
      </div>
    </div>
  )
}

function Pot({ emojis }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div className="relative">
      {/* ingredients hovering above the pot */}
      <div className="absolute -top-10 left-1/2 z-10 flex -translate-x-1/2 gap-1">
        <AnimatePresence>
          {emojis.map((emoji, k) => (
            <motion.span
              key={k}
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              className="text-3xl drop-shadow"
            >
              {emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* the pot — real photo if present at POT_IMAGE, else CSS fallback */}
      {imgOk ? (
        <img src={POT_IMAGE} alt="cooking pot" onError={() => setImgOk(false)} className="h-44 w-44 object-contain drop-shadow-xl" />
      ) : (
        <div className="relative">
          <div className="mx-auto h-3 w-44 rounded-t-2xl bg-[#0a8f4f]" />
          <div className="relative mx-auto h-28 w-44 rounded-b-[40px] rounded-t-lg bg-gradient-to-b from-[#06C167] to-[#048a49] shadow-xl">
            <div className="absolute left-1/2 top-1 h-5 w-40 -translate-x-1/2 rounded-full bg-[#f3efe7]" />
            <div className="absolute -left-3 top-6 h-6 w-6 rounded-full border-4 border-neutral-800" />
            <div className="absolute -right-3 top-6 h-6 w-6 rounded-full border-4 border-neutral-800" />
          </div>
        </div>
      )}
    </div>
  )
}

