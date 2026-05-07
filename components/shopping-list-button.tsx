"use client";

import { useShoppingList } from "@/components/shopping-list-provider";

export function ShoppingListButton() {
  const { items, open } = useShoppingList();

  if (items.length === 0) return null;

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex h-12 items-center rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur"
      aria-label="Einkaufsliste anzeigen"
    >
      Einkaufsliste anzeigen
      <span className="ml-2 rounded-full bg-[var(--badge-bg)] px-2 py-0.5 text-xs text-[var(--badge-text)]">
        {items.length}
      </span>
    </button>
  );
}