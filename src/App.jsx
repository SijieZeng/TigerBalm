import { GameProvider, useGame } from './state/gameStore.jsx'
import PhoneShell from './components/PhoneShell.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import MapScreen from './screens/MapScreen.jsx'
import KitchenScreen from './screens/KitchenScreen.jsx'
import CookedScreen from './screens/CookedScreen.jsx'
import CouponScreen from './screens/CouponScreen.jsx'
import RestaurantScreen from './screens/RestaurantScreen.jsx'

const SCREENS = {
  map: MapScreen,
  kitchen: KitchenScreen,
  cooked: CookedScreen,
  coupon: CouponScreen,
  restaurant: RestaurantScreen,
}

function Root() {
  const { state } = useGame()

  // Home is the baked full-device mockup image — rendered without the CSS frame.
  if (state.screen === 'home') return <HomeScreen />

  const Screen = SCREENS[state.screen] ?? MapScreen
  return (
    <PhoneShell>
      <Screen />
    </PhoneShell>
  )
}

export default function App() {
  return (
    <GameProvider>
      <Root />
    </GameProvider>
  )
}
