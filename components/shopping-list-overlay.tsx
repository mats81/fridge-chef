"use client";

import { useEffect, useMemo, useState } from "react";
import { useShoppingList, type ShoppingItem } from "@/components/shopping-list-provider";

function formatQuantity(item: ShoppingItem) {
  if (item.amount && item.unit) return `${item.amount} ${item.unit}`;
  if (item.amount) return `${item.amount}`;
  return null;
}

export function ShoppingListOverlay() {
  const { items, isOpen, close, clearItems, clearDone, removeItem, toggleDone } =
    useShoppingList();

  const [feedback, setFeedback] = useState<string | null>(null);

  const openCount = items.filter((item) => !item.done).length;
  const doneCount = items.length - openCount;

  const textValue = useMemo(() => {
    if (items.length === 0) return "";

    const lines = items
      .filter((item) => !item.done)
      .map((item) => {
        const qty = formatQuantity(item);
        return `- ${qty ? `${qty} ` : ""}${item.name}`;
      });

    return lines.length > 0 ? `Einkaufsliste\n${lines.join("\n")}` : "";
  }, [items]);

  // Close on Escape, like every other dialog on the web
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const shareList = async () => {
    if (!textValue) return;

    // Web Share opens the OS sheet on a phone (WhatsApp, Notes, …);
    // desktop browsers mostly lack it, so fall back to the clipboard.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Einkaufsliste", text: textValue });
        return;
      } catch (error) {
        // User dismissed the share sheet — not an error worth reporting
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(textValue);
      setFeedback("Liste kopiert.");
    } catch {
      setFeedback("Kopieren wurde vom Browser blockiert.");
    }
  };

  // The panel stays mounted and animates via CSS. Deriving visibility straight
  // from `isOpen` avoids the mount/unmount state dance entirely; `inert` keeps
  // the closed panel out of the tab order and away from screen readers.
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[var(--overlay)] backdrop-blur-sm transition-opacity duration-250 ease-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Einkaufsliste"
        inert={!isOpen}
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] w-full flex-col rounded-t-[28px] bg-[var(--surface-strong)] p-5 shadow-2xl transition-all duration-300 ease-out md:inset-y-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-md md:rounded-[28px] md:p-6 ${
          isOpen
            ? "translate-y-0 opacity-100 md:translate-x-0"
            : "pointer-events-none translate-y-8 opacity-0 md:translate-x-6 md:translate-y-0"
        }`}
      >
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[var(--line)] md:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="chip w-fit">Einkaufsliste</p>
            <h2 className="mt-3 text-xl font-semibold md:text-2xl">
              {openCount === 0 && items.length > 0
                ? "Alles abgehakt."
                : "Diese Zutaten fehlen noch."}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {items.length === 0
                ? "Gesammelt über mehrere Rezepte hinweg."
                : `${openCount} offen${doneCount > 0 ? `, ${doneCount} erledigt` : ""}`}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-lg"
            aria-label="Einkaufsliste schließen"
          >
            ×
          </button>
        </div>

        <div className="mt-5 flex-1 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] p-5 text-[var(--muted)]">
              Noch keine Zutaten gesammelt.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.name}
                  className={`flex items-start gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 transition-opacity ${
                    item.done ? "opacity-55" : ""
                  }`}
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(item.done)}
                      onChange={() => toggleDone(item.name)}
                      className="mt-1 h-5 w-5 shrink-0 accent-[var(--brand)]"
                    />

                    <span className="min-w-0">
                      <span
                        className={`block font-medium ${item.done ? "line-through" : ""}`}
                      >
                        {formatQuantity(item) ? (
                          <span className="text-[var(--muted)]">
                            {formatQuantity(item)}{" "}
                          </span>
                        ) : null}
                        {item.name}
                      </span>

                      {item.recipeTitles?.length ? (
                        <span className="mt-1 block text-xs text-[var(--muted)]">
                          {item.recipeTitles.join(", ")}
                        </span>
                      ) : null}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeItem(item.name)}
                    className="shrink-0 text-sm text-[var(--muted)]"
                    aria-label={`${item.name} von der Liste entfernen`}
                  >
                    Entfernen
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-3 text-sm text-[var(--muted)] empty:hidden" aria-live="polite">
          {feedback}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={shareList}
            disabled={!textValue}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-5 text-white disabled:opacity-50"
          >
            Liste teilen
          </button>

          <button
            type="button"
            onClick={doneCount > 0 ? clearDone : clearItems}
            disabled={items.length === 0}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--line)] px-5 disabled:opacity-50"
          >
            {doneCount > 0 ? "Erledigte entfernen" : "Leeren"}
          </button>
        </div>
      </aside>
    </>
  );
}
