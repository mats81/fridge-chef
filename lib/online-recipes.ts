import { DietTag, Recipe, Difficulty } from "@/lib/types";
import { simpleCache } from "@/lib/cache";
import { translateIngredientName } from "@/lib/ingredient-meta";
import { deriveDietTags } from "@/lib/diet";
import { saveGeneratedRecipes } from "@/lib/recipe-store";

type SpoonacularSearchResult = {
  id: number;
  title: string;
  image: string;
  missedIngredientCount?: number;
  missedIngredients?: Array<{ name?: string; original?: string }>;
  usedIngredients?: Array<{ name?: string; original?: string }>;
};

type SpoonacularDetail = {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  sourceName?: string;
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
  analyzedInstructions?: Array<{
    steps?: Array<{ number: number; step: string }>;
  }>;
  extendedIngredients?: Array<{
    name?: string;
    original?: string;
    amount?: number;
    unit?: string;
  }>;
  nutrition?: {
    nutrients?: Array<{ name: string; amount: number; unit: string }>;
  };
};

function cleanIngredientName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b\d+([.,]\d+)?\s?(g|kg|ml|l|tbsp|tsp|cup|cups|oz|lb)\b/g, " ")
    .replace(/\b(pre-made|premade|prepared|store-bought|fresh)\b/g, " ")
    .replace(/[–—/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function translateIngredient(value: string) {
  const cleaned = cleanIngredientName(value);
  return translateIngredientName(cleaned);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function mapDifficulty(minutes?: number): Difficulty {
  if (!minutes || minutes <= 20) return "Easy";
  if (minutes <= 45) return "Medium";
  return "Hard";
}

function extractSteps(detail: SpoonacularDetail): string[] {
  const instructions = detail.analyzedInstructions?.[0]?.steps;
  if (!instructions || instructions.length === 0) return [];

  return instructions
    .sort((a, b) => a.number - b.number)
    .map((s) => s.step)
    .filter(Boolean);
}

function extractNutrient(detail: SpoonacularDetail, name: string): number | undefined {
  const nutrient = detail.nutrition?.nutrients?.find(
    (n) => n.name.toLowerCase() === name.toLowerCase()
  );
  return nutrient ? Math.round(nutrient.amount) : undefined;
}

async function fetchBulkDetails(
  ids: number[],
  apiKey: string
): Promise<Map<number, SpoonacularDetail>> {
  if (ids.length === 0) return new Map();

  const cacheKey = `spoon-bulk-${ids.sort().join(",")}`;
  const cached = simpleCache.get<Map<number, SpoonacularDetail>>(cacheKey);
  if (cached) return cached;

  const url = new URL("https://api.spoonacular.com/recipes/informationBulk");
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("ids", ids.join(","));
  url.searchParams.set("includeNutrition", "true");

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(15_000)
  });
  if (!response.ok) return new Map();

  const data = (await response.json()) as SpoonacularDetail[];
  const map = new Map<number, SpoonacularDetail>();
  for (const item of data) {
    map.set(item.id, item);
  }

  simpleCache.set(cacheKey, map);
  return map;
}

/** Map Spoonacular's diet labels onto our tags and fill the gaps with heuristics. */
function mergeDiets(apiDiets: string[] | undefined, recipe: Recipe): DietTag[] {
  const tags = new Set<DietTag>(deriveDietTags(recipe));

  for (const label of apiDiets ?? []) {
    const normalized = label.toLowerCase();
    if (normalized.includes("vegetarian")) tags.add("vegetarian");
    if (normalized.includes("vegan")) tags.add("vegan");
    if (normalized.includes("gluten free")) tags.add("gluten-free");
    if (normalized.includes("dairy free")) tags.add("lactose-free");
  }

  // The API is authoritative when it says a recipe is NOT vegetarian/vegan
  const declared = (apiDiets ?? []).map((d) => d.toLowerCase());
  if (declared.length > 0) {
    if (!declared.some((d) => d.includes("vegetarian") || d.includes("vegan"))) {
      // Only trust the heuristic here; the API omits the label for meat dishes
      if (!deriveDietTags(recipe).includes("vegetarian")) {
        tags.delete("vegetarian");
        tags.delete("vegan");
      }
    }
  }

  return [...tags];
}

export async function fetchOnlineRecipesByIngredients(
  ingredients: string[],
  options?: { pantryOnly?: boolean }
): Promise<Recipe[]> {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey || ingredients.length === 0) return [];

  const cacheKey = `spoon-full-${ingredients.sort().join(",")}-${options?.pantryOnly ?? false}`;

  const cached = simpleCache.get<Recipe[]>(cacheKey);
  if (cached) return cached;

  // 1. Rezepte nach Zutaten suchen
  const searchUrl = new URL("https://api.spoonacular.com/recipes/findByIngredients");
  searchUrl.searchParams.set("apiKey", apiKey);
  searchUrl.searchParams.set("ingredients", ingredients.join(","));
  searchUrl.searchParams.set("number", "6");
  searchUrl.searchParams.set("ranking", options?.pantryOnly ? "1" : "2");
  searchUrl.searchParams.set("ignorePantry", "true");

  const searchResponse = await fetch(searchUrl.toString(), {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(15_000)
  });
  if (!searchResponse.ok) return [];

  const searchData = (await searchResponse.json()) as SpoonacularSearchResult[];
  if (searchData.length === 0) return [];

  // 2. Details für alle gefundenen Rezepte in einem Bulk-Request holen
  const ids = searchData.map((item) => item.id);
  const details = await fetchBulkDetails(ids, apiKey);

  // 3. Zusammenführen
  const result: Recipe[] = searchData.map((item) => {
    const detail = details.get(item.id);
    const steps = detail ? extractSteps(detail) : [];

    const used = (item.usedIngredients ?? []).map((i) => translateIngredient(i.name || i.original || ""));
    const missed = (item.missedIngredients ?? []).map((i) => translateIngredient(i.name || i.original || ""));

    const timeMinutes = detail?.readyInMinutes ?? 20;
    const servings = detail?.servings ?? 2;
    const sourceUrl = detail?.sourceUrl ?? `https://spoonacular.com/recipes/${slugify(item.title)}-${item.id}`;

    const nutrition = detail ? {
      calories: extractNutrient(detail, "Calories"),
      protein: extractNutrient(detail, "Protein"),
      carbs: extractNutrient(detail, "Carbohydrates"),
      fat: extractNutrient(detail, "Fat")
    } : undefined;

    const hasNutrition = nutrition && Object.values(nutrition).some((v) => v !== undefined);

    const recipe = {
      id: `spoonacular-${item.id}-${slugify(item.title)}`,
      title: item.title,
      description: missed.length > 0
        ? `Online gefunden — es fehlen noch ${missed.length} Zutat${missed.length === 1 ? "" : "en"}.`
        : "Online gefunden und direkt passend zu deinen Zutaten.",
      image: item.image,
      timeMinutes,
      difficulty: mapDifficulty(timeMinutes),
      servings,
      category: "online",
      cuisine: detail?.cuisines?.[0] ?? "International",
      diet: [] as DietTag[],
      tags: ["online"],
      base: "mixed",
      method: "mixed",
      ingredients: [...used, ...missed].map((name) => ({ name, optional: false })),
      steps: steps.length > 0
        ? steps
        : [`Dieses Rezept wurde online gefunden. Öffne das Originalrezept für die vollständige Anleitung.`],
      nutrition: hasNutrition ? nutrition : undefined,
      sourceUrl
    } as Recipe;

    // Spoonacular only labels a subset of diets and the rest of the app filters
    // on our own tags, so combine both instead of leaving `diet` empty.
    recipe.diet = mergeDiets(detail?.diets, recipe);

    return recipe;
  });

  simpleCache.set(cacheKey, result);

  // Persist so /recipe/<id> resolves even without the ?have= parameter
  await saveGeneratedRecipes(result);

  return result;
}
