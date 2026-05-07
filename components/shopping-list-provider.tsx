"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type ShoppingItem = {
  name: string;
  amount?: number;
  unit?: string;
  quantity: number;
  recipeIds?: string[];
  recipeTitles?: string[];
};

type ShoppingListContextValue = {
  items: ShoppingItem[];
  isOpen: boolean;
  addItems: (
    items: Array<{
      name: string;
      amount?: number;
      unit?: string;
      recipeId?: string;
      recipeTitle?: string;
    }>
  ) => void;
  removeItem: (name: string) => void;
  clearItems: () => void;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "fridge-chef-shopping-list";

const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function loadFromStorage(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: ShoppingItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — ignore
  }
}

export function ShoppingListProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Load from localStorage on mount (client only)
  useEffect(() => {
    setItems(loadFromStorage());
    hydrated.current = true;
  }, []);

  // Persist to localStorage on every change (skip initial hydration)
  useEffect(() => {
    if (hydrated.current) {
      saveToStorage(items);
    }
  }, [items]);

  const addItems = (
    newItems: Array<{
      name: string;
      amount?: number;
      unit?: string;
      recipeId?: string;
      recipeTitle?: string;
    }>
  ) => {
    setItems((current) => {
      const merged = [...current];

      for (const item of newItems) {
        const index = merged.findIndex(
          (entry) => normalizeName(entry.name) === normalizeName(item.name)
        );

        if (index === -1) {
          merged.push({
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            quantity: 1,
            recipeIds: item.recipeId ? [item.recipeId] : [],
            recipeTitles: item.recipeTitle ? [item.recipeTitle] : []
          });
        } else {
          const existing = merged[index];

          merged[index] = {
            ...existing,
            quantity: existing.quantity + 1,
            recipeIds: item.recipeId
              ? Array.from(new Set([...(existing.recipeIds ?? []), item.recipeId]))
              : existing.recipeIds,
            recipeTitles: item.recipeTitle
              ? Array.from(new Set([...(existing.recipeTitles ?? []), item.recipeTitle]))
              : existing.recipeTitles
          };
        }
      }

      return merged;
    });
  };

  const removeItem = (name: string) => {
    setItems((current) =>
      current.filter((item) => normalizeName(item.name) !== normalizeName(name))
    );
  };

  const clearItems = () => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      addItems,
      removeItem,
      clearItems,
      open,
      close
    }),
    [items, isOpen]
  );

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);

  if (!context) {
    throw new Error("useShoppingList must be used inside ShoppingListProvider");
  }

  return context;
}