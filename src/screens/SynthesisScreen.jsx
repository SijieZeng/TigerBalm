import { motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { ingredientById, restaurants } from '../data/mockData.js'
import { rankCandidateDishes, getDiscountForCount } from '../data/engine.js'

// Pick a restaurant that serves the dish, preferring the user's favorites.
function restaurantForDish(dish, user) {
  const serving = restaurants.filter((r) => r.dishIds.includes(dish.id))
  const fav = serving.find((r) => user.favorites?.restaurantIds?.includes(r.id))
  return fav ?? serving[0] ?? null
}

// Human-readable reason a dish ranked where it did (Personalization evidence).
function reasonFor(dish, user) {
  if (user.favorites?.dishIds?.includes(dish.id)) return '⭐ One of your favorites'
  const ordered = (user.orderHistory ?? []).find((o) => o.dishId === dish.id)
  if (ordered) return `🧾 Ordered ${ordered.count}× before`
  if (user.favorites?.cuisineTypes?.includes(dish.cuisineType)) return `❤️ You love ${dish.cuisineType}`
  return '🆕 Something new to try'
}

export default function SynthesisScreen() {
  const { state, dispatch, user } = useGame()
  const selection = state.synthSelection
  const tier = getDiscountForCount(selection.length)
  const candidates = selection.length > 0 ? rankCandidateDishes(user, selection) : []

  function choose(dish) {
    const restaurant = restaurantForDish(dish, user)
    dispatch({ type: 'SYNTHESIZE', dish, restaurant })
  }

  return (
    <div className="flex h-full flex-col p-4">
      <h2 className="text-xl font-bold">✨ Synthesize</h2>
      <p className="text-sm text-neutral-500">
        Pick ingredients to brew. <span className="font-semibold">More ingredients = bigger reward.</span>
      </p>

      {/* ingredient picker */}
      <div className="mt-3 flex flex-wrap gap-2">
        {user.backpack.length === 0 && (
          <div className="w-full rounded-2xl bg-white p-4 text-center text-sm text-neutral-400 shadow-sm ring-1 ring-black/5">
            Backpack empty — collect ingredients on the map first.
          </div>
        )}
        {user.backpack.map((id, i) => {
          const ing = ingredientById[id]
          const active = selection.includes(id)
          // toggle by the i-th instance: we map selection on ids, so dedupe by id
          return (
            <button
              key={`${id}-${i}`}
              onClick={() => dispatch({ type: 'TOGGLE_SYNTH_ITEM', ingredientId: id })}
              className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'border-[#06C167] bg-[#06C167]/10 text-[#048a49]'
                  : 'border-neutral-200 bg-white text-neutral-700'
              }`}
            >
              <span className="text-lg">{ing.emoji}</span>
              {ing.name}
              {active && <span className="text-[#06C167]">✓</span>}
            </button>
          )
        })}
      </div>

      {/* discount preview */}
      <DiscountPreview count={selection.length} tier={tier} />

      {/* candidates */}
      <div className="mt-3 flex-1 overflow-y-auto">
        {selection.length === 0 ? (
          <p className="pt-6 text-center text-sm text-neutral-400">Select at least one ingredient.</p>
        ) : candidates.length === 0 ? (
          <p className="pt-6 text-center text-sm text-neutral-400">
            No dish uses exactly that mix. Try a different combination.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-neutral-500">
              Brew one — ranked for your taste:
            </div>
            {candidates.map((dish, idx) => {
              const r = restaurantForDish(dish, user)
              return (
                <motion.button
                  key={dish.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => choose(dish)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.98]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-3xl">
                    {dish.ingredientIds.slice(0, 1).map((iid) => ingredientById[iid]?.emoji)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-bold">{dish.name}</span>
                      {idx === 0 && (
                        <span className="rounded-full bg-[#06C167] px-1.5 py-0.5 text-[9px] font-bold text-white">
                          TOP PICK
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500">{r ? r.name : dish.cuisineType}</div>
                    <div className="mt-0.5 text-[11px] font-medium text-[#048a49]">{reasonFor(dish, user)}</div>
                  </div>
                  <span className="text-neutral-300">→</span>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function DiscountPreview({ count, tier }) {
  return (
    <div className="mt-3 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-700 p-4 text-white">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-white/60">Committing {count} ingredient{count === 1 ? '' : 's'}</span>
        <span className="text-2xl">{count >= 5 ? '🏆' : count >= 3 ? '🎁' : count >= 1 ? '🔖' : '—'}</span>
      </div>
      <div className="mt-1 text-lg font-bold">
        {tier ? tier.label : 'Select ingredients to see your reward'}
      </div>
      {tier && <div className="text-[11px] text-white/60">{tier.note}</div>}
      {/* tier ladder */}
      <div className="mt-3 flex gap-1.5 text-[10px] font-semibold">
        {[
          { n: 1, t: '50% off dish' },
          { n: 3, t: 'Dish free' },
          { n: 5, t: '20% off order' },
        ].map((step) => (
          <div
            key={step.n}
            className={`flex-1 rounded-lg px-1.5 py-1 text-center ${
              count >= step.n ? 'bg-[#06C167] text-white' : 'bg-white/10 text-white/50'
            }`}
          >
            {step.n}+ · {step.t}
          </div>
        ))}
      </div>
    </div>
  )
}
