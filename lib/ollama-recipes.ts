import { DietTag, Recipe, Difficulty } from "@/lib/types";
import { simpleCache } from "@/lib/cache";
import { deriveDietTags } from "@/lib/diet";
import { saveGeneratedRecipes, getGeneratedRecipe } from "@/lib/recipe-store";

interface OllamaRecipeRaw {
  title: string;
  description: string;
  cuisine: string;
  timeMinutes: number;
  servings: number;
  ingredients: Array<{ name: string; amount?: number; unit?: string }>;
  steps: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

/** Wording handed to the model for each active filter. */
const DIET_INSTRUCTIONS: Record<DietTag, string> = {
  vegetarian: "streng vegetarisch (kein Fleisch, kein Fisch, keine Gelatine)",
  vegan: "streng vegan (keine tierischen Produkte, auch keine Milch, Eier oder Honig)",
  "high-protein": "proteinreich (mindestens 25 g Protein pro Portion)",
  budget: "günstig (nur preiswerte Alltagszutaten)",
  quick: "in höchstens 20 Minuten fertig",
  "gluten-free":
    "glutenfrei (kein Weizen, Dinkel, Gerste, Roggen, keine Nudeln oder Brot aus Weizen)",
  "lactose-free": "laktosefrei (keine Milch, Sahne, Butter oder Käse)",
  "kid-friendly": "kindgerecht (mild gewürzt, nicht scharf)"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapDifficulty(minutes: number): Difficulty {
  if (minutes <= 20) return "Easy";
  if (minutes <= 45) return "Medium";
  return "Hard";
}

function buildPrompt(ingredients: string[], diets: DietTag[], variation: number): string {
  const constraints = diets.map((diet) => DIET_INSTRUCTIONS[diet]).filter(Boolean);

  const dietBlock =
    constraints.length > 0
      ? `\n\nPFLICHT — die Rezepte MÜSSEN alle folgenden Vorgaben erfüllen:\n${constraints
          .map((line) => `- ${line}`)
          .join("\n")}\nRezepte, die eine dieser Vorgaben verletzen, sind nicht erlaubt.`
      : "";

  const variationBlock =
    variation > 0
      ? `\n\nDer Nutzer hat bereits Vorschläge gesehen und möchte andere Ideen. Wähle diesmal eine deutlich andere Küche und Zubereitungsart (Runde ${variation + 1}).`
      : "";

  return `Du bist ein kreativer Koch-Assistent. Der Nutzer hat folgende Zutaten zuhause: ${ingredients.join(", ")}.

Erstelle genau 2 kreative Rezeptideen, die diese Zutaten möglichst gut nutzen. Die Rezepte sollen auf Deutsch sein und realistisch kochbar. Zusätzliche Grundzutaten wie Salz, Pfeffer, Öl oder Butter dürfen verwendet werden.${dietBlock}${variationBlock}

Antworte ausschließlich mit einem JSON-Objekt in diesem Format:
{
  "recipes": [
    {
      "title": "Rezeptname",
      "description": "Kurze Beschreibung (1-2 Sätze)",
      "cuisine": "Küche (z.B. Italienisch, Deutsch, Asiatisch)",
      "timeMinutes": 30,
      "servings": 2,
      "ingredients": [
        { "name": "Zutat", "amount": 200, "unit": "g" }
      ],
      "steps": ["Schritt 1...", "Schritt 2..."],
      "nutrition": { "calories": 450, "protein": 25, "carbs": 40, "fat": 15 }
    }
  ]
}`;
}

async function searchFoodImage(query: string): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return "";

  const cacheKey = `unsplash-${query}`;
  const cached = simpleCache.get<string>(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", `${query} food`);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("orientation", "landscape");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${accessKey}` },
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) return "";

    const data = await response.json();
    const imageUrl: string = data.results?.[0]?.urls?.regular ?? "";

    if (imageUrl) simpleCache.set(cacheKey, imageUrl, 24 * 60 * 60 * 1000);
    return imageUrl;
  } catch {
    return "";
  }
}

/** Resolve an AI recipe by id — falls back to the durable store after a restart. */
export async function getOllamaRecipeById(id: string): Promise<Recipe | null> {
  const cached = simpleCache.get<Recipe>(`ollama-recipe-${id}`);
  if (cached) return cached;

  return getGeneratedRecipe(id);
}

export async function fetchOllamaRecipes(
  ingredients: string[],
  options: { diets?: DietTag[]; variation?: number } = {}
): Promise<Recipe[]> {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS) || 120_000;

  if (!baseUrl || ingredients.length === 0) return [];

  const diets = options.diets ?? [];
  const variation = options.variation ?? 0;

  const cacheKey = `ollama-${[...ingredients].sort().join(",")}-${[...diets]
    .sort()
    .join(",")}-${variation}`;

  const cached = simpleCache.get<Recipe[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: buildPrompt(ingredients, diets, variation) }],
        stream: false,
        format: "json",
        options: {
          // A little randomness so "3 neue Ideen" does not return the same dish
          temperature: variation > 0 ? 0.9 : 0.7
        }
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    const rawRecipes: OllamaRecipeRaw[] = parsed.recipes || [];

    // Include the ingredient set in the id so recipes from different searches
    // never collide in the durable store.
    const idScope = slugify([...ingredients].sort().join("-")).slice(0, 24);

    const recipes: Recipe[] = rawRecipes.slice(0, 2).map((raw, index) => {
      const title = raw.title || "KI-Rezept";
      const timeMinutes = raw.timeMinutes || 30;

      const recipe: Recipe = {
        id: `ollama-${slugify(title)}-${idScope}-${index}`,
        title,
        description:
          raw.description || "KI-generiertes Rezept basierend auf deinen Zutaten.",
        category: "ai-generated",
        cuisine: raw.cuisine || "International",
        tags: ["ai-generated", "creative"],
        diet: [],
        base: "mixed",
        method: "mixed",
        timeMinutes,
        difficulty: mapDifficulty(timeMinutes),
        servings: raw.servings || 2,
        image: "",
        ingredients: (raw.ingredients || []).map((i) => ({
          name: i.name,
          displayName: i.name,
          amount: i.amount,
          unit: i.unit
        })),
        steps:
          raw.steps && raw.steps.length > 0
            ? raw.steps
            : ["Keine detaillierten Schritte verfügbar."],
        nutrition: raw.nutrition,
        sourceUrl: undefined
      };

      recipe.diet = deriveDietTags(recipe);
      return recipe;
    });

    // Small models still slip up on dietary constraints. Showing meat under an
    // active vegan filter is worse than showing nothing, so drop violations.
    const compliant = recipes.filter((recipe) =>
      diets.every((diet) => recipe.diet.includes(diet))
    );

    if (compliant.length === 0) return [];

    const images = await Promise.all(
      compliant.map((recipe) => searchFoodImage(recipe.title))
    );
    for (let i = 0; i < compliant.length; i++) {
      compliant[i].image = images[i];
    }

    simpleCache.set(cacheKey, compliant);
    for (const recipe of compliant) {
      simpleCache.set(`ollama-recipe-${recipe.id}`, recipe);
    }

    // Persist so /recipe/<id> keeps working once the cache expires or the
    // container restarts.
    await saveGeneratedRecipes(compliant);

    return compliant;
  } catch {
    return [];
  }
}
