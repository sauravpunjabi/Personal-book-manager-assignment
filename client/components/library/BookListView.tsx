'use client';

import { BookCover } from '@/components/books/BookCover';
import { StatusPill } from '@/components/library/BookGrid';
import type { Book, BookStatus } from '@/types/book';

const COLUMNS = 'grid-cols-[1fr_190px_190px_130px]';

interface BookListViewProps {
  books: Book[];
  onOpen: (book: Book) => void;
  onStatusChange: (book: Book, status: BookStatus) => void;
}

export function BookListView({ books, onOpen, onStatusChange }: BookListViewProps) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-line bg-surface shadow-[var(--shadow-1)]">
      <div className="min-w-[720px]">
        <div
          className={`grid ${COLUMNS} gap-4 border-b border-line bg-[color-mix(in_oklab,var(--color-surface-2)_55%,var(--color-surface))] px-5 py-[11px] text-[10.5px] tracking-[0.11em] text-ink-3 uppercase`}
        >
          <span>Book</span>
          <span>Author</span>
          <span>Tags</span>
          <span>Status</span>
        </div>

        <ul>
          {books.map((book) => (
            <li
              key={book._id}
              className={`grid ${COLUMNS} items-center gap-4 border-b border-line-soft px-5 py-3 transition-colors last:border-b-0 hover:bg-[color-mix(in_oklab,var(--color-surface-2)_60%,var(--color-surface))]`}
            >
              <button
                type="button"
                onClick={() => onOpen(book)}
                aria-label={`Edit ${book.title}`}
                className="flex min-w-0 items-center gap-3.5 text-left"
              >
                <BookCover book={book} variant="thumb" className="w-[38px] flex-none" />
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-medium">
                    {book.title}
                  </span>
                  <span className="mt-1 block text-[11.5px] text-ink-3">
                    {new Date(book.createdAt).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </span>
              </button>

              <span className="truncate text-[13px] text-ink-2">{book.author}</span>

              <span className="flex flex-wrap gap-[5px]">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-2 px-2 py-[3px] text-[11px] text-ink-2"
                  >
                    {tag}
                  </span>
                ))}
              </span>

              <span>
                <StatusPill book={book} onStatusChange={onStatusChange} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
