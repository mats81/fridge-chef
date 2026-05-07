import type { Metadata } from "next";
import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import { recipes } from "@/lib/recipes";
import { getRecommendations } from "@/lib/matching";
import { fetchOnlineRecipesByIngredients } from "@/lib/online-recipes";

export const metadata: Metadata = {
  title: "Deine Rezeptideen — Fridge Chef",
  description: "Drei bewusst unterschiedliche Rezeptvorschläge basierend auf deinen Zutaten."
};

function parseFilters(value?: string) {
  const active = (value ?? "").split(",").filter(Boolean);
  return Object.fromEntries(active.map((item) => [item, true]));
}

export default async function ResultsPage({
  searchParams
}: {
  searchParams: Promise<{ ingredients?: string; filters?: string; pantryOnly?: string; v?: string }>;
}) {
  const params = await searchParams;

  const ingredients = (params.ingredients ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const pantryOnly = params.pantryOnly === "1";
  const filters = parseFilters(params.filters);
  const variation = parseInt(params.v ?? "0", 10) || 0;
  const haveParam = ingredients.join(",");

  const localBaseRecommendations = getRecommendations(
    recipes,
    ingredients,
    filters,
    variation
  );

  const localRecommendations = pantryOnly
    ? localBaseRecommendations.filter((item) => item.missing.length === 0)
    : localBaseRecommendations;

  const needOnlineFallback = localRecommendations.length < 3;

  const onlineRecipes = needOnlineFallback
    ? await fetchOnlineRecipesByIngredients(ingredients, { pantryOnly: false })
    : [];

  const onlineBaseRecommendations =
    onlineRecipes.length > 0
      ? getRecommendations(onlineRecipes, ingredients, filters)
      : [];

  const onlineRecommendations = pantryOnly
    ? onlineBaseRecommendations.filter((item) => item.missing.length === 0)
    : onlineBaseRecommendations;

  const directRecommendations = [...localRecommendations];

  for (const item of onlineRecommendations) {
    if (directRecommendations.length >= 3) break;

    if (
      directRecommendations.some(
        (existing) =>
          existing.recipe.title.trim().toLowerCase() ===
          item.recipe.title.trim().toLowerCase()
      )
    ) {
      continue;
    }

    directRecommendations.push(item);
  }

  const onlineAlmostMatching = pantryOnly
    ? onlineBaseRecommendations
        .filter((item) => item.missing.length > 0 && item.missing.length <= 2)
        .filter(
          (item, index, array) =>
            array.findIndex(
              (entry) =>
                entry.recipe.title.trim().toLowerCase() ===
                item.recipe.title.trim().toLowerCase()
            ) === index
        )
        .slice(0, 3)
    : [];

  return (
    <main className="container-shell py-8">
      <div className="sticky top-4 z-20 mb-8 flex flex-wrap items-center gap-2 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-4 backdrop-blur">
        <span className="text-sm text-[var(--muted)]">Zuhause:</span>

        {ingredients.map((item) => (
          <span key={item} className="chip">
            {item}
          </span>
        ))}

        {pantryOnly ? (
          <span className="chip chip-active">Nur vorhandene Zutaten</span>
        ) : null}

        <Link href="/cook" className="ml-auto chip">
          Zutaten ändern
        </Link>
      </div>

      <section className="mb-10 space-y-3">
        <p className="chip w-fit">
          {pantryOnly ? "Nur mit deinen Zutaten" : "Deine 3 Ideen"}
        </p>

        <h1 className="section-title">
          {pantryOnly
            ? "Nur Rezepte, die du direkt kochen kannst."
            : "Nicht drei gleiche Rezepte — sondern drei Richtungen."}
        </h1>

        <p className="text-[var(--muted)]">
          {pantryOnly
            ? "Hier siehst du nur Vorschläge, bei denen keine Pflichtzutat fehlt."
            : "Eine leichte Option, eine herzhafte und eine kreativere Idee."}
        </p>
      </section>

      {directRecommendations.length === 0 ? (
        <section className="glass rounded-[28px] p-8">
          <h2 className="text-2xl font-semibold">
            Gerade kein direkt passendes Rezept gefunden
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Weder lokal noch online wurde gerade ein Rezept gefunden, das komplett mit deinen
            vorhandenen Zutaten kochbar ist.
          </p>
          <Link
            href="/cook"
            className="mt-6 inline-flex h-12 items-center rounded-2xl bg-[var(--brand)] px-5 text-white"
          >
            Zutaten anpassen
          </Link>
        </section>
      ) : (
        <section className="grid gap-8">
          {directRecommendations.map((item, index) => (
            <RecipeCard
              key={item.recipe.id}
              item={item}
              haveParam={haveParam}
              priority={index === 0}
            />
          ))}
        </section>
      )}

      {pantryOnly && onlineAlmostMatching.length > 0 ? (
        <section className="mt-12 space-y-6">
          <div className="space-y-3">
            <p className="chip w-fit">Online fast passend</p>
            <h2 className="text-3xl font-semibold">
              Diese Rezepte würden fast schon passen.
            </h2>
            <p className="max-w-2xl text-[var(--muted)]">
              Die folgenden Online-Rezepte sehen gut aus, aber es fehlen noch 1–2 Zutaten.
            </p>
          </div>

          <div className="grid gap-8">
            {onlineAlmostMatching.map((item) => (
              <RecipeCard
                key={item.recipe.id}
                item={item}
                haveParam={haveParam}
              />
            ))}
          </div>
        </section>
      ) : null}

      {directRecommendations.length > 0 ? (
        <div className="mt-10">
          <Link
            href={`/results?ingredients=${encodeURIComponent(haveParam)}&filters=${encodeURIComponent(
              params.filters ?? ""
            )}${pantryOnly ? "&pantryOnly=1" : ""}&v=${variation + 1}`}
            className="inline-flex h-14 items-center rounded-2xl bg-[var(--brand)] px-6 text-white"
          >
            3 neue Ideen
          </Link>
        </div>
      ) : null}
    </main>
  );
}