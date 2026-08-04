import { LibrarySkeleton } from '@/components/library/LibrarySkeleton';

/** The whole screen in outline, so the layout is there from the first frame */
export function LibraryShellSkeleton() {
  return (
    <div aria-hidden="true" className="flex min-h-screen">
      <aside className="hidden h-screen w-[236px] shrink-0 flex-col border-r border-line bg-[color-mix(in_oklab,var(--color-surface)_55%,var(--color-bg))] px-4 pt-6 pb-[18px] md:flex">
        <div className="flex items-center gap-[11px] px-2 pb-[22px]">
          <div className="size-[26px] rounded-[8px] bg-surface-2" />
          <div className="h-3 w-20 rounded bg-surface-2" />
        </div>

        <div className="h-2 w-16 rounded bg-surface-2 mx-2 mb-3" />
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex h-9 items-center gap-2.5 px-2">
              <div className="size-[7px] flex-none rounded-full bg-surface-2" />
              <div className="h-2.5 flex-1 rounded bg-surface-2" />
              <div className="h-2.5 w-4 rounded bg-surface-2" />
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2.5 px-2 py-2.5">
          <div className="size-7 flex-none rounded-full bg-surface-2" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-24 rounded bg-surface-2" />
            <div className="h-2 w-16 rounded bg-surface-2" />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-line-soft px-5 pt-[26px] pb-5 sm:px-10">
          <div className="flex flex-wrap items-end gap-6">
            <div className="min-w-[240px] flex-1 space-y-2.5">
              <div className="h-7 w-64 rounded bg-surface-2" />
              <div className="h-3 w-48 rounded bg-surface-2" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-full rounded-[12px] bg-surface-2 sm:w-[260px]" />
              <div className="h-10 w-[72px] rounded-[11px] bg-surface-2" />
              <div className="h-10 w-[112px] rounded-[12px] bg-surface-2" />
            </div>
          </div>

          <div className="mt-[22px] flex flex-wrap gap-x-[30px] gap-y-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-baseline gap-2">
                <div className="h-5 w-6 rounded bg-surface-2" />
                <div className="h-2.5 w-14 rounded bg-surface-2" />
              </div>
            ))}
          </div>
        </header>

        <section className="flex-1 px-5 pt-8 pb-[72px] sm:px-10">
          <LibrarySkeleton />
        </section>
      </div>
    </div>
  );
}
