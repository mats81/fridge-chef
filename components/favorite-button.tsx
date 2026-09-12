"use client";

import { useFavorites, type FavoriteRecipe } from "@/lib/use-favorites";

export function FavoriteButton({
  recipe,
  className = ""
}: {
  recipe: Omit<FavoriteRecipe, "savedAt">;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(recipe.id);

  return (
    <button
      type="button"
      onClick={() => toggle(recipe)}
      aria-pressed={active}
      aria-label={active ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      className={`inline-flex h-12 items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 text-[var(--text)] ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {active ? "Gespeichert" : "Merken"}
    </button>
  );
}
