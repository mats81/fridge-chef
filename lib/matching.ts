import { Recipe, DietTag } from "@/lib/types";
import { expandIngredients, hasIngredient, translateIngredientName } from "@/lib/ingredient-meta";
import { deriveDietTags } from "@/lib/diet";

type MatchFilters = Partial<Record<DietTag, boolean>>;

export interface Recommendation {
  recipe: Recipe;
  score: number;
  matched: string[];
  missing: string[];
  reason: string;
}

function activeFilters(filters: MatchFilters): DietTag[] {
  return Object.entries(filters)
    .filter(([, value]) => value)
    .map(([key]) => key as DietTag);
}

/**
 * Runtime recipes (online, AI) ship without diet tags. Falling back to derived
 * tags keeps them eligible instead of silently dropping them on every filter.
 */
function dietTagsFor(recipe: Recipe): DietTag[] {
  return recipe.diet.length > 0 ? recipe.diet : deriveDietTags(recipe);
}

function supportsFilters(recipe: Recipe, active: DietTag[]) {
  if (active.length === 0) return true;
  const diet = dietTagsFor(recipe);
  return active.every((filter) => diet.includes(filter));
}

function bucketFor(recipe: Recipe) {
  if (recipe.timeMinutes <= 20 || recipe.tags.includes("light")) return "quick";
  if (recipe.tags.includes("comfort") || recipe.category === "bake") return "hearty";
  return "creative";
}

function similarity(a: Recipe, b: Recipe) {
  let penalty = 0;
  if (a.category === b.category) penalty += 1.1;
  if (a.base === b.base) penalty += 1.2;
  if (a.method === b.method) penalty += 0.9;
  if (a.cuisine === b.cuisine) penalty += 0.8;
  return penalty;
}

export function getRecommendations(
  recipes: Recipe[],
  availableIngredients: string[],
  filters: MatchFilters = {},
  variation = 0
): Recommendation[] {
  const have = expandIngredients(availableIngredients);
  const active = activeFilters(filters);

  const candidates = recipes
    .filter((recipe) => supportsFilters(recipe, active))
    .map((recipe) => {
      const required = recipe.ingredients.filter((i) => !i.optional);
      const matchedIngredients = required.filter((i) => hasIngredient(have, i.name));
      const missingIngredients = required.filter((i) => !matchedIngredients.includes(i));

      const matched = matchedIngredients.map(
        (i) => i.displayName ?? translateIngredientName(i.name)
      );
      const missing = missingIngredients.map(
        (i) => i.displayName ?? translateIngredientName(i.name)
      );

      const coverage = required.length ? matched.length / required.length : 0;
      let score = 0;

      score += matched.length * 8;
      score += coverage * 36;
      score -= missing.length * 4;

      if (filters.quick && recipe.timeMinutes <= 20) score += 10;
      if (filters.budget && recipe.diet.includes("budget")) score += 8;
      if (filters["high-protein"] && recipe.diet.includes("high-protein")) score += 9;
      if (filters["kid-friendly"] && recipe.diet.includes("kid-friendly")) score += 7;

      if (recipe.tags.includes("creative")) score += 2;
      if (recipe.tags.includes("light")) score += 1.5;
      if (recipe.tags.includes("comfort")) score += 1.5;

      const reason =
        missing.length === 0
          ? `Du hast alle ${required.length} Hauptzutaten zuhause — direkt loslegen!`
          : matched.length > 0
            ? `Du hast ${matched.length} von ${required.length} Hauptzutaten zuhause, es fehlt nur noch ${missing.length === 1 ? "1 Ergänzung" : `${missing.length} Ergänzungen`}.`
            : `Dieses Rezept nutzt deine Basiszutaten gut und braucht nur wenige einfache Ergänzungen.`;

      return { recipe, score, matched, missing, reason };
    })
    .sort((a, b) => b.score - a.score);

  // Rotate bucket order based on variation so each click yields different picks
  const allBuckets = ["quick", "hearty", "creative"];
  const offset = variation % allBuckets.length;
  const preferredBuckets = [
    ...allBuckets.slice(offset),
    ...allBuckets.slice(0, offset)
  ];

  const round = Math.floor(variation / allBuckets.length);
  const selected: Recommendation[] = [];

  for (const bucket of preferredBuckets) {
    const bucketCandidates = candidates.filter(
      (c) => bucketFor(c.recipe) === bucket && !selected.some((s) => s.recipe.id === c.recipe.id)
    );

    if (bucketCandidates.length === 0) continue;

    // Wrap around instead of clamping, so "3 neue Ideen" keeps cycling
    // through the bucket rather than getting stuck on the last entry.
    const candidate = bucketCandidates[round % bucketCandidates.length];
    if (candidate) selected.push(candidate);
  }

  for (const candidate of candidates) {
    if (selected.length === 3) break;
    if (selected.some((s) => s.recipe.id === candidate.recipe.id)) continue;

    const penalty = selected.reduce((sum, item) => sum + similarity(item.recipe, candidate.recipe), 0);
    const adjusted = candidate.score - penalty * 7;

    if (adjusted > 8) selected.push(candidate);
  }

  while (selected.length < 3) {
    const fallback = candidates.find((c) => !selected.some((s) => s.recipe.id === c.recipe.id));
    if (!fallback) break;
    selected.push(fallback);
  }

  return selected.slice(0, 3);
}
