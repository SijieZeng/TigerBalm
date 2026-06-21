import { useGame } from '../state/gameStore.jsx'

/**
 * Home = the baked iPhone 15 mockup image (device fills the canvas now — the
 * transparent margins were cropped, so it renders at the same size/ratio as the
 * CSS phone frame on the other screens). No scroll. The only interactive area
 * is the "Today's Ingredient Hunt / Start hunt" card, which enters the map.
 *
 * HOTSPOT is a % of the device image; nudge it if the card alignment drifts.
 */
const HOTSPOT = { left: '8%', top: '57%', width: '84%', height: '18%' }

export default function HomeScreen() {
  const { dispatch } = useGame()
  return (
    <div className="flex h-dvh w-screen items-center justify-center overflow-hidden bg-[#ececef]">
      {/* sized to fit BOTH visible height (dvh) and width — mobile-safe */}
      <div className="relative aspect-[1412/2830] h-[min(96dvh,calc(94vw*2830/1412))]">
        <img
          src="/images/ui/home_mockup.png"
          alt="Uber Eats — Today's Hunger Hunt"
          draggable="false"
          className="h-full w-full select-none"
        />
        {/* clickable hotspot over the Ingredient Hunt / Start hunt card */}
        <button
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'map' })}
          aria-label="Start hunt"
          className="absolute cursor-pointer rounded-2xl focus:outline-none"
          style={HOTSPOT}
        />
      </div>
    </div>
  )
}
