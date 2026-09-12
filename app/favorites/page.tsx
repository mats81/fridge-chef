import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";

export const metadata: Metadata = {
  title: "Gemerkte Rezepte — Fridge Chef",
  description: "Deine gespeicherten Rezepte auf einen Blick."
};

export default function FavoritesPage() {
  return (
    <main className="container-shell py-10">
      <section className="space-y-8">
        <div className="space-y-3">
          <p className="chip w-fit">Deine Sammlung</p>
          <h1 className="section-title">Gemerkte Rezepte</h1>
          <p className="text-[var(--muted)]">
            Alles, was du dir gemerkt hast — gespeichert auf diesem Gerät.
          </p>
        </div>

        <FavoritesList />
      </section>
    </main>
  );
}
