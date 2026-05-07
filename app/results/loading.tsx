export default function ResultsLoading() {
  return (
    <main className="container-shell py-8">
      {/* Filter bar skeleton */}
      <div className="mb-8 flex flex-wrap items-center gap-2 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-4 backdrop-blur animate-pulse">
        <span className="h-5 w-16 rounded-full bg-[var(--line)]" />
        <span className="h-9 w-20 rounded-full bg-[var(--line)]" />
        <span className="h-9 w-24 rounded-full bg-[var(--line)]" />
        <span className="h-9 w-16 rounded-full bg-[var(--line)]" />
        <span className="ml-auto h-9 w-28 rounded-full bg-[var(--line)]" />
      </div>

      {/* Section header skeleton */}
      <section className="mb-10 space-y-3">
        <span className="block h-9 w-36 rounded-full bg-[var(--line)] animate-pulse" />
        <span className="block h-10 w-3/4 max-w-xl rounded-2xl bg-[var(--line)] animate-pulse" />
        <span className="block h-5 w-2/3 max-w-md rounded-xl bg-[var(--line)] animate-pulse" />
      </section>

      {/* Recipe card skeletons */}
      <section className="grid gap-8">
        {[1, 2, 3].map((n) => (
          <article key={n} className="card animate-pulse">
            <div className="h-72 bg-[var(--line)]" />
            <div className="space-y-4 p-6">
              <span className="block h-5 w-3/4 rounded-xl bg-[var(--line)]" />
              <span className="block h-4 w-1/2 rounded-lg bg-[var(--line)]" />
              <div className="flex gap-2">
                <span className="h-9 w-28 rounded-full bg-[var(--line)]" />
                <span className="h-9 w-24 rounded-full bg-[var(--line)]" />
                <span className="h-9 w-20 rounded-full bg-[var(--line)]" />
              </div>
              <span className="block h-12 w-36 rounded-2xl bg-[var(--line)]" />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
