import { motion } from 'framer-motion'
import { useGame } from '../state/gameStore.jsx'
import { restaurants } from '../data/mockData.js'
import FoodImage from '../components/FoodImage.jsx'

/** Mockup 5 — cooked candidates. White bg, heading text, then 3 image-only
 *  cards (no captions). All fit on one screen (no scroll). */
function restaurantForDish(dish, user) {
  const serving = restaurants.filter((r) => r.dishIds.includes(dish.id))
  const fav = serving.find((r) => user.favorites?.restaurantIds?.includes(r.id))
  return fav ?? serving[0] ?? restaurants[0]
}

export default function CookedScreen() {
  const { state, dispatch, user } = useGame()
  const cooked = state.cooked

  function pick(dish) {
    dispatch({ type: 'PICK_DISH', dish, restaurant: restaurantForDish(dish, user) })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* heading */}
      <div className="shrink-0 px-6 pb-1 pt-14 text-center">
        <h2 className="text-[22px] font-extrabold leading-tight text-neutral-900">
          Your Oracle found {cooked.length} cuisines
        </h2>
        <p className="mt-1 text-sm text-neutral-500">Based on your ingredients and nearby menus</p>
      </div>

      {/* image-only cards fill the height (no scroll, no captions) */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-6 pt-3">
        {cooked.map((dish, idx) => (
          <motion.button
            key={dish.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            onClick={() => pick(dish)}
            className="min-h-0 flex-1 overflow-hidden rounded-3xl shadow-[0_4px_18px_rgba(0,0,0,0.12)] ring-1 ring-neutral-100 transition active:scale-[0.98]"
          >
            <FoodImage src={dish.image} emoji="🍽️" alt={dish.name} rounded="rounded-3xl" className="h-full w-full" emojiClass="text-6xl" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
