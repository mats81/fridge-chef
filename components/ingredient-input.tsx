"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createLocalStore } from "@/lib/local-store";

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

type StoredPantry = {
  ingredients: string[];
  filters: Record<string, boolean>;
  pantryOnly: boolean;
};

const EMPTY_PANTRY: StoredPantry = { ingredients: [], filters: {}, pantryOnly: false };

/**
 * The pantry lives in localStorage rather than component state, so returning
 * users find their ingredients still there instead of retyping them.
 */
const pantryStore = createLocalStore<StoredPantry>(
  "fridge-chef-pantry",
  EMPTY_PANTRY,
  (parsed) => {
    if (!parsed || typeof parsed !== "object") return null;

    const value = parsed as Partial<StoredPantry>;
    if (!Array.isArray(value.ingredients)) return null;

    return {
      ingredients: value.ingredients.filter((i): i is string => typeof i === "string"),
      filters:
        value.filters && typeof value.filters === "object" ? value.filters : {},
      pantryOnly: Boolean(value.pantryOnly)
    };
  }
);

/**
 * Phone cameras produce 10 MB+ images. Downscaling in the browser keeps the
 * upload small and the vision model fast, at no visible cost in recognition.
 */
async function downscaleImage(file: File, maxSize = 1024): Promise<Blob> {
  if (typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));

    if (scale === 1 && file.size < 2 * 1024 * 1024) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    );

    return blob ?? file;
  } catch {
    return file;
  }
}

export function IngredientInput({ visionEnabled = false }: { visionEnabled?: boolean }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pantry = useSyncExternalStore(
    pantryStore.subscribe,
    pantryStore.getSnapshot,
    pantryStore.getServerSnapshot
  );

  const { ingredients, filters, pantryOnly } = pantry;
  const canSubmit = ingredients.length > 0;

  function addIngredient(value: string) {
    const parts = value.split(",").map((v) => v.trim()).filter(Boolean);
    if (parts.length === 0) return;

    const current = pantryStore.get();
    const next = [...current.ingredients];

    for (const part of parts) {
      if (!next.some((i) => i.toLowerCase() === part.toLowerCase())) {
        next.push(part);
      }
    }

    pantryStore.set({ ...current, ingredients: next });
    setDraft("");
  }

  function removeIngredient(value: string) {
    const current = pantryStore.get();
    pantryStore.set({
      ...current,
      ingredients: current.ingredients.filter((item) => item !== value)
    });
  }

  function clearAll() {
    pantryStore.set({ ...pantryStore.get(), ingredients: [] });
    setScanNotice(null);
    setScanError(null);
  }

  async function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset immediately so picking the same file twice still fires a change
    event.target.value = "";

    if (!file) return;

    setScanning(true);
    setScanError(null);
    setScanNotice(null);

    try {
      const prepared = await downscaleImage(file);

      const body = new FormData();
      body.append("image", prepared, "fridge.jpg");

      const response = await fetch("/api/vision", { method: "POST", body });
      const data = await response.json();

      if (!response.ok) {
        setScanError(data?.error ?? "Die Bilderkennung hat nicht funktioniert.");
        return;
      }

      const detected: string[] = Array.isArray(data.ingredients) ? data.ingredients : [];

      if (detected.length === 0) {
        setScanError("Auf dem Foto wurden keine Zutaten erkannt.");
        return;
      }

      const before = ingredients.length;
      addIngredient(detected.join(","));

      setScanNotice(
        `${detected.length} Zutat${detected.length === 1 ? "" : "en"} erkannt${
          before > 0 ? " und ergänzt" : ""
        }. Prüf die Liste und entferne, was nicht stimmt.`
      );
    } catch {
      setScanError("Das Bild konnte nicht verarbeitet werden.");
    } finally {
      setScanning(false);
    }
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
          <label htmlFor="ingredient-draft" className="text-sm text-[var(--muted)]">
            Was ist bei dir gerade da?
          </label>

          <div className="flex gap-2">
            <input
              id="ingredient-draft"
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
              className="h-14 shrink-0 rounded-2xl bg-[var(--brand)] px-5 text-white"
              type="button"
            >
              Hinzufügen
            </button>
          </div>

          {visionEnabled ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--line)] px-4 disabled:opacity-60"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                {scanning ? "Foto wird ausgewertet…" : "Kühlschrank fotografieren"}
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div aria-live="polite" className="space-y-2 empty:hidden">
        {scanError ? (
          <p className="rounded-2xl border border-[var(--amber-border)] bg-[var(--amber-bg)] p-4 text-sm">
            {scanError}
          </p>
        ) : null}

        {scanNotice ? (
          <p className="rounded-2xl border border-[var(--emerald-border)] bg-[var(--emerald-bg)] p-4 text-sm">
            {scanNotice}
          </p>
        ) : null}
      </div>

      {ingredients.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="meta">Deine Zutaten ({ingredients.length})</p>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-[var(--muted)] underline underline-offset-4"
            >
              Alle entfernen
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ingredients.map((item) => (
              <button
                key={item}
                onClick={() => removeIngredient(item)}
                className="chip"
                type="button"
                aria-label={`${item} entfernen`}
              >
                {item} ×
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="meta">Schnell wählen</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Zutaten-Vorschläge">
          {suggestions.map((item) => {
            const added = ingredients.some((i) => i.toLowerCase() === item.toLowerCase());

            return (
              <button
                key={item}
                onClick={() => (added ? removeIngredient(item) : addIngredient(item))}
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
                onClick={() => {
                  const current = pantryStore.get();
                  pantryStore.set({
                    ...current,
                    filters: {
                      ...current.filters,
                      [filter.key]: !current.filters[filter.key]
                    }
                  });
                }}
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
          onClick={() => {
            const current = pantryStore.get();
            pantryStore.set({ ...current, pantryOnly: !current.pantryOnly });
          }}
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
