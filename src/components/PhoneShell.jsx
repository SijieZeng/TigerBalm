/**
 * Realistic iPhone 15 device frame, recreated in CSS so the app stays live and
 * responsive (no baked-in screenshot).
 *
 *   titanium rim  ->  black bezel  ->  screen (393×852 pt ratio ≈ 2.168:1)
 *   + Dynamic Island, side buttons (action / volume / power), soft drop shadow.
 */
import { useFitSize } from '../useFitSize.js'

export default function PhoneShell({ children }) {
  // Size the screen in JS px (reserves room for bezel+rim+margin). Reliable in
  // old in-app webviews that don't support aspect-ratio / dvh.
  const { w, h } = useFitSize(393 / 852, 50, 50)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#ececef]">
      {/* titanium rim */}
      <div className="relative rounded-[60px] bg-gradient-to-br from-[#e6e6ea] via-[#aeaeb4] to-[#9a9aa1] p-[4px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45),0_8px_24px_rgba(0,0,0,0.2)]">
        {/* side buttons (on the metal edge) */}
        <span className="absolute -left-[3px] top-[120px] h-9 w-[4px] rounded-l bg-gradient-to-b from-[#c9c9cf] to-[#86868c]" />
        <span className="absolute -left-[3px] top-[175px] h-16 w-[4px] rounded-l bg-gradient-to-b from-[#c9c9cf] to-[#86868c]" />
        <span className="absolute -left-[3px] top-[255px] h-16 w-[4px] rounded-l bg-gradient-to-b from-[#c9c9cf] to-[#86868c]" />
        <span className="absolute -right-[3px] top-[200px] h-24 w-[4px] rounded-r bg-gradient-to-b from-[#c9c9cf] to-[#86868c]" />

        {/* black bezel */}
        <div className="rounded-[56px] bg-black p-[13px]">
          {/* screen — explicit px size from JS (no aspect-ratio/dvh reliance) */}
          <div className="relative overflow-hidden rounded-[45px] bg-neutral-50" style={{ width: w, height: h }}>
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-[11px] z-50 flex h-[32px] w-[118px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2.5">
              <span className="h-2 w-2 rounded-full bg-[#1c1c22] ring-1 ring-[#2c2c34]" />
            </div>

            {/* status bar (overlay, dark text) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-8 pt-[18px] text-[13px] font-semibold text-black">
              <span className="flex items-center gap-1">9:41 <span className="text-[10px]">➤</span></span>
              <span className="flex items-center gap-1.5 text-[11px]">
                <span>‖‖</span>
                <span>📶</span>
                <span className="rounded-sm border border-black/70 px-1 text-[9px] leading-tight">100</span>
              </span>
            </div>

            {/* screen body */}
            <main className="absolute inset-0 overflow-y-auto bg-neutral-50">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
