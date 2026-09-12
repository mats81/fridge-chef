import { detectIngredientsFromImage, isVisionEnabled } from "@/lib/vision";

/** Uploads are never cacheable and must not be prerendered. */
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(request: Request) {
  if (!isVisionEnabled()) {
    return Response.json(
      { error: "Bilderkennung ist auf diesem Server nicht aktiviert." },
      { status: 503 }
    );
  }

  let file: File | null = null;

  try {
    const formData = await request.formData();
    const value = formData.get("image");
    if (value instanceof File) file = value;
  } catch {
    return Response.json({ error: "Ungültiger Upload." }, { status: 400 });
  }

  if (!file) {
    return Response.json({ error: "Kein Bild empfangen." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "Das Bild ist zu groß (max. 8 MB)." },
      { status: 413 }
    );
  }

  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: "Nur JPEG, PNG, WebP oder HEIC werden unterstützt." },
      { status: 415 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await detectIngredientsFromImage(buffer.toString("base64"));

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({ ingredients: result.ingredients });
}
