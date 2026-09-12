"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore
} from "react";
import { createLocalStore } from "@/lib/local-store";

export type ShoppingItem = {
  name: string;
  amount?: number;
  unit?: string;
  quantity: number;
  done?: boolean;
  recipeIds?: string[];
  recipeTitles?: string[];
};

type NewItem = {
  name: string;
  amount?: number;
  unit?: string;
  recipeId?: string;
  recipeTitle?: string;
};

type ShoppingListContextValue = {
  items: ShoppingItem[];
  isOpen: boolean;
  addItems: (items: NewItem[]) => void;
  removeItem: (name: string) => void;
  toggleDone: (name: string) => void;
  clearDone: () => void;
  clearItems: () => void;
  open: () => void;
  close: () => void;
};

const EMPTY: ShoppingItem[] = [];

const listStore = createLocalStore<ShoppingItem[]>(
  "fridge-chef-shopping-list",
  EMPTY,
  (parsed) => {
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item): item is ShoppingItem =>
        Boolean(item) && typeof item === "object" && typeof item.name === "string"
    );
  }
);

const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    listStore.subscribe,
    listStore.getSnapshot,
    listStore.getServerSnapshot
  );

  const [isOpen, setIsOpen] = useState(false);

  const addItems = useCallback((newItems: NewItem[]) => {
    const merged = [...listStore.get()];

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
        continue;
      }

      const existing = merged[index];

      // Two recipes needing 200 g each should read "400 g", not "200 g" twice.
      // Amounts only add up when both sides use the same unit.
      const sameUnit =
        existing.unit === item.unit &&
        typeof existing.amount === "number" &&
        typeof item.amount === "number";

      merged[index] = {
        ...existing,
        amount: sameUnit
          ? (existing.amount as number) + (item.amount as number)
          : existing.amount,
        quantity: existing.quantity + 1,
        recipeIds: item.recipeId
          ? Array.from(new Set([...(existing.recipeIds ?? []), item.recipeId]))
          : existing.recipeIds,
        recipeTitles: item.recipeTitle
          ? Array.from(new Set([...(existing.recipeTitles ?? []), item.recipeTitle]))
          : existing.recipeTitles
      };
    }

    listStore.set(merged);
  }, []);

  const removeItem = useCallback((name: string) => {
    listStore.set(
      listStore.get().filter((item) => normalizeName(item.name) !== normalizeName(name))
    );
  }, []);

  const toggleDone = useCallback((name: string) => {
    listStore.set(
      listStore
        .get()
        .map((item) =>
          normalizeName(item.name) === normalizeName(name)
            ? { ...item, done: !item.done }
            : item
        )
    );
  }, []);

  const clearDone = useCallback(() => {
    listStore.set(listStore.get().filter((item) => !item.done));
  }, []);

  const clearItems = useCallback(() => {
    listStore.clear();
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      addItems,
      removeItem,
      toggleDone,
      clearDone,
      clearItems,
      open,
      close
    }),
    [items, isOpen, addItems, removeItem, toggleDone, clearDone, clearItems, open, close]
  );

  return (
    <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);

  if (!context) {
    throw new Error("useShoppingList must be used inside ShoppingListProvider");
  }

  return context;
}
