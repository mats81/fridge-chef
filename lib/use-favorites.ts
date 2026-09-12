"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";

export type FavoriteRecipe = {
  id: string;
  title: string;
  image: string;
  timeMinutes: number;
  difficulty: string;
  /** Ingredients the user had when saving, so the detail link keeps its context. */
  have?: string;
  savedAt: number;
};

const EMPTY: FavoriteRecipe[] = [];

const favoritesStore = createLocalStore<FavoriteRecipe[]>(
  "fridge-chef-favorites",
  EMPTY,
  (parsed) => {
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item): item is FavoriteRecipe =>
        Boolean(item) && typeof item === "object" && typeof item.id === "string"
    );
  }
);

export function useFavorites() {
  const favorites = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot
  );

  const isFavorite = useCallback(
    (id: string) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const toggle = useCallback((recipe: Omit<FavoriteRecipe, "savedAt">) => {
    const current = favoritesStore.get();
    const exists = current.some((item) => item.id === recipe.id);

    favoritesStore.set(
      exists
        ? current.filter((item) => item.id !== recipe.id)
        : [{ ...recipe, savedAt: Date.now() }, ...current]
    );

    return !exists;
  }, []);

  const remove = useCallback((id: string) => {
    favoritesStore.set(favoritesStore.get().filter((item) => item.id !== id));
  }, []);

  return { favorites, isFavorite, toggle, remove };
}
