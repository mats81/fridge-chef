"use client";

import { useEffect, useMemo, useState } from "react";
import { useShoppingList } from "@/components/shopping-list-provider";

export function ShoppingListOverlay() {
  const { items, isOpen, close, clearItems, removeItem } = useShoppingList();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const formatQuantity = (item: typeof items[number]) => {
    if (item.amount && item.unit) return `${item.amount} ${item.unit}`;
    if (item.amount) return `${item.amount}`;
    return null;
  };

  const textValue = useMemo(() => {
    if (items.length === 0) return "";

    return items
      .map((item) => {
        const qty = formatQuantity(item);
        return `- ${qty ? `${qty} ` : ""}${item.name}`;
      })
      .join("\n");
  }, [items]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);

    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const copyList = async () => {
    if (!textValue) return;

    try {
      await navigator.clipboard.writeText(textValue);
    } catch (error) {
      console.error("Kopieren fehlgeschlagen:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[var(--overlay)] backdrop-blur-sm transition-opacity duration-250 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] w-full flex-col rounded-t-[28px] bg-[var(--surface-strong)] p-5 shadow-2xl transition-all duration-300 ease-out md:inset-y-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-md md:rounded-[28px] md:p-6 ${
          isVisible
            ? "translate-y-0 opacity-100 md:translate-x-0"
            : "translate-y-8 opacity-0 md:translate-x-6 md:translate-y-0"
        }`}
        aria-label="Einkaufsliste"
      >
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[var(--line)] md:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="chip w-fit">Einkaufsliste</p>
            <h2 className="mt-3 text-xl font-semibold md:text-2xl">
              Diese Zutaten fehlen noch.
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Gesammelt über mehrere Rezepte hinweg.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-lg"
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
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--line)] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {formatQuantity(item) ? (
                        <span className="text-[var(--muted)]">{formatQuantity(item)} </span>
                      ) : null}
                      {item.name}
                    </p>

                    {item.recipeTitles?.length ? (
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {item.recipeTitles.join(", ")}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.name)}
                    className="shrink-0 text-sm text-[var(--muted)]"
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={copyList}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-5 text-white"
          >
            Liste kopieren
          </button>

          <button
            type="button"
            onClick={clearItems}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--line)] px-5"
          >
            Leeren
          </button>
        </div>
      </aside>
    </>
  );
}
