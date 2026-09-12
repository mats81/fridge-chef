// In-memory cache with TTL and a bounded LRU eviction policy.
// Survives hot reloads via globalThis, but NOT container restarts —
// anything that must outlive a restart belongs in lib/recipe-store.ts.

type CacheEntry = { value: unknown; expiry: number };

const ONE_HOUR = 60 * 60 * 1000;
const MAX_ENTRIES = 500;

const globalForCache = globalThis as unknown as {
  simpleCache?: Map<string, CacheEntry>;
};

const store = (globalForCache.simpleCache ??= new Map<string, CacheEntry>());

export const simpleCache = {
  get<T>(key: string): T | null {
    const entry = store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      store.delete(key);
      return null;
    }

    // Touch the key so it becomes the most-recently-used entry
    store.delete(key);
    store.set(key, entry);

    return entry.value as T;
  },

  set<T>(key: string, value: T, ttl = ONE_HOUR): void {
    store.delete(key);
    store.set(key, { value, expiry: Date.now() + ttl });

    if (store.size <= MAX_ENTRIES) return;

    // Drop expired entries first, then the least-recently-used ones
    const now = Date.now();
    for (const [entryKey, entry] of store) {
      if (store.size <= MAX_ENTRIES) break;
      if (now > entry.expiry) store.delete(entryKey);
    }

    while (store.size > MAX_ENTRIES) {
      const oldest = store.keys().next();
      if (oldest.done) break;
      store.delete(oldest.value);
    }
  },

  size(): number {
    return store.size;
  }
};
