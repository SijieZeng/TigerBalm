/**
 * ============================================================================
 * Uber Eats Oracle — Mock Data  (aligned to the UI design mockups)
 * ============================================================================
 *
 * BLOCK A — THE WORLD (Uber Eats database), 3 normalized datasets joined
 *   many-to-many by id:   ingredients <-> dishes <-> restaurants
 *
 * BLOCK B — THE USER (single returning user). Two DECOUPLED preference tracks:
 *   (1) cuisine track  = orderHistory + favorites -> ranks cooked candidates
 *   (2) ingredient track = collected / discarded   -> weights map drops
 *   (Both run under the hood; neither is surfaced in the UI anymore.)
 *
 * CONFIG — game rules (capacity, discount-by-count tiers).
 *
 * Image convention: every food carries an `image` path under /public/images/.
 * If the file is missing, <FoodImage> falls back to the `emoji`. Drop real
 * photos in later and they swap in automatically — no code change.
 * ============================================================================
 */

/* ===========================================================================
 * BLOCK A — THE WORLD
 * ======================================================================== */

// --- Dataset 1: ingredients (the 8 from the ingredient art sheet) -----------
export const ingredients = [
  { id: 'tomato',     name: 'Tomato',         emoji: '🍅', image: '/images/ingredients/tomato.png',     rarity: 1, blurb: 'Bright, juicy, comfort-friendly', tags: ['Pizza', 'Pasta', 'Soup'] },
  { id: 'basil',      name: 'Basil',          emoji: '🌿', image: '/images/ingredients/basil.png',      rarity: 1, blurb: 'Fragrant, fresh, herby',          tags: ['Pizza', 'Pasta', 'Salads'] },
  { id: 'mozzarella', name: 'Buffalo Mozz',   emoji: '🧀', image: '/images/ingredients/mozzarella.png', rarity: 2, blurb: 'Creamy, melty, crowd-pleasing',    tags: ['Pizza', 'Salads'] },
  { id: 'dough',      name: 'Pizza Dough',    emoji: '🫓', image: '/images/ingredients/dough.png',      rarity: 1, blurb: 'Soft, chewy, the foundation',      tags: ['Pizza', 'Pasta'] },
  { id: 'garlic',     name: 'Garlic',         emoji: '🧄', image: '/images/ingredients/garlic.png',     rarity: 1, blurb: 'Pungent, savory, aromatic',        tags: ['Pasta', 'Soup'] },
  { id: 'oliveoil',   name: 'Olive Oil',      emoji: '🫒', image: '/images/ingredients/oliveoil.png',   rarity: 2, blurb: 'Smooth, golden, finishing touch',   tags: ['Pasta', 'Salads'] },
  { id: 'chili',      name: 'Chili',          emoji: '🌶️', image: '/images/ingredients/chili.png',      rarity: 2, blurb: 'Spicy, bold, warming',             tags: ['Pasta'] },
  { id: 'shrimp',     name: 'Shrimp',         emoji: '🦐', image: '/images/ingredients/shrimp.png',     rarity: 3, blurb: 'Sweet, tender, a little luxe',       tags: ['Pasta'], allergen: 'seafood' },
]

// --- Dataset 2: dishes (the "cuisine" records) -----------------------------
// Each dish: name, cuisineType (菜系), main ingredients, a marketing blurb and
// a "label" used on the Cooked Cuisines cards (Best deal / Strong match / ...).
export const dishes = [
  { id: 'margherita',     name: 'Margherita Pizza', cuisineType: 'Italian', ingredientIds: ['tomato', 'basil', 'mozzarella', 'dough'],            image: '/images/dishes/margherita.jpg',    blurb: 'A timeless classic, baked golden with fresh basil.' },
  { id: 'pasta_pomodoro', name: 'Pasta Pomodoro',   cuisineType: 'Italian', ingredientIds: ['tomato', 'basil', 'garlic', 'oliveoil', 'dough'],    image: '/images/dishes/pasta_pomodoro.jpg', blurb: 'Comforting, rich, and closely matched to your ingredients.' },
  { id: 'caprese',        name: 'Caprese Salad',    cuisineType: 'Italian', ingredientIds: ['tomato', 'mozzarella', 'basil', 'oliveoil'],         image: '/images/dishes/caprese.jpg',       blurb: 'Fresh, quick, and ideal for a light bite.' },
  { id: 'tomato_soup',    name: 'Tomato Soup',      cuisineType: 'Italian', ingredientIds: ['tomato', 'garlic', 'basil', 'oliveoil'],             image: '/images/dishes/tomato_soup.jpg',   blurb: 'Warm, cozy, and made for slow evenings.' },
  { id: 'aglio_olio',     name: 'Aglio e Olio',     cuisineType: 'Italian', ingredientIds: ['dough', 'garlic', 'oliveoil', 'chili'],              image: '/images/dishes/aglio_olio.jpg',    blurb: 'Garlicky, glossy, with a gentle kick of chili.' },
  { id: 'shrimp_pasta',   name: 'Shrimp Aglio Pasta', cuisineType: 'Italian', ingredientIds: ['dough', 'shrimp', 'garlic', 'chili', 'oliveoil'],  image: '/images/dishes/shrimp_pasta.jpg',  blurb: 'Succulent shrimp tossed in a spicy garlic oil.' },
]

// --- Dataset 3: restaurants (with a small menu for the restaurant screen) ---
export const restaurants = [
  {
    id: 'tonys',
    name: "Domino's",
    cuisineType: 'Italian',
    logo: '🍕',
    logoImg: '/images/restaurants/tonys.jpg',
    rating: 4.5,
    ratingCount: '2,000+',
    distanceKm: 3.2,
    address: 'Overtoom 71, 1054 HG Amsterdam',
    deliveryFee: 1.99,
    deliveryEta: '20–35 min',
    pickupEta: '10 min',
    dishIds: ['margherita', 'pasta_pomodoro', 'caprese'],
    menu: [
      { id: 'm_margherita', name: 'Margherita Pizza', desc: 'Classic delight with tomato sauce, mozzarella and fresh basil.', price: 14.99, image: '/images/dishes/margherita.jpg' },
      { id: 'm_pepperoni',  name: 'Pepperoni Passion', desc: 'Loaded with pepperoni and 100% mozzarella cheese.', price: 14.99, image: '/images/dishes/pepperoni.jpg' },
      { id: 'm_breadsticks', name: 'Cheesy Breadsticks', desc: 'Oven-baked breadsticks with garlic and melted cheese.', price: 6.49, image: '/images/dishes/breadsticks.jpg' },
    ],
  },
  {
    id: 'bella',
    name: 'Spaghetteria',
    cuisineType: 'Italian',
    logo: '🍝',
    logoImg: '/images/restaurants/bella.jpg',
    rating: 4.6,
    ratingCount: '1,500+',
    distanceKm: 0.8,
    address: 'Ceintuurbaan 124, 1072 GA Amsterdam',
    deliveryFee: 0.99,
    deliveryEta: '20–30 min',
    pickupEta: '12 min',
    dishIds: ['pasta_pomodoro', 'aglio_olio', 'tomato_soup', 'shrimp_pasta'],
    menu: [
      { id: 'b_pasta', name: 'Pasta Pomodoro', desc: 'Rich tomato sauce with basil, garlic and olive oil.', price: 12.99, image: '/images/dishes/pasta_pomodoro.jpg' },
      { id: 'b_aglio', name: 'Aglio e Olio', desc: 'Garlic, olive oil and chili over fresh pasta.', price: 11.49, image: '/images/dishes/aglio_olio.jpg' },
      { id: 'b_soup', name: 'Tomato Soup', desc: 'Slow-simmered tomato soup with a basil swirl.', price: 7.49, image: '/images/dishes/tomato_soup.jpg' },
    ],
  },
  {
    id: 'green_bowl',
    name: 'Dolce Verona',
    cuisineType: 'Italian',
    logo: '🍅',
    logoImg: '/images/restaurants/green_bowl.jpg',
    rating: 4.4,
    ratingCount: '900+',
    distanceKm: 1.4,
    address: 'Kinkerstraat 45, 1053 DE Amsterdam',
    deliveryFee: 1.49,
    deliveryEta: '25–35 min',
    pickupEta: '15 min',
    dishIds: ['margherita', 'tomato_soup', 'caprese'],
    menu: [
      { id: 'g_marg', name: 'Margherita Pizza', desc: 'Tomato, mozzarella and basil, wood-fired.', price: 13.49, image: '/images/dishes/margherita.jpg' },
      { id: 'g_caprese', name: 'Caprese Salad', desc: 'Tomato, mozzarella and basil with olive oil.', price: 8.99, image: '/images/dishes/caprese.jpg' },
      { id: 'g_soup', name: 'Tomato Soup', desc: 'Light tomato soup with garden herbs.', price: 6.99, image: '/images/dishes/tomato_soup.jpg' },
    ],
  },
]

/* ===========================================================================
 * CONFIG — game rules
 * ======================================================================== */

export const config = {
  // Collecting is unlimited per day; the KITCHEN cap is the real constraint.
  // A full kitchen forces a replace (discard = a personalization signal).
  capacity: {
    base: 3,        // usable slots for everyone
    plus: 5,        // Uber One members unlock 2 more (shown locked in the UI)
  },
  lockedSlots: 2,   // how many "Plus Unlock" slots to render after the base ones

  // Smart discount = how many ingredients the user commits to a cook.
  // Rounds DOWN to the nearest tier.
  discountTiers: [
    { ingredientsUsed: 1, reward: { type: 'dish_percent', value: 50, scope: 'dish' },  label: '50% off this dish',     note: 'Same-day reward — a low-friction hook.' },
    { ingredientsUsed: 3, reward: { type: 'dish_free',    value: 100, scope: 'dish' },  label: 'This dish is FREE',     note: 'Restaurant still keeps the delivery fee — pure traffic driver.' },
    { ingredientsUsed: 5, reward: { type: 'order_percent', value: 20, scope: 'order' }, label: '20% off your order',    note: 'Uber One only (5 slots) — a 5-day investment.' },
  ],
}

/* ===========================================================================
 * BLOCK B — THE USER (single returning user)
 * ======================================================================== */

export const users = [
  {
    id: 'returning',
    name: 'Ava',
    isMember: false, // standard -> 2 kitchen slots are locked ("Plus Unlock")
    allergens: [],

    // TRACK 1 (cuisine) -> ranks cooked candidates
    orderHistory: [
      { dishId: 'margherita',     restaurantId: 'tonys', count: 6 },
      { dishId: 'caprese',        restaurantId: 'green_bowl', count: 3 },
      { dishId: 'pasta_pomodoro', restaurantId: 'bella', count: 2 },
    ],
    favorites: {
      restaurantIds: ['tonys', 'green_bowl'],
      dishIds: ['margherita', 'caprese'],
      cuisineTypes: ['Italian'],
    },

    // TRACK 2 (ingredient) -> weights map drops
    ingredientTrack: {
      collected: { tomato: 5, mozzarella: 4, basil: 3, dough: 2 },
      discarded: { shrimp: 3, chili: 2 },
    },

    // Runtime game state — start empty so the demo plays from a clean map.
    backpack: [],
  },
]

/* ===========================================================================
 * Convenience lookups (by id)
 * ======================================================================== */
export const ingredientById = Object.fromEntries(ingredients.map((i) => [i.id, i]))
export const dishById = Object.fromEntries(dishes.map((d) => [d.id, d]))
export const restaurantById = Object.fromEntries(restaurants.map((r) => [r.id, r]))
