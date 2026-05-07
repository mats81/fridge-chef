"use client";

import { useShoppingList } from "@/components/shopping-list-provider";

type MissingItem = {
  name: string;
  amount?: number;
  unit?: string;
};

export function AddMissingToShoppingList({
  items,
  recipeId,
  recipeTitle
}: {
  items: MissingItem[];
  recipeId: string;
  recipeTitle: string;
}) {
  const { addItems, open } = useShoppingList();

  return (
    <button
      type="button"
      onClick={() => {
        addItems(
          items.map((item) => ({
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            recipeId,
            recipeTitle
          }))
        );
        open();
      }}
      className="inline-flex h-14 items-center rounded-2xl border border-[var(--line)] px-6"
    >
      Fehlende Zutaten sammeln
    </button>
  );
}
