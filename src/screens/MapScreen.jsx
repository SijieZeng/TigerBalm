import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { ingredientById } from '../data/mockData.js'
import MapBackground from '../components/MapBackground.jsx'
import IngredientPin from '../components/IngredientPin.jsx'
import WeightsPanel from '../components/WeightsPanel.jsx'
import Toast from '../components/Toast.jsx'

export default function MapScreen() {
  const { state, dispatch, user, capacity, canCollectToday, config } = useGame()
  const [toast, setToast] = useState(null)
  const [replaceFor, setReplaceFor] = useState(null) // pending drop when backpack full

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1600)
  }

  function handleCollect(drop) {
    if (!canCollectToday) {
      flash(`Only ${config.dailyCollectLimit} pick per day — come back tomorrow ⏭`)
      return
    }
    if (user.backpack.length >= capacity) {
      setReplaceFor(drop) // ask which item to replace
      return
    }
    dispatch({ type: 'COLLECT', ingredientId: drop.id, _uid: drop._uid })
    flash(`Collected ${drop.emoji} ${drop.name}`)
  }

  function handleDiscard(drop) {
    dispatch({ type: 'DISCARD_FROM_MAP', ingredientId: drop.id, _uid: drop._uid })
    flash(`Noted — fewer ${drop.emoji} next time`)
  }

  function confirmReplace(removeId) {
    dispatch({ type: 'REPLACE_AND_COLLECT', ingredientId: replaceFor.id, removeId, _uid: replaceFor._uid })
    flash(`Swapped in ${replaceFor.emoji}`)
    setReplaceFor(null)
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapBackground />

      {/* top HUD */}
      <div className="pointer-events-none absolute left-3 right-3 top-3 z-20 flex items-start justify-between">
        <div className="pointer-events-auto rounded-2xl bg-white/90 px-3 py-2 text-xs shadow ring-1 ring-black/5 backdrop-blur">
          <div className="font-semibold">📍 Ingredients near you</div>
          <div className="text-neutral-500">
            Daily pick {user.dailyCollected}/{config.dailyCollectLimit} · Bag {user.backpack.length}/{capacity}
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'NEXT_DAY' })}
          className="pointer-events-auto rounded-full bg-black/80 px-3 py-2 text-xs font-semibold text-white shadow"
        >
          Next day ⏭
        </button>
      </div>

      {/* "me" marker */}
      <div className="absolute left-1/2 top-[44%] z-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30" />
      </div>

      {/* drops */}
      <AnimatePresence>
        {state.mapDrops.map((drop) => (
          <IngredientPin
            key={drop._uid}
            drop={drop}
            disabled={!canCollectToday}
            onCollect={() => handleCollect(drop)}
            onDiscard={() => handleDiscard(drop)}
          />
        ))}
      </AnimatePresence>

      {state.mapDrops.length === 0 && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/90 px-4 py-3 text-center text-sm shadow">
          All cleared! Tap <span className="font-semibold">Next day ⏭</span> for fresh drops.
        </div>
      )}

      <WeightsPanel />
      <Toast message={toast} />

      {/* replace-when-full modal */}
      <AnimatePresence>
        {replaceFor && (
          <motion.div
            className="absolute inset-0 z-40 flex items-end bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReplaceFor(null)}
          >
            <motion.div
              className="w-full rounded-t-3xl bg-white p-5"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-1 text-lg font-bold">Backpack full ({capacity})</div>
              <p className="mb-4 text-sm text-neutral-500">
                Pick one to drop so you can grab {replaceFor.emoji} {replaceFor.name}. Dropping it tells the
                Oracle you like it less.
              </p>
              <div className="flex flex-wrap gap-2">
                {user.backpack.map((id, i) => {
                  const ing = ingredientById[id]
                  return (
                    <button
                      key={`${id}-${i}`}
                      onClick={() => confirmReplace(id)}
                      className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 px-4 py-3 transition active:scale-95"
                    >
                      <span className="text-2xl">{ing.emoji}</span>
                      <span className="text-xs text-neutral-600">{ing.name}</span>
                      <span className="text-[10px] font-semibold text-red-400">drop ✕</span>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setReplaceFor(null)}
                className="mt-4 w-full rounded-full bg-neutral-100 py-2.5 text-sm font-semibold text-neutral-600"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
