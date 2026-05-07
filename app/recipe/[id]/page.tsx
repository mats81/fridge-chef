import type { Metadata } from "next";
import Link from "next/link";
import { recipes } from "@/lib/recipes";
import { fetchOnlineRecipesByIngredients } from "@/lib/online-recipes";
import { getOllamaRecipeById } from "@/lib/ollama-recipes";
import { normalize, expandIngredients, translateIngredientName } from "@/lib/ingredient-meta";
import { RecipeImage } from "@/components/recipe-image";
import { AddMissingToShoppingList } from "@/components/add-missing-to-shopping-list";
import { ShoppingListButton } from "@/components/shopping-list-button";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = recipes.find((item) => item.id === id);

  if (!recipe) {
    return { title: "Rezept nicht gefunden — Fridge Chef" };
  }

  return {
    title: `${recipe.title} — Fridge Chef`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }]
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

  let recipe = recipes.find((item) => item.id === id);

  if (!recipe && availableList.length > 0) {
    const onlineRecipes = await fetchOnlineRecipesByIngredients(availableList, {
      pantryOnly: false
    });

    recipe = onlineRecipes.find((item) => item.id === id);
  }

  if (!recipe && id.startsWith("ollama-")) {
    recipe = getOllamaRecipeById(id) ?? undefined;
  }

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

  const missingItems = recipe.ingredients
    .filter((item) => !available.has(normalize(item.name)))
    .map((item) => ({
      name: item.displayName ?? translateIngredientName(item.name),
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
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-8 pt-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass rounded-[28px] p-6">
          <h2 className="text-2xl font-semibold">Zutaten</h2>

          <div className="mt-5 space-y-3">
            {recipe.ingredients.map((item) => {
              const hasIt = available.has(normalize(item.name));
              const displayName = item.displayName ?? translateIngredientName(item.name);
              const quantity = item.amount && item.unit
                ? `${item.amount} ${item.unit}`
                : item.amount
                  ? `${item.amount}`
                  : null;

              return (
                <div
                  key={item.name}
                  className={`flex items-center justify-between rounded-2xl border p-4 ${
                    hasIt ? "border-[var(--emerald-border)] bg-[var(--emerald-bg)]" : "border-[var(--amber-border)] bg-[var(--amber-bg)]"
                  }`}
                >
                  <span>
                    {quantity ? <span className="text-[var(--muted)]">{quantity} </span> : null}
                    {displayName}
                    {item.optional ? <span className="ml-1 text-sm text-[var(--muted)]">(optional)</span> : null}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    {hasIt ? "Zuhause" : "Fehlt"}
                  </span>
                </div>
              );
            })}
          </div>
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white">
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
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="chip">Kalorien: {recipe.nutrition.calories}</div>
                <div className="chip">Protein: {recipe.nutrition.protein} g</div>
                <div className="chip">Kohlenhydrate: {recipe.nutrition.carbs} g</div>
                <div className="chip">Fett: {recipe.nutrition.fat} g</div>
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
        </aside>
      </section>
    </main>
  );
}