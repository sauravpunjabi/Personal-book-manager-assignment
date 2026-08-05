'use client';

/** The "nothing here yet" states, both lifted from the design. */

export function EmptyLibrary({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex animate-[fadeUp_.5s_ease_both] flex-col items-center px-6 pt-[60px] pb-20 text-center">
      <div aria-hidden="true" className="flex h-[120px] items-end gap-[7px] opacity-90">
        <span className="w-[26px] rounded-t-[3px] bg-[color-mix(in_oklab,var(--color-accent)_30%,var(--color-surface-2))] shadow-[var(--shadow-1)] [height:84px]" />
        <span className="w-5 rounded-t-[3px] bg-surface-2 shadow-[var(--shadow-1)] [height:104px]" />
        <span className="w-[30px] rounded-t-[3px] bg-[color-mix(in_oklab,var(--color-sage)_26%,var(--color-surface-2))] shadow-[var(--shadow-1)] [height:70px]" />
        <span className="w-[18px] rounded-t-[3px] border-[1.5px] border-dashed border-line [height:96px]" />
      </div>
      <div aria-hidden="true" className="mt-0.5 h-px w-[170px] bg-line" />

      <h2 className="mt-[30px] font-display text-[26px] tracking-[-0.015em] text-balance">
        Every great library starts with one book.
      </h2>
      <p className="mt-[11px] max-w-[380px] text-[14px] leading-[1.65] text-ink-2">
        Add the book on your nightstand — or the one you keep meaning to start. The shelf
        fills up faster than you&rsquo;d think.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-[26px] flex h-11 items-center gap-2 rounded-[12px] bg-accent px-5 text-[14px] font-medium text-on-fill shadow-[var(--shadow-2)] transition-[filter,transform] hover:brightness-[1.06] active:scale-[.98]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M8 3.2v9.6M3.2 8h9.6" />
        </svg>
        Add your first book
      </button>
    </div>
  );
}

export function EmptyResults({ echo, onClear }: { echo: string; onClear: () => void }) {
  return (
    <div className="animate-[fadeUp_.45s_ease_both] py-[74px] text-center">
      <h2 className="font-display text-[22px] tracking-[-0.01em]">
        Nothing on this shelf yet
      </h2>
      <p className="mt-[9px] text-[14px] text-ink-2">
        No books match {echo}. Try a different tag or status.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 h-10 rounded-[12px] border border-line bg-surface px-[18px] text-[13.5px] transition-colors hover:bg-surface-2"
      >
        Show everything
      </button>
    </div>
  );
}
