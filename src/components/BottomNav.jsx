import { useGame } from '../state/gameStore.jsx'

const TABS = [
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'backpack', label: 'Backpack', icon: '🎒' },
  { id: 'synth', label: 'Synthesize', icon: '✨' },
]

export default function BottomNav() {
  const { state, dispatch, user } = useGame()
  return (
    <nav className="flex border-t border-neutral-200 bg-white">
      {TABS.map((t) => {
        const active = state.screen === t.id
        const badge = t.id === 'backpack' ? user.backpack.length : null
        return (
          <button
            key={t.id}
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: t.id })}
            className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
              active ? 'text-black' : 'text-neutral-400'
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            {t.label}
            {badge != null && badge > 0 && (
              <span className="absolute right-1/4 top-1 rounded-full bg-[#06C167] px-1 text-[9px] font-bold text-white">
                {badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
