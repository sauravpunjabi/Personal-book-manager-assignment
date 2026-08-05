'use client';

import { useReducedMotion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/bookStatus';
import { useFilterStore } from '@/store/filter.store';
import { BOOK_STATUSES, type Book } from '@/types/book';

const NOON = 12;
const EVENING = 17;

function greetingFor(hour: number): string {
  if (hour < NOON) {
    return 'Good morning';
  }
  return hour < EVENING ? 'Good afternoon' : 'Good evening';
}

/** Picks the book closest to finishing and says how far is left */
function nudgeFor(books: Book[]): string {
  if (books.length === 0) {
    return 'An empty shelf, waiting.';
  }

  const nearest = books
    .filter((book) => book.status === 'reading' && book.pages > 0)
    .sort((a, b) => b.currentPage / b.pages - a.currentPage / a.pages)[0];

  if (nearest) {
    const remaining = Math.max(nearest.pages - nearest.currentPage, 0);

    if (remaining === 0) {
      return `You have finished ${nearest.title} — mark it completed.`;
    }
    return `You are ${remaining} page${remaining === 1 ? '' : 's'} from finishing ${nearest.title}.`;
  }

  const reading = books.filter((book) => book.status === 'reading').length;

  if (reading > 0) {
    return `${reading} book${reading === 1 ? '' : 's'} in progress.`;
  }
  return 'Nothing in progress — pick something from the want-to-read shelf.';
}

interface LibraryHeaderProps {
  books: Book[];
  name?: string;
  onAdd: () => void;
}

export function LibraryHeader({ books, name, onAdd }: LibraryHeaderProps) {
  const query = useFilterStore((state) => state.query);
  const setQuery = useFilterStore((state) => state.setQuery);
  const view = useFilterStore((state) => state.view);
  const setView = useFilterStore((state) => state.setView);

  // Safe to read the clock: this only ever renders in the browser
  const greeting = greetingFor(new Date().getHours());
  const nudge = nudgeFor(books);

  const stats = [
    { label: 'books', value: books.length, color: 'var(--color-ink)' },
    ...BOOK_STATUSES.map((status) => ({
      label: STATUS_LABELS[status].toLowerCase(),
      value: books.filter((book) => book.status === status).length,
      color: STATUS_COLORS[status],
    })),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-line-soft bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] px-5 pt-[26px] pb-5 backdrop-blur-[12px] sm:px-10">
      <div className="flex flex-wrap items-end gap-6">
        <div className="min-w-[240px] flex-1">
          <h1 className="font-display text-[29px] leading-[1.2] tracking-[-0.015em]">
            {greeting}
            {name ? `, ${name}` : ''}
          </h1>
          <p className="mt-[7px] text-[13.5px] text-ink-2">{nudge}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="field-shell flex h-10 w-full items-center gap-[9px] rounded-[12px] border border-line bg-surface px-3.5 transition-[border-color,box-shadow] duration-200 sm:w-[260px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="flex-none text-ink-3"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="4.4" />
              <path d="m10.4 10.4 3.1 3.1" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search your library"
              placeholder="Search title, author, tag"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none"
            />
          </div>

          <div
            role="group"
            aria-label="View"
            className="flex gap-0.5 rounded-[11px] border border-line bg-surface p-[3px]"
          >
            <ViewButton
              label="Shelf view"
              isActive={view === 'shelf'}
              onClick={() => setView('shelf')}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="2.4" height="9" rx="0.6" />
                <rect x="5.2" y="4.5" width="2.4" height="7.5" rx="0.6" />
                <rect x="8.4" y="2.5" width="2.4" height="9.5" rx="0.6" />
                <rect x="11.6" y="5" width="2.4" height="7" rx="0.6" />
                <rect x="1.5" y="13" width="13" height="1.4" rx="0.7" />
              </svg>
            </ViewButton>
            <ViewButton
              label="List view"
              isActive={view === 'list'}
              onClick={() => setView('list')}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M3 4h10M3 8h10M3 12h10" />
              </svg>
            </ViewButton>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 items-center gap-2 rounded-[12px] bg-accent px-4 text-[13.5px] font-medium text-on-fill shadow-[var(--shadow-1)] transition-[filter,transform] hover:brightness-[1.06] active:scale-[.97]"
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
            Add Book
          </button>
        </div>
      </div>

      <div className="mt-[22px] flex flex-wrap items-center gap-x-[30px] gap-y-2">
        {stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>
    </header>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  const reduceMotion = useReducedMotion();
  const shown = useCountUp(value, !reduceMotion);

  return (
    <div className="flex items-baseline gap-2">
      <span
        className="font-display text-[23px] leading-none tabular-nums"
        style={{ color }}
      >
        {shown}
      </span>
      <span className="text-[12px] tracking-[0.01em] text-ink-2">{label}</span>
    </div>
  );
}

function ViewButton({
  label,
  isActive,
  onClick,
  children,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
      className={`flex size-8 items-center justify-center rounded-[8px] transition-colors ${
        isActive ? 'bg-surface-2 text-ink' : 'text-ink-3 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
