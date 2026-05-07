import { Recipe, Difficulty } from "@/lib/types";
import { simpleCache } from "@/lib/cache";

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

function buildPrompt(ingredients: string[]): string {
  return `Du bist ein kreativer Koch-Assistent. Der Nutzer hat folgende Zutaten zuhause: ${ingredients.join(", ")}.

Erstelle genau 2 kreative Rezeptideen, die diese Zutaten möglichst gut nutzen. Die Rezepte sollen auf Deutsch sein und realistisch kochbar. Zusätzliche Grundzutaten wie Salz, Pfeffer, Öl oder Butter dürfen verwendet werden.

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
  const cached = simpleCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", `${query} food`);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("orientation", "landscape");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!response.ok) return "";

    const data = await response.json();
    const imageUrl: string = data.results?.[0]?.urls?.regular ?? "";

    if (imageUrl) simpleCache.set(cacheKey, imageUrl);
    return imageUrl;
  } catch {
    return "";
  }
}

export function getOllamaRecipeById(id: string): Recipe | null {
  return simpleCache.get(`ollama-recipe-${id}`) ?? null;
}

export async function fetchOllamaRecipes(
  ingredients: string[]
): Promise<Recipe[]> {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  if (!baseUrl || ingredients.length === 0) return [];

  const cacheKey = `ollama-${[...ingredients].sort().join(",")}`;
  const cached = simpleCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: buildPrompt(ingredients) }],
        stream: false,
        format: "json",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    const rawRecipes: OllamaRecipeRaw[] = parsed.recipes || [];

    const recipes: Recipe[] = rawRecipes.slice(0, 2).map((raw, index) => {
      const id = `ollama-${slugify(raw.title || "rezept")}-${index}`;
      const timeMinutes = raw.timeMinutes || 30;

      return {
        id,
        title: raw.title || "KI-Rezept",
        description:
          raw.description ||
          "KI-generiertes Rezept basierend auf deinen Zutaten.",
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
          unit: i.unit,
        })),
        steps:
          raw.steps && raw.steps.length > 0
            ? raw.steps
            : ["Keine detaillierten Schritte verfügbar."],
        nutrition: raw.nutrition,
        sourceUrl: undefined,
      };
    });

    const images = await Promise.all(
      recipes.map((r) => searchFoodImage(r.title))
    );
    for (let i = 0; i < recipes.length; i++) {
      recipes[i].image = images[i];
    }

    simpleCache.set(cacheKey, recipes);

    for (const recipe of recipes) {
      simpleCache.set(`ollama-recipe-${recipe.id}`, recipe);
    }

    return recipes;
  } catch {
    return [];
  }
}
