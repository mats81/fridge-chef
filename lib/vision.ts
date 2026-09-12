// Recognise groceries on a photo using a vision model on the existing Ollama host.
// Enabled by setting OLLAMA_VISION_MODEL (e.g. "llava:7b" or "qwen2.5vl:7b").

const PROMPT = `Du siehst ein Foto aus einem Kühlschrank, einer Vorratskammer oder von Einkäufen.

Erkenne alle Lebensmittel und Zutaten, die eindeutig zu sehen sind. Nenne sie auf Deutsch in der Einzahl oder gebräuchlichen Form, so wie man sie in ein Rezept schreiben würde (z.B. "Tomaten", "Joghurt", "Eier", "Karotten").

Regeln:
- Nur Dinge auflisten, die du wirklich siehst. Nichts erraten.
- Keine Marken, keine Verpackungsbeschreibungen, keine Mengen.
- Höchstens 20 Einträge.

Antworte ausschließlich mit JSON in diesem Format:
{ "ingredients": ["Tomaten", "Eier", "Joghurt"] }`;

export function isVisionEnabled(): boolean {
  return Boolean(process.env.OLLAMA_BASE_URL && process.env.OLLAMA_VISION_MODEL);
}

export type VisionResult =
  | { ok: true; ingredients: string[] }
  | { ok: false; error: string };

export async function detectIngredientsFromImage(
  imageBase64: string
): Promise<VisionResult> {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  const model = process.env.OLLAMA_VISION_MODEL;
  const timeoutMs = Number(process.env.OLLAMA_VISION_TIMEOUT_MS) || 120_000;

  if (!baseUrl || !model) {
    return { ok: false, error: "Bilderkennung ist auf diesem Server nicht aktiviert." };
  }

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: PROMPT, images: [imageBase64] }],
        stream: false,
        format: "json",
        options: { temperature: 0.1 }
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!response.ok) {
      // 404 from Ollama means the model was never pulled — say so explicitly,
      // because "nichts erkannt" would send the user looking in the wrong place.
      if (response.status === 404) {
        return {
          ok: false,
          error: `Das Modell "${model}" ist auf dem Ollama-Server nicht installiert.`
        };
      }
      return { ok: false, error: "Der Ollama-Server hat die Anfrage abgelehnt." };
    }

    const data = await response.json();
    const content = data.message?.content;
    if (!content) return { ok: false, error: "Leere Antwort vom Modell." };

    const parsed = JSON.parse(content);
    const raw: unknown = parsed.ingredients;

    if (!Array.isArray(raw)) {
      return { ok: false, error: "Auf dem Bild wurden keine Zutaten erkannt." };
    }

    const seen = new Set<string>();
    const ingredients: string[] = [];

    for (const entry of raw) {
      if (typeof entry !== "string") continue;

      const cleaned = entry.trim().replace(/\s+/g, " ").slice(0, 40);
      if (cleaned.length < 2) continue;

      const key = cleaned.toLowerCase();
      if (seen.has(key)) continue;

      seen.add(key);
      ingredients.push(cleaned);

      if (ingredients.length >= 20) break;
    }

    return { ok: true, ingredients };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "TimeoutError";
    return {
      ok: false,
      error: aborted
        ? "Die Bilderkennung hat zu lange gebraucht. Versuch es mit einem kleineren Foto."
        : "Der Ollama-Server war nicht erreichbar."
    };
  }
}
