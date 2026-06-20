import { motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { ingredientById } from '../data/mockData.js'

// A little confetti burst built from emoji — no extra deps.
const CONFETTI = ['🎉', '🍅', '🌿', '🧀', '✨', '🎊']

export default function CouponScreen() {
  const { state, dispatch } = useGame()
  const coupon = state.coupon
  if (!coupon) return null
  const { dish, restaurant, tier, ingredientsUsed } = coupon

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#06C167] to-[#036c39] p-6 text-white">
      {/* confetti */}
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-2xl"
          style={{ left: `${10 + i * 15}%` }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: 720, opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 2.4, delay: i * 0.12, repeat: Infinity, repeatDelay: 1.2 }}
        >
          {c}
        </motion.span>
      ))}

      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="z-10 w-full max-w-xs"
      >
        <div className="text-center text-sm font-semibold uppercase tracking-widest text-white/80">
          You brewed
        </div>

        {/* coupon card */}
        <div className="relative mt-3 rounded-3xl bg-white p-6 text-center text-neutral-900 shadow-2xl">
          {/* perforation notches */}
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#06C167]" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#036c39]" />

          <div className="text-5xl">
            {dish.ingredientIds.slice(0, 3).map((iid) => ingredientById[iid]?.emoji).join('')}
          </div>
          <div className="mt-2 text-xl font-extrabold">{dish.name}</div>
          <div className="text-sm text-neutral-500">{restaurant ? restaurant.name : dish.cuisineType}</div>

          <div className="my-4 border-t border-dashed border-neutral-200" />

          <div className="text-4xl font-black text-[#06C167]">
            {tier ? tier.label : 'Discount unlocked'}
          </div>
          <div className="mt-1 text-xs text-neutral-400">
            Brewed with {ingredientsUsed} ingredient{ingredientsUsed === 1 ? '' : 's'}
            {tier?.note ? ` · ${tier.note}` : ''}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: 'RESET_COUPON' })}
          className="mt-5 w-full rounded-full bg-black py-4 text-base font-bold text-white shadow-lg"
        >
          Order Now →
        </motion.button>
        <button
          onClick={() => dispatch({ type: 'RESET_COUPON' })}
          className="mt-3 w-full text-center text-sm font-medium text-white/80"
        >
          Back to map
        </button>
      </motion.div>
    </div>
  )
}
