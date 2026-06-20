import { useGame } from '../state/gameStore.jsx'
import UserSwitcher from './UserSwitcher.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * iPhone-style frame wrapping the whole prototype, so judges immediately read
 * it as "a feature inside the Uber Eats app". Header carries the Oracle title
 * + the demo user switcher; bottom nav switches screens.
 */
export default function PhoneShell({ children }) {
  const { state } = useGame()
  const showChrome = state.screen !== 'coupon' // coupon takes over full screen

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-4">
      <div className="relative h-[780px] w-[380px] overflow-hidden rounded-[44px] border-[10px] border-black bg-white shadow-2xl">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-40 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-black" />

        <div className="flex h-full flex-col">
          {/* status bar */}
          <div className="flex items-center justify-between bg-black px-6 pt-2 pb-1 text-[11px] font-semibold text-white">
            <span>9:41</span>
            <span className="flex gap-1">
              <span>Day {state.dayCount}</span>
              <span>·</span>
              <span>📶 🔋</span>
            </span>
          </div>

          {/* Uber Eats header */}
          {showChrome && (
            <header className="flex items-center justify-between bg-black px-4 pb-3 pt-1 text-white">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#06C167]">Uber Eats</div>
                <div className="flex items-center gap-1 text-lg font-bold leading-none">
                  <span>🔮</span> Food Oracle
                </div>
              </div>
              <UserSwitcher />
            </header>
          )}

          {/* screen body */}
          <main className="relative flex-1 overflow-y-auto bg-neutral-50">{children}</main>

          {/* bottom nav */}
          {showChrome && <BottomNav />}
        </div>
      </div>
    </div>
  )
}
