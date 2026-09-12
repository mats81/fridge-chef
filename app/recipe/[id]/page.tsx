import type { Metadata } from "next";
import Link from "next/link";
import { Recipe } from "@/lib/types";
import { recipes } from "@/lib/recipes";
import { fetchOnlineRecipesByIngredients } from "@/lib/online-recipes";
import { getOllamaRecipeById } from "@/lib/ollama-recipes";
import { getGeneratedRecipe } from "@/lib/recipe-store";
import { expandIngredients, hasIngredient, translateIngredientName } from "@/lib/ingredient-meta";
import { RecipeImage } from "@/components/recipe-image";
import { RecipeIngredients, type IngredientRow } from "@/components/recipe-ingredients";
import { AddMissingToShoppingList } from "@/components/add-missing-to-shopping-list";
import { ShoppingListButton } from "@/components/shopping-list-button";
import { FavoriteButton } from "@/components/favorite-button";

/**
 * Resolve a recipe from any of its three sources.
 * Generated recipes (AI, online) are looked up in the durable store first, so a
 * link keeps working after the in-memory cache expires or the container restarts.
 */
async function resolveRecipe(
  id: string,
  availableList: string[]
): Promise<Recipe | undefined> {
  const local = recipes.find((item) => item.id === id);
  if (local) return local;

  const stored = await getGeneratedRecipe(id);
  if (stored) return stored;

  if (id.startsWith("ollama-")) {
    const aiRecipe = await getOllamaRecipeById(id);
    if (aiRecipe) return aiRecipe;
  }

  // Last resort: re-run the online search the recipe originally came from
  if (availableList.length > 0) {
    const onlineRecipes = await fetchOnlineRecipesByIngredients(availableList, {
      pantryOnly: false
    });
    return onlineRecipes.find((item) => item.id === id);
  }

  return undefined;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ have?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { have } = await searchParams;

  const availableList = (have ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const recipe = await resolveRecipe(id, availableList);

  if (!recipe) {
    return { title: "Rezept nicht gefunden — Fridge Chef" };
  }

  return {
    title: `${recipe.title} — Fridge Chef`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.image
        ? [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }]
        : undefined
    }
  };
}

export default async function RecipeDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ have?: string }>;
}) {
  const { id } = await params;
  const { have } = await searchParams;

  const availableList = (have ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const available = expandIngredients(availableList);
  const recipe = await resolveRecipe(id, availableList);

  if (!recipe) {
    return (
      <main className="container-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="glass rounded-[28px] p-10">
          <h1 className="text-3xl font-semibold">Rezept nicht gefunden</h1>
          <p className="mt-3 max-w-md text-[var(--muted)]">
            Das Rezept existiert nicht mehr oder konnte nicht geladen werden.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/cook"
              className="inline-flex h-12 items-center rounded-2xl bg-[var(--brand)] px-5 text-white"
            >
              Zutaten eingeben
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center rounded-2xl border border-[var(--line)] px-5"
            >
              Startseite
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const ingredientRows: IngredientRow[] = recipe.ingredients.map((item) => ({
    name: item.name,
    displayName: item.displayName ?? translateIngredientName(item.name),
    amount: item.amount,
    unit: item.unit,
    optional: item.optional,
    have: hasIngredient(available, item.name)
  }));

  // Optional ingredients are garnish, not groceries — keep them off the list
  const missingItems = ingredientRows
    .filter((item) => !item.have && !item.optional)
    .map((item) => ({
      name: item.displayName,
      amount: item.amount,
      unit: item.unit
    }));

  return (
    <main className="pb-20">
      <section className="relative h-[52vh] min-h-[420px] overflow-hidden">
        <RecipeImage
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="container-shell absolute inset-x-0 bottom-0 text-white">
          <p className="chip w-fit bg-white/15 text-white backdrop-blur">
            {recipe.timeMinutes} Min · {recipe.difficulty} · {recipe.servings} Portionen
          </p>

          <h1 className="mt-4 hero-title max-w-4xl">{recipe.title}</h1>

          <p className="mt-4 max-w-2xl text-white/88">{recipe.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ShoppingListButton />
            <FavoriteButton
              recipe={{
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                timeMinutes: recipe.timeMinutes,
                difficulty: recipe.difficulty,
                have
              }}
            />
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-8 pt-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass rounded-[28px] p-6">
          <RecipeIngredients items={ingredientRows} baseServings={recipe.servings} />
        </article>

        <aside className="space-y-6">
          {missingItems.length > 0 ? (
            <div className="glass rounded-[28px] p-6">
              <h2 className="text-2xl font-semibold">Einkaufsliste</h2>
              <p className="mt-3 text-[var(--muted)]">
                Sammle die fehlenden Zutaten aus diesem Rezept direkt in deiner Liste.
              </p>

              <div className="mt-5">
                <AddMissingToShoppingList
                  items={missingItems}
                  recipeId={recipe.id}
                  recipeTitle={recipe.title}
                />
              </div>
            </div>
          ) : null}

          <div className="glass rounded-[28px] p-6">
            <h2 className="text-2xl font-semibold">Zubereitung</h2>
            <ol className="mt-5 space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-[var(--text-secondary)]">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {recipe.nutrition ? (
            <div className="glass rounded-[28px] p-6">
              <h2 className="text-2xl font-semibold">Nährwerte</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">pro Portion</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {recipe.nutrition.calories !== undefined ? (
                  <div className="chip">Kalorien: {recipe.nutrition.calories}</div>
                ) : null}
                {recipe.nutrition.protein !== undefined ? (
                  <div className="chip">Protein: {recipe.nutrition.protein} g</div>
                ) : null}
                {recipe.nutrition.carbs !== undefined ? (
                  <div className="chip">Kohlenhydrate: {recipe.nutrition.carbs} g</div>
                ) : null}
                {recipe.nutrition.fat !== undefined ? (
                  <div className="chip">Fett: {recipe.nutrition.fat} g</div>
                ) : null}
              </div>
            </div>
          ) : null}

          {recipe.substitutions?.length ? (
            <div className="glass rounded-[28px] p-6">
              <h2 className="text-2xl font-semibold">Alternativen</h2>
              <ul className="mt-4 space-y-2">
                {recipe.substitutions.map((item) => (
                  <li key={item} className="text-[var(--text-secondary)]">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {recipe.sourceUrl ? (
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center rounded-2xl border border-[var(--line)] px-6"
              >
                Originalrezept öffnen
              </a>
            ) : null}

            {have ? (
              <Link
                href={`/results?ingredients=${encodeURIComponent(have)}`}
                className="inline-flex h-14 items-center rounded-2xl border border-[var(--line)] px-6"
              >
                Zurück zu den Vorschlägen
              </Link>
            ) : null}

            <Link
              href="/cook"
              className="inline-flex h-14 items-center rounded-2xl bg-[var(--brand)] px-6 text-white"
            >
              Neue Zutaten eingeben
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
