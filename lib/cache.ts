// lib/cache.ts
const globalForCache = globalThis as unknown as { simpleCache: Map<string, { value: any; expiry: number }> };
const ONE_HOUR = 60 * 60 * 1000;

if (!globalForCache.simpleCache) {
  globalForCache.simpleCache = new Map();
}

export const simpleCache = {
  get(key: string) {
    const entry = globalForCache.simpleCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      globalForCache.simpleCache.delete(key);
      return null;
    }
    return entry.value;
  },
  set(key: string, value: any, ttl = ONE_HOUR) {
    const expiry = Date.now() + ttl;
    globalForCache.simpleCache.set(key, { value, expiry });
  }
};