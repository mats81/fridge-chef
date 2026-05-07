import { fetchOllamaRecipes } from "@/lib/ollama-recipes";
import {
  normalize,
  expandIngredients,
  aliasMap,
} from "@/lib/ingredient-meta";
import { RecipeCard } from "@/components/recipe-card";
import type { Recommendation } from "@/lib/matching";

interface Props {
  ingredients: string[];
  haveParam: string;
}

export async function OllamaRecipeSection({ ingredients, haveParam }: Props) {
  const recipes = await fetchOllamaRecipes(ingredients);

  if (recipes.length === 0) return null;

  const have = expandIngredients(ingredients);

  const recommendations: Recommendation[] = recipes.map((recipe) => {
    const required = recipe.ingredients.filter((i) => !i.optional);
    const matchedIngredients = required.filter(
      (i) =>
        have.has(normalize(i.name)) ||
        aliasMap[normalize(i.name)]?.some((a) => have.has(normalize(a)))
    );
    const missingIngredients = required.filter(
      (i) => !matchedIngredients.includes(i)
    );

    return {
      recipe,
      score: 0,
      matched: matchedIngredients.map((i) => i.displayName ?? i.name),
      missing: missingIngredients.map((i) => i.displayName ?? i.name),
      reason:
        "Dieses Rezept wurde speziell für deine Zutaten von einer KI erstellt.",
    };
  });

  return (
    <section className="mt-12 space-y-6">
      <div className="space-y-3">
        <p className="chip w-fit">KI-Rezeptideen</p>
        <h2 className="text-3xl font-semibold">Kreative Ideen von der KI</h2>
        <p className="max-w-2xl text-[var(--muted)]">
          Diese Rezepte wurden speziell für deine Zutaten von einer KI
          generiert.
        </p>
      </div>

      <div className="grid gap-8">
        {recommendations.map((item) => (
          <RecipeCard
            key={item.recipe.id}
            item={item}
            haveParam={haveParam}
          />
        ))}
      </div>
    </section>
  );
}
