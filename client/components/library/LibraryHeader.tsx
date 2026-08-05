'use client';

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
  const reading = books.filter((book) => book.status === 'reading');

  const nudge = books.length
    ? reading.length
      ? `${reading.length} book${reading.length === 1 ? '' : 's'} in progress.`
      : 'Nothing in progress — pick something from the want-to-read shelf.'
    : 'An empty shelf, waiting.';

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
              label="Grid view"
              isActive={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="5" height="5" rx="1.4" />
                <rect x="9" y="2" width="5" height="5" rx="1.4" />
                <rect x="2" y="9" width="5" height="5" rx="1.4" />
                <rect x="9" y="9" width="5" height="5" rx="1.4" />
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
          <div key={stat.label} className="flex items-baseline gap-2">
            <span
              className="font-display text-[23px] leading-none tabular-nums"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
            <span className="text-[12px] tracking-[0.01em] text-ink-2">{stat.label}</span>
          </div>
        ))}
      </div>
    </header>
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
