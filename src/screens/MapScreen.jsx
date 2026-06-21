import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { ingredientById } from '../data/mockData.js'
import MapBackground from '../components/MapBackground.jsx'
import IngredientPin from '../components/IngredientPin.jsx'
import FoodImage from '../components/FoodImage.jsx'
import TabBar from '../components/TabBar.jsx'

/** Mockups 2 & 3 — the ingredient map with the select sheet (Pick up / Pass). */
export default function MapScreen() {
  const { state, dispatch, user, capacity } = useGame()
  const [selected, setSelected] = useState(null) // the drop tapped (sheet open)
  const [replaceFor, setReplaceFor] = useState(null) // pending drop when kitchen full
  const [toast, setToast] = useState(null)

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1500)
  }

  function pickUp(drop) {
    if (user.backpack.length >= capacity) {
      setSelected(null)
      setReplaceFor(drop)
      return
    }
    dispatch({ type: 'COLLECT', ingredientId: drop.id, _uid: drop._uid })
    setSelected(null)
    flash(`${drop.emoji} ${drop.name} added to your kitchen`)
  }

  function pass(drop) {
    dispatch({ type: 'PASS_INGREDIENT', ingredientId: drop.id, _uid: drop._uid })
    setSelected(null)
  }

  function confirmReplace(removeId) {
    dispatch({ type: 'REPLACE_AND_COLLECT', ingredientId: replaceFor.id, removeId, _uid: replaceFor._uid })
    flash(`Swapped in ${replaceFor.emoji}`)
    setReplaceFor(null)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eef1f4]">
      <MapBackground />

      {/* search + filters */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-12">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-md">
          <span className="text-neutral-400">🔍</span>
          <span className="text-sm text-neutral-400">Search nearby pickup spots</span>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip>🏷️ Deals</FilterChip>
          <FilterChip>Cuisine ⌄</FilterChip>
          <FilterChip>⭐ Top rated</FilterChip>
          <FilterChip>Rating ⌄</FilterChip>
        </div>
      </div>

      {/* pickup-spot dots */}
      {DOTS.map((d, i) => (
        <div key={i} className="absolute z-[5] h-2 w-2 rounded-full bg-[#06C167] ring-2 ring-white" style={{ left: `${d.x}%`, top: `${d.y}%` }} />
      ))}

      {/* "me" */}
      <div className="absolute left-1/2 top-[48%] z-[6] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 ring-4 ring-blue-500/30" />

      {/* ingredient pins */}
      <AnimatePresence>
        {state.mapDrops.map((drop, i) => (
          <IngredientPin
            key={drop._uid}
            drop={drop}
            highlight={i === 0}
            walk="2 min walk"
            onSelect={() => setSelected(drop)}
          />
        ))}
      </AnimatePresence>

      {state.mapDrops.length === 0 && (
        <button
          onClick={() => dispatch({ type: 'REROLL_DROPS' })}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow"
        >
          🔄 Search here
        </button>
      )}

      {/* basket FAB -> kitchen */}
      <button
        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'kitchen' })}
        className="absolute bottom-44 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-xl ring-1 ring-black/5"
      >
        🧺
        {user.backpack.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#06C167] text-xs font-bold text-white ring-2 ring-white">
            {user.backpack.length}
          </span>
        )}
      </button>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none absolute bottom-28 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <TabBar active="browse" />

      {/* ===== select sheet (mockup 3) ===== */}
      <AnimatePresence>
        {selected && (
          <SelectSheet drop={selected} onPickUp={() => pickUp(selected)} onPass={() => pass(selected)} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      {/* ===== replace-when-full sheet ===== */}
      <AnimatePresence>
        {replaceFor && (
          <ReplaceSheet
            drop={replaceFor}
            backpack={user.backpack}
            capacity={capacity}
            onPick={confirmReplace}
            onClose={() => setReplaceFor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function SelectSheet({ drop, onPickUp, onPass, onClose }) {
  return (
    <motion.div className="absolute inset-0 z-40 flex items-end bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="w-full rounded-t-3xl bg-white p-5 pb-8"
        initial={{ y: 260 }} animate={{ y: 0 }} exit={{ y: 260 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200" />
        <div className="flex items-start gap-4">
          <FoodImage src={drop.image} emoji={drop.emoji} alt={drop.name} className="h-24 w-24 shrink-0" emojiClass="text-6xl" />
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold">{drop.name}</h3>
              <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">✕</button>
            </div>
            <p className="mt-1 text-neutral-500">{drop.blurb}</p>
            <div className="mt-3 inline-flex flex-wrap gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
              {drop.tags?.join('  •  ')}
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onPickUp} className="flex-1 rounded-full bg-[#06C167] py-3.5 text-base font-bold text-white">Pick up</button>
          <button onClick={onPass} className="flex-1 rounded-full border border-neutral-300 py-3.5 text-base font-bold text-neutral-800">Pass</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ReplaceSheet({ drop, backpack, capacity, onPick, onClose }) {
  return (
    <motion.div className="absolute inset-0 z-40 flex items-end bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="w-full rounded-t-3xl bg-white p-5 pb-8"
        initial={{ y: 260 }} animate={{ y: 0 }} exit={{ y: 260 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200" />
        <div className="mb-1 text-lg font-bold">Kitchen full ({capacity})</div>
        <p className="mb-4 text-sm text-neutral-500">
          Drop one to make room for {drop.emoji} {drop.name}. Dropping it tells the Oracle you like it less.
        </p>
        <div className="flex flex-wrap gap-2">
          {backpack.map((id, i) => {
            const ing = ingredientById[id]
            return (
              <button key={`${id}-${i}`} onClick={() => onPick(id)} className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 px-4 py-3 transition active:scale-95">
                <span className="text-2xl">{ing.emoji}</span>
                <span className="text-xs text-neutral-600">{ing.name}</span>
                <span className="text-[10px] font-semibold text-red-400">drop ✕</span>
              </button>
            )
          })}
        </div>
        <button onClick={onClose} className="mt-4 w-full rounded-full bg-neutral-100 py-2.5 text-sm font-semibold text-neutral-600">Cancel</button>
      </motion.div>
    </motion.div>
  )
}

function FilterChip({ children }) {
  return <span className="flex items-center whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">{children}</span>
}

// decorative pickup-spot dots
const DOTS = [
  { x: 18, y: 32 }, { x: 40, y: 28 }, { x: 84, y: 30 }, { x: 12, y: 52 },
  { x: 90, y: 50 }, { x: 22, y: 76 }, { x: 78, y: 74 }, { x: 56, y: 88 },
]
