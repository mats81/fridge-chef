import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="glass rounded-[28px] p-10">
        <p className="chip w-fit mx-auto">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Seite nicht gefunden</h1>
        <p className="mt-3 max-w-md text-[var(--muted)]">
          Die Seite, die du suchst, gibt es nicht oder wurde verschoben.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/cook"
            className="inline-flex h-12 items-center rounded-2xl bg-[var(--brand)] px-5 text-white"
          >
            Zutaten eingeben
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-2xl border border-[var(--line)] px-5"
          >
            Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
