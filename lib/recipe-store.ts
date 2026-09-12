// Durable storage for recipes that are generated at runtime (Ollama, Spoonacular).
//
// These recipes only ever existed in RAM, so every link to them broke as soon as
// the in-memory cache expired or the container restarted. This store keeps them
// on disk under DATA_DIR so /recipe/<id> stays resolvable.

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Recipe } from "@/lib/types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "generated-recipes.json");

/** Keep the file small enough to load eagerly; oldest entries are evicted first. */
const MAX_RECIPES = 400;

type StoredRecipe = { recipe: Recipe; savedAt: number };
type StoreShape = { version: 1; recipes: Record<string, StoredRecipe> };

type StoreState = {
  entries: Map<string, StoredRecipe>;
  loaded: boolean;
  /** Set once writing has failed, so a read-only volume degrades to memory-only. */
  writable: boolean;
  pendingWrite: Promise<void> | null;
};

const globalForStore = globalThis as unknown as { recipeStore?: StoreState };

const state: StoreState = (globalForStore.recipeStore ??= {
  entries: new Map(),
  loaded: false,
  writable: true,
  pendingWrite: null
});

async function load(): Promise<void> {
  if (state.loaded) return;
  state.loaded = true;

  try {
    const raw = await readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreShape;

    if (parsed?.version !== 1 || typeof parsed.recipes !== "object") return;

    const sorted = Object.entries(parsed.recipes).sort(
      (a, b) => (a[1]?.savedAt ?? 0) - (b[1]?.savedAt ?? 0)
    );

    for (const [id, entry] of sorted) {
      if (entry?.recipe?.id) state.entries.set(id, entry);
    }
  } catch {
    // Missing or corrupt file — start empty rather than failing the request
  }
}

async function flush(): Promise<void> {
  if (!state.writable) return;

  const payload: StoreShape = {
    version: 1,
    recipes: Object.fromEntries(state.entries)
  };

  try {
    await mkdir(DATA_DIR, { recursive: true });

    // Write to a temp file first so a crash mid-write cannot corrupt the store
    const tempFile = `${STORE_FILE}.${process.pid}.tmp`;
    await writeFile(tempFile, JSON.stringify(payload), "utf8");
    await rename(tempFile, STORE_FILE);
  } catch {
    state.writable = false;
  }
}

/** Queue a flush so concurrent saves never interleave their writes. */
function scheduleFlush(): void {
  state.pendingWrite = (state.pendingWrite ?? Promise.resolve())
    .then(flush)
    .catch(() => undefined);
}

export async function saveGeneratedRecipes(recipes: Recipe[]): Promise<void> {
  if (recipes.length === 0) return;

  await load();

  const now = Date.now();
  for (const recipe of recipes) {
    if (!recipe.id) continue;
    // Re-insert so recently used recipes move to the end of the eviction queue
    state.entries.delete(recipe.id);
    state.entries.set(recipe.id, { recipe, savedAt: now });
  }

  while (state.entries.size > MAX_RECIPES) {
    const oldest = state.entries.keys().next();
    if (oldest.done) break;
    state.entries.delete(oldest.value);
  }

  scheduleFlush();
}

export async function getGeneratedRecipe(id: string): Promise<Recipe | null> {
  await load();
  return state.entries.get(id)?.recipe ?? null;
}

export async function getStoreStats(): Promise<{
  count: number;
  writable: boolean;
  path: string;
}> {
  await load();
  return { count: state.entries.size, writable: state.writable, path: STORE_FILE };
}
