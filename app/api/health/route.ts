import { getStoreStats } from "@/lib/recipe-store";
import { simpleCache } from "@/lib/cache";
import { isVisionEnabled } from "@/lib/vision";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStoreStats();

  return Response.json({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    features: {
      ollama: Boolean(process.env.OLLAMA_BASE_URL),
      vision: isVisionEnabled(),
      spoonacular: Boolean(process.env.SPOONACULAR_API_KEY),
      unsplash: Boolean(process.env.UNSPLASH_ACCESS_KEY)
    },
    store: {
      recipes: store.count,
      // false means DATA_DIR is not writable — generated recipes stay memory-only
      persistent: store.writable
    },
    cacheEntries: simpleCache.size()
  });
}
