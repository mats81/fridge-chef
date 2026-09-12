"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny subscribable store over localStorage, shaped for `useSyncExternalStore`.
 *
 * Reading localStorage inside an effect and calling setState is the pattern React
 * 19 flags (`react-hooks/set-state-in-effect`): it renders once with the wrong
 * value, then immediately re-renders. useSyncExternalStore is the supported way
 * to read an external store while staying hydration-safe — `getServerSnapshot`
 * returns the fallback, so server and first client render agree.
 */
export type LocalStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  get: () => T;
  set: (value: T) => void;
  clear: () => void;
};

export function createLocalStore<T>(
  key: string,
  fallback: T,
  parse: (raw: unknown) => T | null
): LocalStore<T> {
  const listeners = new Set<() => void>();

  // Snapshots must be referentially stable between renders, so the parsed value
  // is cached and only rebuilt when the raw string actually changed.
  let cachedRaw: string | null = null;
  let cachedValue: T = fallback;
  let initialized = false;

  function readRaw(): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function getSnapshot(): T {
    const raw = readRaw();

    if (!initialized || raw !== cachedRaw) {
      initialized = true;
      cachedRaw = raw;

      if (raw === null) {
        cachedValue = fallback;
      } else {
        try {
          cachedValue = parse(JSON.parse(raw)) ?? fallback;
        } catch {
          cachedValue = fallback;
        }
      }
    }

    return cachedValue;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      // `storage` only fires in *other* tabs; same-tab updates go through emit()
      window.addEventListener("storage", listener);

      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
      };
    },

    getSnapshot,

    getServerSnapshot: () => fallback,

    get: getSnapshot,

    set(value: T) {
      cachedValue = value;
      initialized = true;

      try {
        const raw = JSON.stringify(value);
        localStorage.setItem(key, raw);
        cachedRaw = raw;
      } catch {
        // Storage full, disabled, or private mode: keep the value in memory and
        // pin the cache key to whatever is stored so the snapshot stays stable.
        cachedRaw = readRaw();
      }

      emit();
    },

    clear() {
      cachedValue = fallback;
      initialized = true;

      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }

      cachedRaw = readRaw();
      emit();
    }
  };
}

const noopSubscribe = () => () => {};

/**
 * True once the client has taken over from the server-rendered markup.
 * Useful to avoid flashing an "empty" state before localStorage is read.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
