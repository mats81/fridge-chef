import type { Metadata } from "next";
import { connection } from "next/server";
import { IngredientInput } from "@/components/ingredient-input";
import { isVisionEnabled } from "@/lib/vision";

export const metadata: Metadata = {
  title: "Zutaten eingeben — Fridge Chef",
  description: "Gib ein, was du zuhause hast, und erhalte drei bewusst unterschiedliche Rezeptideen."
};

export default async function CookPage() {
  // Without this the page is prerendered at build time, where the runtime
  // environment does not exist yet — the Docker build stage has no access to
  // the container's variables, so the camera button would always be hidden.
  await connection();

  return (
    <main className="container-shell py-10">
      <section className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="chip w-fit">Deine Zutaten</p>
          <h1 className="section-title">Was hast du heute zuhause?</h1>
          <p className="text-[var(--muted)]">
            Gib einfach ein, was da ist. Die App baut daraus drei bewusst
            unterschiedliche Rezeptideen.
          </p>
        </div>

        <IngredientInput visionEnabled={isVisionEnabled()} />
      </section>
    </main>
  );
}