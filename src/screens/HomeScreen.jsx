import { useGame } from '../state/gameStore.jsx'
import { useFitSize } from '../useFitSize.js'
import { asset } from '../asset.js'

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
  const { w, h } = useFitSize(1412 / 2830, 8, 8)
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#ececef]">
      {/* explicit px size from JS (no aspect-ratio/dvh reliance) */}
      <div className="relative" style={{ width: w, height: h }}>
        <img
          src={asset('/images/ui/home_mockup.png')}
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
