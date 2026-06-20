import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { getDropWeights } from '../data/engine.js'

/**
 * Evidence panel: shows the live, sorted drop weights for the active user.
 * This is the visual proof for "Personalization Logic" — judges can see
 * collected ingredients boosted and discarded ones suppressed.
 */
export default function WeightsPanel() {
  const { state, dispatch, user } = useGame()
  const weights = getDropWeights(user)
  const max = Math.max(...weights.map((w) => w.weight), 0.001)

  return (
    <div className="absolute bottom-3 left-3 right-3 z-20">
      <button
        onClick={() => dispatch({ type: 'TOGGLE_WEIGHTS' })}
        className="mb-1 rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold text-white shadow"
      >
        {state.showWeights ? '▾ Hide' : '▸ Why these drops?'} 🧠
      </button>

      <AnimatePresence>
        {state.showWeights && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="overflow-hidden rounded-2xl bg-white/95 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur"
          >
            <div className="mb-2 text-[11px] font-semibold text-neutral-500">
              Drop weight = base rarity × your collect / discard history
            </div>
            <div className="space-y-1.5">
              {weights.map((w) => {
                const liked = (user.ingredientTrack.collected[w.id] ?? 0) > 0
                const disliked = (user.ingredientTrack.discarded[w.id] ?? 0) > 0
                return (
                  <div key={w.id} className="flex items-center gap-2 text-xs">
                    <span className="w-5 text-base">{w.emoji}</span>
                    <span className="w-20 truncate text-neutral-600">{w.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full ${
                          disliked ? 'bg-red-300' : liked ? 'bg-[#06C167]' : 'bg-neutral-300'
                        }`}
                        style={{ width: `${(w.weight / max) * 100}%` }}
                      />
                    </div>
                    {liked && <span className="text-[#06C167]">▲</span>}
                    {disliked && <span className="text-red-400">▼</span>}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
