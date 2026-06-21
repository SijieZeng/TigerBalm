import { useGame } from '../state/gameStore.jsx'

/**
 * Uber Eats bottom tab bar (matches the Map / Browse mockup).
 * Only Home + Browse are wired; the rest are visual for fidelity.
 */
const TABS = [
  { id: 'home', label: 'Home', icon: HomeIcon, screen: 'home' },
  { id: 'browse', label: 'Browse', icon: BrowseIcon, screen: 'map' },
  { id: 'search', label: 'Search', icon: SearchIcon },
  { id: 'orders', label: 'Orders', icon: OrdersIcon },
  { id: 'account', label: 'Account', icon: AccountIcon },
]

export default function TabBar({ active = 'browse' }) {
  const { dispatch } = useGame()
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-neutral-200 bg-white px-2 pb-5 pt-2">
      {TABS.map((t) => {
        const isActive = t.id === active
        const Icon = t.icon
        return (
          <button
            key={t.id}
            onClick={() => t.screen && dispatch({ type: 'SET_SCREEN', screen: t.screen })}
            className={`flex flex-col items-center gap-1 text-[11px] ${isActive ? 'font-semibold text-[#06C167]' : 'text-neutral-500'}`}
          >
            <Icon active={isActive} />
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}

const stroke = (active) => (active ? '#06C167' : '#6b7280')
function HomeIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth="2"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
}
function BrowseIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth="2"><path d="M9 4v16M15 4v16M3 8h18M3 16h18" /></svg>
}
function SearchIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
}
function OrdersIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>
}
function AccountIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0112 0v1" /></svg>
}
