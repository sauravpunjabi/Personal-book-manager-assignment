import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      <header>
        <span className="font-display text-lg font-semibold">Shelf</span>
      </header>

      <main className="flex flex-1 items-center">
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <h1 className="font-display text-5xl leading-tight font-semibold text-balance sm:text-6xl">
              Every book you meant to finish.
            </h1>
            <p className="text-lg text-muted text-pretty">
              A quiet place to keep what you are reading, what you finished, and what is
              still waiting.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center rounded-md bg-ink px-6 font-medium text-paper transition-colors hover:bg-ink/90"
            >
              Start your shelf
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-md border border-line bg-surface px-6 font-medium transition-colors hover:bg-paper"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
