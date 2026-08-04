'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/bookStatus';
import * as authService from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useFilterStore, type StatusFilter } from '@/store/filter.store';
import { BOOK_STATUSES, type Book } from '@/types/book';

/** The phone stand-in for the sidebar, since the design has no mobile layout */
export function MobileShelfBar({ books }: { books: Book[] }) {
  const status = useFilterStore((state) => state.status);
  const setStatus = useFilterStore((state) => state.setStatus);
  const activeTag = useFilterStore((state) => state.tag);
  const toggleTag = useFilterStore((state) => state.toggleTag);

  const shelves: Array<{ key: StatusFilter; label: string; count: number; dot: string }> =
    [
      { key: 'all', label: 'All', count: books.length, dot: 'var(--color-ink-3)' },
      ...BOOK_STATUSES.map((key) => ({
        key,
        label: STATUS_LABELS[key],
        count: books.filter((book) => book.status === key).length,
        dot: STATUS_COLORS[key],
      })),
    ];

  const tags = [...new Set(books.flatMap((book) => book.tags))].sort();

  return (
    <div className="border-b border-line-soft md:hidden">
      <div
        role="group"
        aria-label="Filter by shelf"
        className="flex gap-1.5 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shelves.map((shelf) => (
          <button
            key={shelf.key}
            type="button"
            aria-pressed={status === shelf.key}
            onClick={() => setStatus(shelf.key)}
            className={`flex h-9 flex-none items-center gap-2 rounded-full border px-3 text-[13px] transition-colors ${
              status === shelf.key
                ? 'border-ink bg-ink text-bg'
                : 'border-line bg-surface text-ink-2'
            }`}
          >
            <span
              className="size-[6px] flex-none rounded-full"
              style={{ background: status === shelf.key ? 'currentColor' : shelf.dot }}
            />
            {shelf.label}
            <span className="tabular-nums opacity-70">{shelf.count}</span>
          </button>
        ))}

        <span className="mx-1 h-9 w-px flex-none bg-line" />
        <ThemeChip />
        <SignOutChip />
      </div>

      {tags.length > 0 && (
        <div
          role="group"
          aria-label="Filter by tag"
          className="flex gap-1.5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tags.map((tag) => {
            const isOn = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={isOn}
                onClick={() => toggleTag(tag)}
                className="flex h-8 flex-none items-center rounded-full border px-3 text-[12px] transition-colors"
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
      )}
    </div>
  );
}

function ThemeChip() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex size-9 flex-none items-center justify-center rounded-full border border-line bg-surface text-ink-2"
    >
      <span
        className="size-[13px] rounded-full border-[1.5px] border-current"
        style={{ background: theme === 'dark' ? 'currentColor' : 'transparent' }}
      />
    </button>
  );
}

function SignOutChip() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.logout);
  const [isLeaving, setIsLeaving] = useState(false);

  async function signOut() {
    setIsLeaving(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearSession();
      router.replace('/');
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isLeaving}
      aria-label="Sign out"
      className="flex size-9 flex-none items-center justify-center rounded-full border border-line bg-surface text-ink-2 disabled:opacity-50"
    >
      <svg
        width="15"
        height="15"
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
  );
}
