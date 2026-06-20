import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { ingredientById } from '../data/mockData.js'

export default function BackpackScreen() {
  const { state, dispatch, user, capacity, config } = useGame()
  const slots = Array.from({ length: capacity })

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold">🎒 Backpack</h2>
          <p className="text-sm text-neutral-500">
            {user.backpack.length}/{capacity} held · {user.isMember ? 'Uber One member' : 'Standard'}
          </p>
        </div>
        <div className="rounded-full bg-[#06C167]/10 px-3 py-1 text-xs font-semibold text-[#048a49]">
          +{config.dailyCollectLimit}/day
        </div>
      </div>

      {/* slots */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {slots.map((_, i) => {
          const id = user.backpack[i]
          const ing = id ? ingredientById[id] : null
          return (
            <div
              key={i}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border-2 ${
                ing ? 'border-transparent bg-white shadow-sm' : 'border-dashed border-neutral-300 bg-neutral-100'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {ing ? (
                  <motion.div
                    key={id + i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-4xl">{ing.emoji}</span>
                    <span className="mt-1 text-[11px] font-medium text-neutral-600">{ing.name}</span>
                    <button
                      onClick={() => dispatch({ type: 'DISCARD_FROM_BACKPACK', ingredientId: id })}
                      className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-red-400 shadow ring-1 ring-neutral-200"
                      title="Discard"
                    >
                      ✕
                    </button>
                  </motion.div>
                ) : (
                  <span className="text-2xl text-neutral-300">＋</span>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* member upsell hint when standard + full */}
      {!user.isMember && (
        <div className="mt-3 rounded-2xl bg-white p-3 text-xs text-neutral-500 shadow-sm ring-1 ring-black/5">
          💡 Uber One members carry <span className="font-semibold">5</span> ingredients — enough to brew the
          top reward (20% off a whole order).
        </div>
      )}

      <div className="mt-auto space-y-2 pt-4">
        <p className="text-center text-xs text-neutral-400">
          Discarding an item is a signal — the Oracle drops it less often.
        </p>
        <button
          disabled={user.backpack.length === 0}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'synth' })}
          className="w-full rounded-full bg-black py-3.5 text-sm font-bold text-white transition disabled:opacity-30"
        >
          ✨ Synthesize a dish ({user.backpack.length})
        </button>
      </div>
    </div>
  )
}
