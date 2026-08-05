'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/bookStatus';
import * as authService from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useFilterStore, type StatusFilter } from '@/store/filter.store';
import { BOOK_STATUSES, type Book } from '@/types/book';

interface LibrarySidebarProps {
  books: Book[];
}

export function LibrarySidebar({ books }: LibrarySidebarProps) {
  const status = useFilterStore((state) => state.status);
  const setStatus = useFilterStore((state) => state.setStatus);
  const activeTag = useFilterStore((state) => state.tag);
  const toggleTag = useFilterStore((state) => state.toggleTag);

  const shelves: Array<{ key: StatusFilter; label: string; count: number; dot: string }> =
    [
      { key: 'all', label: 'All books', count: books.length, dot: 'var(--color-ink-3)' },
      ...BOOK_STATUSES.map((key) => ({
        key,
        label: STATUS_LABELS[key],
        count: books.filter((book) => book.status === key).length,
        dot: STATUS_COLORS[key],
      })),
    ];

  const tags = [...new Set(books.flatMap((book) => book.tags))].sort();

  return (
    <aside className="sticky top-0 flex h-screen w-[236px] shrink-0 flex-col border-r border-line bg-[color-mix(in_oklab,var(--color-surface)_55%,var(--color-bg))] px-4 pt-6 pb-[18px]">
      <div className="flex items-center gap-[11px] px-2 pb-[22px]">
        <span className="flex size-[26px] items-center justify-center rounded-[8px] bg-accent pb-0.5 font-display text-[16px] leading-none text-on-fill">
          C
        </span>
        <span className="text-[14.5px] font-medium tracking-[-0.01em]">Chapter</span>
      </div>

      <p className="px-2 pb-[9px] text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">
        Collection
      </p>
      <nav className="flex flex-col gap-0.5">
        {shelves.map((shelf) => (
          <button
            key={shelf.key}
            type="button"
            aria-pressed={status === shelf.key}
            onClick={() => setStatus(shelf.key)}
            className={`flex h-9 items-center gap-2.5 rounded-[9px] px-2 text-[13.5px] transition-colors hover:bg-surface-2 ${
              status === shelf.key ? 'bg-surface-2 font-medium text-ink' : 'text-ink-2'
            }`}
          >
            <span
              className="size-[7px] flex-none rounded-full"
              style={{ background: shelf.dot }}
            />
            <span className="flex-1 text-left">{shelf.label}</span>
            <span className="text-[12px] text-ink-3 tabular-nums">{shelf.count}</span>
          </button>
        ))}
      </nav>

      {tags.length > 0 && (
        <>
          <p className="px-2 pt-6 pb-2.5 text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5 px-1.5">
            {tags.map((tag) => {
              const isOn = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => toggleTag(tag)}
                  className="rounded-full border px-2.5 py-[5px] text-[12px] transition-colors hover:border-ink-3"
                  style={{
                    background: isOn
                      ? 'color-mix(in oklab, var(--color-accent) 14%, var(--color-surface))'
                      : 'transparent',
                    color: isOn ? 'var(--color-accent)' : 'var(--color-ink-2)',
                    borderColor: isOn
                      ? 'color-mix(in oklab, var(--color-accent) 40%, var(--color-surface))'
                      : 'var(--color-line)',
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-auto flex flex-col gap-1 pt-5">
        <ThemeButton />
        <AccountCard />
      </div>
    </aside>
  );
}

function ThemeButton() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 items-center gap-2.5 rounded-[9px] px-2 text-[13.5px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <span
        className="size-[14px] flex-none rounded-full border-[1.5px] border-current"
        style={{ background: theme === 'dark' ? 'currentColor' : 'transparent' }}
      />
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}

function AccountCard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.logout);
  const [isLeaving, setIsLeaving] = useState(false);

  const initials = (user?.name ?? '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  async function signOut() {
    setIsLeaving(true);

    try {
      await authService.logout();
    } catch (error) {
      // Never strand someone in the app because the network blipped.
      console.error(error);
    } finally {
      clearSession();
      router.replace('/');
    }
  }

  return (
    <div className="flex items-center gap-2.5 rounded-[11px] px-2 py-2.5 transition-colors hover:bg-surface-2">
      <span className="flex size-7 flex-none items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-sage)_22%,var(--color-surface))] text-[11.5px] font-semibold text-sage">
        {initials || '·'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium">{user?.name}</span>
        <span className="block text-[11px] text-ink-3">Your library</span>
      </span>
      <button
        type="button"
        onClick={signOut}
        disabled={isLeaving}
        aria-label="Sign out"
        title="Sign out"
        className="flex size-6 items-center justify-center rounded-[7px] text-ink-3 transition-colors hover:bg-surface hover:text-accent disabled:opacity-50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 2.5H3.5A1 1 0 0 0 2.5 3.5v9a1 1 0 0 0 1 1H6" />
          <path d="M10.5 5.5 13 8l-2.5 2.5" />
          <path d="M13 8H6" />
        </svg>
      </button>
    </div>
  );
}
