"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/use-favorites";
import { useHydrated } from "@/lib/local-store";
import { RecipeImage } from "@/components/recipe-image";

export function FavoritesList() {
  const { favorites, remove } = useFavorites();
  const hydrated = useHydrated();

  // Favorites only exist in the browser — show a skeleton until hydration,
  // otherwise the empty state flashes before localStorage is read.
  if (!hydrated) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-48 bg-[var(--chip)]" />
            <div className="space-y-3 p-6">
              <div className="h-4 w-3/4 rounded bg-[var(--chip)]" />
              <div className="h-4 w-1/2 rounded bg-[var(--chip)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="glass rounded-[28px] p-8">
        <h2 className="text-2xl font-semibold">Noch nichts gemerkt</h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Tippe auf einem Rezept auf „Merken“, dann landet es hier.
        </p>
        <Link
          href="/cook"
          className="mt-6 inline-flex h-12 items-center rounded-2xl bg-[var(--brand)] px-5 text-white"
        >
          Rezepte finden
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {favorites.map((item) => (
        <article key={item.id} className="card">
          <Link
            href={`/recipe/${item.id}${item.have ? `?have=${encodeURIComponent(item.have)}` : ""}`}
            className="block"
          >
            <div className="relative h-48">
              <RecipeImage
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Link>

          <div className="space-y-3 p-6">
            <p className="text-sm text-[var(--muted)]">
              {item.timeMinutes} Min · {item.difficulty}
            </p>

            <h2 className="text-xl font-semibold">{item.title}</h2>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/recipe/${item.id}${item.have ? `?have=${encodeURIComponent(item.have)}` : ""}`}
                className="inline-flex h-11 items-center rounded-2xl bg-[var(--brand)] px-4 text-white"
              >
                Öffnen
              </Link>

              <button
                type="button"
                onClick={() => remove(item.id)}
                className="inline-flex h-11 items-center rounded-2xl border border-[var(--line)] px-4"
              >
                Entfernen
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
