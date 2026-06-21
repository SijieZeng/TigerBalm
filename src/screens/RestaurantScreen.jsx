import { useGame } from '../state/gameStore.jsx'
import FoodImage from '../components/FoodImage.jsx'

// Short reward tag, reused from the coupon logic.
function shortReward(tier) {
  if (!tier) return 'deal'
  const r = tier.reward
  if (r.type === 'dish_free') return 'Free dish'
  if (r.type === 'order_percent') return `${r.value}% off order`
  return `${r.value}% off`
}
function discountedPrice(price, tier, isDealItem) {
  if (!tier || !isDealItem) return null
  const r = tier.reward
  if (r.type === 'dish_free') return 0
  if (r.type === 'dish_percent') return +(price * (1 - r.value / 100)).toFixed(2)
  if (r.type === 'order_percent') return +(price * (1 - r.value / 100)).toFixed(2)
  return null
}

/** Mockup 7 — restaurant page with the unlocked Oracle deal banner + menu. */
export default function RestaurantScreen() {
  const { state, dispatch } = useGame()
  const coupon = state.coupon
  const restaurant = coupon?.restaurant ?? null
  if (!restaurant) return null
  const dealName = coupon?.dish?.name
  const tag = shortReward(coupon?.tier)

  return (
    <div className="min-h-full bg-white pb-10">
      {/* top bar (no hero image) */}
      <div className="flex items-center justify-between px-4 pb-1 pt-14">
        <button onClick={() => dispatch({ type: 'RESET_TO_MAP' })} className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-lg">←</button>
        <div className="flex gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">🔍</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">♡</span>
        </div>
      </div>

      {/* title block — store name + small logo thumbnail */}
      <div className="px-5 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow ring-1 ring-black/5">
            <FoodImage src={restaurant.logoImg} emoji={restaurant.logo} alt={restaurant.name} className="h-full w-full" emojiClass="text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold leading-tight">{restaurant.name}</h1>
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm">
          <span className="font-semibold">⭐ {restaurant.rating}</span>
          <span className="text-neutral-500">({restaurant.ratingCount}) · {restaurant.distanceKm} km ›</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm text-neutral-500">📍 {restaurant.address} ›</div>
        <div className="mt-1 text-sm text-neutral-500">
          🛵 Delivery €{restaurant.deliveryFee.toFixed(2)} · {restaurant.deliveryEta} &nbsp;|&nbsp; 🛍️ Pickup · {restaurant.pickupEta}
        </div>

        {/* delivery/pickup toggle */}
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-[#06C167]/10 px-4 py-2 text-sm font-semibold text-[#048a49]">🛵 Delivery</span>
          <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-600">🛍️ Pickup</span>
        </div>

        {/* ===== Oracle deal banner ===== */}
        <div className="relative mt-4 overflow-hidden rounded-2xl bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-2xl text-white">$</div>
            <div>
              <div className="font-bold">{dealName} deal unlocked</div>
              <div className="text-sm font-semibold text-red-500">{tag} on selected items</div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-red-400">🕐 Expired at today 23:59</div>
            </div>
          </div>
        </div>

        {/* fees row */}
        <div className="mt-4 flex divide-x divide-neutral-200 rounded-2xl border border-neutral-200 text-center">
          <div className="flex-1 py-3"><div className="font-bold">€0</div><div className="text-xs text-neutral-500">Other fees ⓘ</div></div>
          <div className="flex-1 py-3"><div className="font-bold">{restaurant.pickupEta}</div><div className="text-xs text-neutral-500">Prep time</div></div>
        </div>

        {/* category chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="whitespace-nowrap rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">★ Featured</span>
          {['Pizzas', 'Sides', 'Desserts', 'Drinks'].map((c) => (
            <span key={c} className="whitespace-nowrap rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600">{c}</span>
          ))}
        </div>

        <h2 className="mt-5 text-lg font-bold">Browse menu</h2>
      </div>

      {/* menu list */}
      <div className="mt-2 divide-y divide-neutral-100">
        {restaurant.menu.map((item) => {
          // The deal applies to the menu item matching the cooked dish name.
          const isDeal = dealName && item.name.toLowerCase().includes(dealName.split(' ')[0].toLowerCase())
          const dPrice = discountedPrice(item.price, coupon?.tier, isDeal)
          return (
            <div key={item.id} className="flex items-start gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="font-bold">{item.name}</div>
                <p className="mt-0.5 text-sm text-neutral-500">{item.desc}</p>
                {isDeal && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-[#06C167]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#048a49]">🏷️ Oracle match</span>
                    <span className="rounded-md bg-[#06C167]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#048a49]">{tag}</span>
                  </div>
                )}
                <div className="mt-1 flex items-center gap-2">
                  {dPrice != null ? (
                    <>
                      <span className="font-bold text-[#048a49]">{dPrice === 0 ? 'FREE' : `€${dPrice.toFixed(2)}`}</span>
                      <span className="text-sm text-neutral-400 line-through">€{item.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="font-bold">€{item.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <div className="relative">
                <FoodImage src={item.image} emoji="🍽️" alt={item.name} className="h-20 w-24" emojiClass="text-4xl" />
                <button className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg text-[#06C167] shadow ring-1 ring-neutral-100">＋</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
