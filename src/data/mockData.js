/**
 * ============================================================================
 * Uber Eats Oracle — Mock Data
 * ============================================================================
 *
 * TWO TOP-LEVEL BLOCKS, fully decoupled (no weighted merge):
 *
 *   BLOCK A — THE WORLD (Uber Eats database)
 *     3 normalized datasets joined many-to-many by id:
 *       ingredients  <—many:many—  dishes  <—many:many—  restaurants
 *
 *   BLOCK B — THE USERS
 *     Each user carries TWO independent preference tracks:
 *       (1) cuisine track  = orderHistory + favorites
 *             -> ONLY ranks the 3 candidate dishes at synthesis time.
 *       (2) ingredient track = collected / discarded history
 *             -> ONLY weights which ingredients drop on the map.
 *       The two tracks never touch each other.
 *
 *   CONFIG — game rules (daily cap, capacity, discount tiers)
 *
 * All relationships use id references so the data scales: add an ingredient,
 * a dish, a restaurant, or a user without rewriting anything else.
 * ============================================================================
 */

/* ===========================================================================
 * BLOCK A — THE WORLD
 * ======================================================================== */

// --- Dataset 1: ingredients -------------------------------------------------
// Atomic collectibles that drop on the map. `rarity` is a base drop modifier
// (1 = common, 3 = rare); the per-user ingredient track multiplies on top.
export const ingredients = [
  { id: 'tomato',     name: 'Tomato',         emoji: '🍅', rarity: 1 },
  { id: 'basil',      name: 'Basil',          emoji: '🌿', rarity: 1 },
  { id: 'mozzarella', name: 'Buffalo Mozz',   emoji: '🧀', rarity: 2 },
  { id: 'dough',      name: 'Pizza Dough',    emoji: '🫓', rarity: 1 },
  { id: 'garlic',     name: 'Garlic',         emoji: '🧄', rarity: 1 },
  { id: 'oliveoil',   name: 'Olive Oil',      emoji: '🫒', rarity: 2 },
  { id: 'chili',      name: 'Chili',          emoji: '🌶️', rarity: 2 },
  { id: 'shrimp',     name: 'Shrimp',         emoji: '🦐', rarity: 3, allergen: 'seafood' },
]

// --- Dataset 2: dishes (the "cuisine" records) -----------------------------
// Each dish has 3 tags: name, cuisineType (菜系), and up to 5 main ingredients.
// One ingredient appears in many dishes ("一料多用"); one dish lives in many
// restaurants (see restaurants below).
export const dishes = [
  {
    id: 'margherita',
    name: 'Margherita Pizza',
    cuisineType: 'Italian',
    ingredientIds: ['tomato', 'basil', 'mozzarella', 'dough', 'oliveoil'],
  },
  {
    id: 'pasta_pomodoro',
    name: 'Pasta Pomodoro',
    cuisineType: 'Italian',
    ingredientIds: ['tomato', 'basil', 'garlic', 'oliveoil', 'dough'],
  },
  {
    id: 'tomato_soup',
    name: 'Tomato Soup',
    cuisineType: 'Italian',
    ingredientIds: ['tomato', 'garlic', 'basil', 'oliveoil'],
  },
  {
    id: 'aglio_e_olio',
    name: 'Aglio e Olio',
    cuisineType: 'Italian',
    ingredientIds: ['dough', 'garlic', 'oliveoil', 'chili'],
  },
  {
    id: 'caprese',
    name: 'Caprese Salad',
    cuisineType: 'Italian',
    ingredientIds: ['tomato', 'mozzarella', 'basil', 'oliveoil'],
  },
  {
    // Exists in the world but should be FILTERED OUT for seafood-allergic users.
    id: 'shrimp_aglio',
    name: 'Shrimp Aglio Pasta',
    cuisineType: 'Italian',
    ingredientIds: ['dough', 'shrimp', 'garlic', 'chili', 'oliveoil'],
  },
]

// --- Dataset 3: restaurants -------------------------------------------------
// Each restaurant has a name + cuisineType and serves a set of dishes.
// Same dish can be served by multiple restaurants (many-to-many via dishIds).
export const restaurants = [
  {
    id: 'tonys',
    name: "Tony's Pizzeria",
    cuisineType: 'Italian',
    dishIds: ['margherita', 'pasta_pomodoro', 'caprese'],
  },
  {
    id: 'bella',
    name: 'Bella Cucina',
    cuisineType: 'Italian',
    dishIds: ['pasta_pomodoro', 'aglio_e_olio', 'tomato_soup', 'shrimp_aglio'],
  },
  {
    id: 'nonna',
    name: "Nonna's Kitchen",
    cuisineType: 'Italian',
    dishIds: ['margherita', 'tomato_soup', 'caprese'],
  },
]

/* ===========================================================================
 * CONFIG — game rules
 * ======================================================================== */

export const config = {
  // Net backpack additions per day = 1 (discard/replace to make room).
  dailyCollectLimit: 1,

  // Backpack capacity by membership.
  capacity: {
    normal: 3,
    member: 5, // Uber One
  },

  // Smart discount is decided by HOW MANY ingredients the user commits to a
  // synthesis — NOT by recipe completeness. Because only 1 ingredient enters
  // the backpack per day, committing more = a multi-day (and member-gated)
  // investment, which keeps big rewards sustainable for restaurants.
  // Counts between thresholds round DOWN to the nearest tier.
  discountTiers: [
    {
      ingredientsUsed: 1,
      reward: { type: 'dish_percent', value: 50, scope: 'dish' },
      label: '50% off this dish',
      note: 'Same-day reward — low-friction hook.',
    },
    {
      ingredientsUsed: 3,
      reward: { type: 'dish_free', value: 100, scope: 'dish' },
      label: 'This dish is FREE',
      note: 'Restaurant still collects the delivery/min fee — pure traffic driver.',
    },
    {
      ingredientsUsed: 5,
      reward: { type: 'order_percent', value: 20, scope: 'order' },
      label: '20% off your whole order',
      note: 'Member-only (capacity 5) — a 5-day investment.',
    },
  ],
}

/* ===========================================================================
 * BLOCK B — THE USERS
 * ======================================================================== */

// Empty preference shape, reused for clarity.
const emptyCuisineTrack = { orderHistory: [], favorites: { restaurantIds: [], dishIds: [], cuisineTypes: [] } }
const emptyIngredientTrack = { collected: {}, discarded: {} }

export const users = [
  /* --------------------------------------------------------------------- *
   * NEW USER — cold start.
   * Both tracks empty => map drops are (rarity-only) random, and candidate
   * dishes have no preference signal to rank by (fall back to flat order).
   * --------------------------------------------------------------------- */
  {
    id: 'new',
    name: 'Sam',
    isMember: false,
    allergens: [],

    // TRACK 1 (cuisine): orders + favorites -> synthesis ranking only
    ...structuredCloneSafe(emptyCuisineTrack),

    // TRACK 2 (ingredient): collected/discarded -> map drop weights only
    ingredientTrack: structuredCloneSafe(emptyIngredientTrack),

    // Runtime game state
    backpack: [],          // array of ingredient ids currently held
    dailyCollected: 0,     // resets each day, capped at config.dailyCollectLimit
  },

  /* --------------------------------------------------------------------- *
   * RETURNING USER — rich profile.
   * - cuisine track: loves Italian, frequents Tony's & Nonna's.
   * - ingredient track: repeatedly collects tomato/basil/mozz,
   *     repeatedly discards shrimp/chili (negative signal).
   * - seafood allergy: shrimp dishes must be filtered at candidate-gen.
   * - Uber One member: backpack capacity 5 -> can reach the 20%-off tier.
   * --------------------------------------------------------------------- */
  {
    id: 'returning',
    name: 'Ava',
    isMember: true,
    allergens: ['seafood'],

    // TRACK 1 (cuisine)
    orderHistory: [
      { dishId: 'margherita',     restaurantId: 'tonys', count: 6 },
      { dishId: 'caprese',        restaurantId: 'tonys', count: 3 },
      { dishId: 'pasta_pomodoro', restaurantId: 'bella', count: 2 },
    ],
    favorites: {
      restaurantIds: ['tonys', 'nonna'],
      dishIds: ['margherita', 'caprese'],
      cuisineTypes: ['Italian'],
    },

    // TRACK 2 (ingredient)
    ingredientTrack: {
      collected: { tomato: 5, basil: 4, mozzarella: 3, dough: 2, oliveoil: 2 },
      discarded: { shrimp: 3, chili: 2 },
    },

    // Runtime game state — pre-seeded so the demo can synthesize immediately.
    backpack: ['tomato', 'basil', 'mozzarella'],
    dailyCollected: 0,
  },
]

/* ===========================================================================
 * Tiny helper kept local so this file has no imports.
 * (structuredClone exists in modern runtimes; guard just in case.)
 * ======================================================================== */
function structuredCloneSafe(obj) {
  return typeof structuredClone === 'function'
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj))
}

/* ===========================================================================
 * Convenience lookups (by id) — handy in components.
 * ======================================================================== */
export const ingredientById = Object.fromEntries(ingredients.map((i) => [i.id, i]))
export const dishById = Object.fromEntries(dishes.map((d) => [d.id, d]))
export const restaurantById = Object.fromEntries(restaurants.map((r) => [r.id, r]))
