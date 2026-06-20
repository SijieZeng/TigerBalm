import { GameProvider, useGame } from './state/gameStore.jsx'
import PhoneShell from './components/PhoneShell.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import MapScreen from './screens/MapScreen.jsx'
import BackpackScreen from './screens/BackpackScreen.jsx'
import SynthesisScreen from './screens/SynthesisScreen.jsx'
import CouponScreen from './screens/CouponScreen.jsx'

const SCREENS = {
  home: HomeScreen,
  map: MapScreen,
  backpack: BackpackScreen,
  synth: SynthesisScreen,
  coupon: CouponScreen,
}

function ActiveScreen() {
  const { state } = useGame()
  const Screen = SCREENS[state.screen] ?? HomeScreen
  return <Screen />
}

export default function App() {
  return (
    <GameProvider>
      <PhoneShell>
        <ActiveScreen />
      </PhoneShell>
    </GameProvider>
  )
}
