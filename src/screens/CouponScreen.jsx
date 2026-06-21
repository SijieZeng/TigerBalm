import { motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import FoodImage from '../components/FoodImage.jsx'

const CONFETTI = ['🎉', '✨', '🎊', '⭐', '💫', '🌟', '🎉', '✨']

// Short tag form of the reward, e.g. "50% off" / "Free" / "20% off order".
function shortReward(tier) {
  if (!tier) return 'Deal'
  const r = tier.reward
  if (r.type === 'dish_free') return 'Free dish'
  if (r.type === 'order_percent') return `${r.value}% off order`
  return `${r.value}% off`
}
function savePercent(tier) {
  if (!tier) return '—'
  if (tier.reward.type === 'dish_free') return '100%'
  return `${tier.reward.value}%`
}

/** Mockup 6 — "Nice pick … unlocked" celebration with the deal coupon. */
export default function CouponScreen() {
  const { state, dispatch } = useGame()
  const coupon = state.coupon
  if (!coupon) return null
  const { dish, restaurant, tier } = coupon
  const tag = shortReward(tier)

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-amber-50 to-white px-5 pt-16">
      {/* confetti */}
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-xl"
          style={{ left: `${6 + i * 12}%` }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: 760, opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 2.6, delay: i * 0.15, repeat: Infinity, repeatDelay: 1.4 }}
        >
          {c}
        </motion.span>
      ))}

      <button onClick={() => dispatch({ type: 'RESET_TO_MAP' })} className="absolute left-4 top-14 z-20 text-2xl">←</button>

      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 14 }} className="z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06C167] text-3xl text-white shadow-lg">
        ✓
      </motion.div>

      <div className="z-10 mt-3 text-center">
        <h2 className="text-2xl font-extrabold leading-tight">Nice pick —<br />{dish.name} unlocked</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Your <span className="font-bold text-[#06C167]">{tag}</span> deal is ready for 15 minutes
        </p>
      </div>

      {/* coupon card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="z-10 mt-5 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        <div className="relative">
          <FoodImage src={dish.image} emoji="🍕" alt={dish.name} rounded="rounded-none" className="h-44 w-full" emojiClass="text-7xl" />
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#048a49] shadow">🏷️ {tag} deal</span>
        </div>
        <div className="px-5 pb-5 pt-4 text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#06C167]/10 px-3 py-1 text-xs font-semibold text-[#048a49]">🏷️ Best deal</span>
          <p className="mt-2 text-sm text-neutral-500">{dish.blurb}</p>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-dashed border-neutral-200 pt-4 text-center">
            <Stat icon="⏱️" label="Deal expires in" value="15:00" />
            <Stat icon="🏷️" label="You save" value={savePercent(tier)} />
            <Stat icon="📍" label="From nearby" value="Top rated" />
          </div>
        </div>
      </motion.div>

      <div className="z-10 mt-auto pb-10 pt-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: 'GO_RESTAURANT' })}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#06C167] py-4 text-lg font-bold text-white shadow-lg"
        >
          Order now <span>→</span>
        </motion.button>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div>
      <div className="text-[#06C167]">{icon}</div>
      <div className="text-[10px] text-neutral-400">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  )
}
