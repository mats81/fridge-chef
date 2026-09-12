"use client";

import { useState } from "react";

export type IngredientRow = {
  name: string;
  displayName: string;
  amount?: number;
  unit?: string;
  optional?: boolean;
  have: boolean;
};

/**
 * Round to something a cook can actually measure: no "133.33 g".
 * Small values keep one decimal, larger ones snap to whole numbers.
 */
function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return "";

  if (value < 1) return (Math.round(value * 4) / 4).toString().replace(".", ",");
  if (value < 10) return (Math.round(value * 2) / 2).toString().replace(".", ",");

  return Math.round(value).toString();
}

export function RecipeIngredients({
  items,
  baseServings
}: {
  items: IngredientRow[];
  baseServings: number;
}) {
  const safeBase = baseServings > 0 ? baseServings : 2;
  const [servings, setServings] = useState(safeBase);

  const factor = servings / safeBase;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Zutaten</h2>

        <div
          className="flex items-center gap-3 rounded-2xl border border-[var(--line)] px-3 py-2"
          role="group"
          aria-label="Portionen anpassen"
        >
          <button
            type="button"
            onClick={() => setServings((value) => Math.max(1, value - 1))}
            disabled={servings <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--chip)] text-lg leading-none disabled:opacity-40"
            aria-label="Eine Portion weniger"
          >
            −
          </button>

          <span className="min-w-[5.5rem] text-center text-sm" aria-live="polite">
            {servings} {servings === 1 ? "Portion" : "Portionen"}
          </span>

          <button
            type="button"
            onClick={() => setServings((value) => Math.min(20, value + 1))}
            disabled={servings >= 20}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--chip)] text-lg leading-none disabled:opacity-40"
            aria-label="Eine Portion mehr"
          >
            +
          </button>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => {
          const scaled = item.amount ? item.amount * factor : undefined;
          const quantity = scaled
            ? item.unit
              ? `${formatAmount(scaled)} ${item.unit}`
              : formatAmount(scaled)
            : null;

          return (
            <li
              key={item.name}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${
                item.have
                  ? "border-[var(--emerald-border)] bg-[var(--emerald-bg)]"
                  : "border-[var(--amber-border)] bg-[var(--amber-bg)]"
              }`}
            >
              <span>
                {quantity ? <span className="text-[var(--muted)]">{quantity} </span> : null}
                {item.displayName}
                {item.optional ? (
                  <span className="ml-1 text-sm text-[var(--muted)]">(optional)</span>
                ) : null}
              </span>

              <span className="shrink-0 text-sm text-[var(--muted)]">
                {item.have ? "Zuhause" : "Fehlt"}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
