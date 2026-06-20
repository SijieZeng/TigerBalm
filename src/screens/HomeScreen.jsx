import { motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'

export default function HomeScreen() {
  const { state, dispatch, user, capacity, canCollectToday, config } = useGame()
  const isNew = user.id === 'new'

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* greeting */}
      <div>
        <div className="text-sm text-neutral-500">Good evening,</div>
        <div className="text-2xl font-bold">{user.name} {user.isMember && <span className="align-middle text-xs font-semibold text-[#06C167]">Uber One</span>}</div>
      </div>

      {/* hero */}
      <motion.button
        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'map' })}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06C167] to-[#048a49] p-5 text-left text-white shadow-lg"
      >
        <div className="text-4xl">🔮</div>
        <div className="mt-2 text-xl font-bold">Can't decide what to eat?</div>
        <div className="mt-1 text-sm text-white/85">
          Collect ingredients near you, brew a dish, and unlock a discount.
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold">
          Open the map →
        </div>
        <div className="pointer-events-none absolute -right-6 -top-6 text-[120px] opacity-10">🍅</div>
      </motion.button>

      {/* today status */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Today's pick" value={`${user.dailyCollected}/${config.dailyCollectLimit}`} hint={canCollectToday ? 'available' : 'used'} />
        <Stat label="Backpack" value={`${user.backpack.length}/${capacity}`} hint={user.isMember ? 'member' : 'standard'} />
        <Stat label="Day" value={state.dayCount} hint="streak" />
      </div>

      {/* personalization note for the demo */}
      <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-black/5">
        <div className="mb-1 font-semibold">
          {isNew ? '🌱 Cold start' : '🎯 Personalized for you'}
        </div>
        <p className="text-neutral-500">
          {isNew
            ? 'No history yet — your map drops are pure exploration. Collect and discard to teach the Oracle what you like.'
            : 'Based on your orders & favorites (Italian, Tony\'s Pizzeria) the map favors tomato, basil & mozzarella — and never drops your seafood allergens.'}
        </p>
      </div>

      <div className="mt-auto text-center text-[11px] text-neutral-400">
        Switch <span className="font-semibold">New ↔ Ava</span> in the header to see personalization change.
      </div>
    </div>
  )
}

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-bold leading-none">{value}</div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="text-[10px] text-[#06C167]">{hint}</div>
    </div>
  )
}
