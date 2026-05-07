"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const filterOptions = [
  { key: "vegetarian", label: "Vegetarisch" },
  { key: "vegan", label: "Vegan" },
  { key: "high-protein", label: "Proteinreich" },
  { key: "budget", label: "Günstig" },
  { key: "quick", label: "Schnell" },
  { key: "gluten-free", label: "Glutenfrei" },
  { key: "lactose-free", label: "Laktosefrei" },
  { key: "kid-friendly", label: "Kinderfreundlich" }
] as const;

const suggestions = [
  "Tomaten",
  "Eier",
  "Spinat",
  "Reis",
  "Nudeln",
  "Kichererbsen",
  "Feta",
  "Joghurt",
  "Wraps",
  "Zwiebeln",
  "Brot",
  "Zitrone"
];

export function IngredientInput() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [pantryOnly, setPantryOnly] = useState(false);

  const canSubmit = ingredients.length > 0;

  function addIngredient(value: string) {
    const parts = value.split(",").map((v) => v.trim()).filter(Boolean);
    if (parts.length === 0) return;

    setIngredients((prev) => {
      const next = [...prev];
      for (const part of parts) {
        if (!next.some((i) => i.toLowerCase() === part.toLowerCase())) {
          next.push(part);
        }
      }
      return next;
    });
    setDraft("");
  }

  function removeIngredient(value: string) {
    setIngredients((prev) => prev.filter((item) => item !== value));
  }

  function submit() {
    const params = new URLSearchParams();
    params.set("ingredients", ingredients.join(","));

    const activeFilters = Object.entries(filters)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (activeFilters.length) {
      params.set("filters", activeFilters.join(","));
    }

    if (pantryOnly) {
      params.set("pantryOnly", "1");
    }

    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-[28px] p-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm text-[var(--muted)]">Was ist bei dir gerade da?</label>

          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addIngredient(draft);
                }
              }}
              placeholder="z. B. Eier, Tomaten, Reis"
              className="h-14 w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            />

            <button
              onClick={() => addIngredient(draft)}
              className="h-14 rounded-2xl bg-[var(--brand)] px-5 text-white"
              type="button"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="list" aria-label="Ausgewählte Zutaten">
        {ingredients.map((item) => (
          <button
            key={item}
            onClick={() => removeIngredient(item)}
            className="chip"
            type="button"
            role="listitem"
            aria-label={`${item} entfernen`}
          >
            {item} ×
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <p className="meta">Schnell wählen</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Zutaten-Vorschläge">
          {suggestions.map((item) => {
            const added = ingredients.some((i) => i.toLowerCase() === item.toLowerCase());

            return (
              <button
                key={item}
                onClick={() => addIngredient(item)}
                className={`chip ${added ? "chip-active" : ""}`}
                type="button"
                aria-pressed={added}
              >
                {added ? "✓" : "+"} {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="meta">Filter</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Ernährungs-Filter">
          {filterOptions.map((filter) => {
            const active = !!filters[filter.key];

            return (
              <button
                key={filter.key}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter.key]: !prev[filter.key]
                  }))
                }
                className={`chip ${active ? "chip-active" : ""}`}
                type="button"
                aria-pressed={active}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-[28px] p-4">
        <button
          type="button"
          onClick={() => setPantryOnly((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-pressed={pantryOnly}
        >
          <div>
            <p className="font-semibold text-[var(--text)]">Nur mit meinen Zutaten</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Zeigt nur Rezepte, bei denen keine Pflichtzutat fehlt.
            </p>
          </div>

          <span
            className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition ${
              pantryOnly ? "bg-[var(--brand)]" : "bg-[var(--line)]"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                pantryOnly ? "left-7" : "left-1"
              }`}
            />
          </span>
        </button>
      </div>

      <button
        disabled={!canSubmit}
        onClick={submit}
        className="h-14 w-full rounded-2xl bg-[var(--brand)] text-white disabled:opacity-50"
        type="button"
      >
        Ideen finden
      </button>
    </div>
  );
}