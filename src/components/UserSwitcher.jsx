import { useGame } from '../state/gameStore.jsx'

/** Demo-only toggle: New (cold start) <-> Returning (Ava, rich profile). */
export default function UserSwitcher() {
  const { state, dispatch } = useGame()
  const options = [
    { id: 'new', label: 'New' },
    { id: 'returning', label: 'Ava' },
  ]
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 p-0.5 text-xs">
      {options.map((o) => {
        const active = state.activeUserId === o.id
        return (
          <button
            key={o.id}
            onClick={() => dispatch({ type: 'SWITCH_USER', userId: o.id })}
            className={`rounded-full px-2.5 py-1 font-semibold transition ${
              active ? 'bg-white text-black' : 'text-white/70'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
