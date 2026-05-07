import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container-shell min-h-screen">
      <section className="flex min-h-[86vh] flex-col justify-center gap-8">
        <div className="max-w-4xl space-y-6">
          <p className="chip w-fit">Premium Recipe Discovery</p>
          <h1 className="hero-title">
            Aus dem, was schon da ist,
            <br />
            werden 3 richtig gute Ideen.
          </h1>
          <p className="max-w-xl text-lg text-[var(--muted)]">
            Zutaten eingeben, Filter setzen, in Sekunden drei bewusst unterschiedliche
            Vorschläge erhalten.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/cook"
            className="inline-flex h-14 items-center rounded-2xl bg-[var(--brand)] px-6 text-white"
          >
            Jetzt starten
          </Link>
          <a
            href="#how"
            className="inline-flex h-14 items-center rounded-2xl border border-[var(--line)] px-6"
          >
            So funktioniert’s
          </a>
        </div>
      </section>

      <section id="how" className="grid gap-6 pb-24 md:grid-cols-3">
        {[
          ["1", "Zutaten eingeben", "Freitext, Chips oder schnelle Vorschläge."],
          ["2", "Filter setzen", "Optional nach Ernährung, Zeit oder Budget filtern."],
          ["3", "3 Ideen bekommen", "Nicht zufällig, sondern bewusst unterschiedlich."]
        ].map(([n, title, text]) => (
          <article key={n} className="glass rounded-[28px] p-6">
            <p className="text-sm text-[var(--muted)]">{n}</p>
            <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
            <p className="mt-3 text-[var(--muted)]">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}