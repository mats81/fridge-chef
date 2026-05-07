import Link from "next/link";
import { RecipeImage } from "@/components/recipe-image";

interface Props {
  item: {
    recipe: {
      id: string;
      title: string;
      description: string;
      image: string;
      timeMinutes: number;
      difficulty: string;
    };
    matched: string[];
    missing: string[];
    reason: string;
  };
  haveParam: string;
  priority?: boolean;
}

export function RecipeCard({ item, haveParam, priority = false }: Props) {
  return (
    <article className="card">
      <div className="relative h-72">
        <RecipeImage
          src={item.recipe.image}
          alt={item.recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 text-white">
          <p className="text-sm opacity-80">
            {item.recipe.timeMinutes} Min · {item.recipe.difficulty}
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{item.recipe.title}</h3>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <p className="text-[var(--text-secondary)]">{item.recipe.description}</p>
        <p className="text-sm text-[var(--muted)]">{item.reason}</p>

        <div className="flex flex-wrap gap-2">
          {item.matched.slice(0, 4).map((match) => (
            <span key={match} className="chip">
              Zuhause: {match}
            </span>
          ))}

          {item.missing.slice(0, 3).map((miss) => (
            <span key={miss} className="chip">
              Fehlt: {miss}
            </span>
          ))}
        </div>

        <Link
          href={`/recipe/${item.recipe.id}?have=${encodeURIComponent(haveParam)}`}
          className="inline-flex h-12 items-center rounded-2xl bg-[var(--brand)] px-5 text-white"
        >
          Rezept ansehen
        </Link>
      </div>
    </article>
  );
}