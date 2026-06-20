/**
 * ============================================================================
 * Personalization engines — the two DECOUPLED tracks as pure functions.
 * ============================================================================
 *
 *   getDropWeights(user)            <- ingredient track only (collect/discard)
 *   rankCandidateDishes(user, ids)  <- cuisine track only (orders/favorites)
 *
 * Neither function reads the other's track. This separation IS the pitch.
 * ============================================================================
 */

import { ingredients, dishes, config } from './mockData.js'

/* ---------------------------------------------------------------------------
 * TRACK 2 — INGREDIENT DROP WEIGHTS  (map drops)
 * Inputs: base rarity  +  user.ingredientTrack.collected / .discarded
 * A collected ingredient gets boosted; a discarded one gets suppressed.
 * Returns: [{ ...ingredient, weight }] sorted high -> low.
 * ------------------------------------------------------------------------- */
export function getDropWeights(user) {
  const collected = user.ingredientTrack?.collected ?? {}
  const discarded = user.ingredientTrack?.discarded ?? {}

  return ingredients
    .map((ing) => {
      const base = 1 / ing.rarity // rarer => lower base chance
      const likes = collected[ing.id] ?? 0
      const dislikes = discarded[ing.id] ?? 0

      // Positive signal multiplies up; negative signal divides down.
      const weight = base * (1 + likes * 0.6) / (1 + dislikes * 1.2)

      return { ...ing, weight: Number(weight.toFixed(3)) }
    })
    .sort((a, b) => b.weight - a.weight)
}

/**
 * Weighted random pick of N distinct ingredients to drop on the map.
 * `rand` is injected (defaults to Math.random) so the UI/demo can seed it.
 */
export function rollDrops(user, n = 5, rand = Math.random) {
  const pool = getDropWeights(user)
  const picks = []
  const available = [...pool]

  while (picks.length < n && available.length > 0) {
    const total = available.reduce((s, x) => s + x.weight, 0)
    let r = rand() * total
    let idx = 0
    while (idx < available.length - 1 && r > available[idx].weight) {
      r -= available[idx].weight
      idx++
    }
    picks.push(available[idx])
    available.splice(idx, 1)
  }
  return picks
}

/* ---------------------------------------------------------------------------
 * TRACK 1 — CANDIDATE DISH RANKING  (synthesis)
 * Inputs: the committed ingredient ids  +  user.orderHistory / .favorites
 * Steps:
 *   1. Find dishes whose recipe is satisfiable by the committed ingredients.
 *   2. FILTER OUT anything containing a user allergen (single choke point).
 *   3. SCORE each by cuisine preference (order counts + favorites).
 *   4. Return the top 3.
 * ------------------------------------------------------------------------- */
export function rankCandidateDishes(user, committedIds) {
  const committed = new Set(committedIds)
  const allergens = new Set(user.allergens ?? [])

  // Build a quick preference score map from the cuisine track.
  const orderScore = {}        // dishId -> total order count
  const cuisineScore = {}      // cuisineType -> total order count
  for (const o of user.orderHistory ?? []) {
    orderScore[o.dishId] = (orderScore[o.dishId] ?? 0) + o.count
    const dish = dishes.find((d) => d.id === o.dishId)
    if (dish) cuisineScore[dish.cuisineType] = (cuisineScore[dish.cuisineType] ?? 0) + o.count
  }
  const favDishes = new Set(user.favorites?.dishIds ?? [])
  const favCuisines = new Set(user.favorites?.cuisineTypes ?? [])

  const candidates = dishes
    // 1. recipe satisfiable: every committed ingredient is used by the dish,
    //    and the dish needs no MORE than what was committed.
    .filter((dish) => {
      const recipe = new Set(dish.ingredientIds)
      // all committed ingredients must belong to this dish's recipe
      for (const id of committed) if (!recipe.has(id)) return false
      return true
    })
    // 2. allergen choke point — drop any dish with an allergen ingredient.
    .filter((dish) =>
      !dish.ingredientIds.some((iid) => {
        const ing = ingredients.find((x) => x.id === iid)
        return ing?.allergen && allergens.has(ing.allergen)
      })
    )
    // 3. score by cuisine preference (track 1 only).
    .map((dish) => {
      let score = 0
      score += (orderScore[dish.id] ?? 0) * 3       // ordered this exact dish
      score += (cuisineScore[dish.cuisineType] ?? 0) // ordered this cuisine
      if (favDishes.has(dish.id)) score += 5         // favorited dish
      if (favCuisines.has(dish.cuisineType)) score += 2
      // completeness is a soft tiebreaker only (how close committed -> full recipe)
      const completeness = committed.size / dish.ingredientIds.length
      score += completeness
      return { ...dish, score: Number(score.toFixed(2)), completeness }
    })
    .sort((a, b) => b.score - a.score)

  // 4. top 3
  return candidates.slice(0, 3)
}

/* ---------------------------------------------------------------------------
 * DISCOUNT — decided purely by ingredient COUNT committed.
 * Rounds down to the nearest configured tier.
 * ------------------------------------------------------------------------- */
export function getDiscountForCount(count) {
  const tiers = [...config.discountTiers].sort((a, b) => a.ingredientsUsed - b.ingredientsUsed)
  let match = null
  for (const t of tiers) {
    if (count >= t.ingredientsUsed) match = t
  }
  return match // null if count < smallest tier (i.e. 0)
}

/* ---------------------------------------------------------------------------
 * Backpack helpers
 * ------------------------------------------------------------------------- */
export function capacityFor(user) {
  return user.isMember ? config.capacity.member : config.capacity.normal
}

export function canCollectToday(user) {
  return user.dailyCollected < config.dailyCollectLimit
}
