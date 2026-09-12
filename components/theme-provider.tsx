"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolved: "light" | "dark";
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolved: "light",
  toggle: () => {}
});

const STORAGE_KEY = "fridge-chef-theme";

/**
 * Stored as a bare string, not JSON — the inline anti-flash script in the root
 * layout reads this same key before React boots and compares it directly.
 * Snapshots are primitives, so there is no reference-stability concern.
 */
const themeStore = {
  listeners: new Set<() => void>(),

  subscribe(listener: () => void) {
    themeStore.listeners.add(listener);
    window.addEventListener("storage", listener);

    return () => {
      themeStore.listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  },

  getSnapshot(): Theme {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "dark" || raw === "light" || raw === "system") return raw;
    } catch {
      // Storage unavailable — fall through to the system preference
    }
    return "system";
  },

  getServerSnapshot: (): Theme => "system",

  set(value: Theme) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    for (const listener of themeStore.listeners) listener();
  }
};

/** Subscribe to the OS colour scheme so "system" keeps following it. */
const systemThemeStore = {
  subscribe(listener: () => void) {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  },

  getSnapshot: (): "light" | "dark" =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",

  getServerSnapshot: (): "light" | "dark" => "light"
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  const systemTheme = useSyncExternalStore(
    systemThemeStore.subscribe,
    systemThemeStore.getSnapshot,
    systemThemeStore.getServerSnapshot
  );

  const resolved: "light" | "dark" = theme === "system" ? systemTheme : theme;

  // Pushing a class onto <html> is exactly what effects are for: syncing React
  // state into an external system. The inline script handles the first paint,
  // this keeps it correct afterwards.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  const toggle = useCallback(() => {
    themeStore.set(resolved === "light" ? "dark" : "light");
  }, [resolved]);

  return (
    <ThemeContext.Provider value={{ theme, resolved, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
