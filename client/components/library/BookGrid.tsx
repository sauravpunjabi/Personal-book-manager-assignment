'use client';

import { BookCover } from '@/components/books/BookCover';
import { STATUS_COLORS, STATUS_LABELS, nextStatus, statusTint } from '@/lib/bookStatus';
import type { Book, BookStatus } from '@/types/book';

const STAGGER_STEP_MS = 26;
const MAX_STAGGER_STEPS = 12;

interface BookGridProps {
  books: Book[];
  onOpen: (book: Book) => void;
  onStatusChange: (book: Book, status: BookStatus) => void;
}

export function BookGrid({ books, onOpen, onStatusChange }: BookGridProps) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-6 gap-y-[34px] sm:grid-cols-[repeat(auto-fill,minmax(172px,1fr))]">
      {books.map((book, index) => (
        <li
          key={book._id}
          className="animate-[fadeUp_.5s_cubic-bezier(.2,.7,.3,1)_both]"
          style={{
            animationDelay: `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP_MS}ms`,
          }}
        >
          <button
            type="button"
            onClick={() => onOpen(book)}
            aria-label={`Edit ${book.title}`}
            className="block w-full text-left"
          >
            <BookCover
              book={book}
              className="transition-[transform,box-shadow] duration-[340ms] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-3)]"
            />
            <p className="mt-3.5 text-[13.5px] leading-[1.35] font-medium tracking-[-0.005em] text-pretty">
              {book.title}
            </p>
            <p className="mt-[3px] text-[12.5px] text-ink-3">{book.author}</p>
          </button>

          <StatusPill book={book} onStatusChange={onStatusChange} />
        </li>
      ))}
    </ul>
  );
}

export function StatusPill({
  book,
  onStatusChange,
}: {
  book: Book;
  onStatusChange: (book: Book, status: BookStatus) => void;
}) {
  const upcoming = nextStatus(book.status);

  return (
    <button
      type="button"
      onClick={() => onStatusChange(book, upcoming)}
      aria-label={`Status: ${STATUS_LABELS[book.status]}. Change to ${STATUS_LABELS[upcoming]}`}
      className="mt-[9px] inline-flex items-center gap-1.5 rounded-full py-[3px] pr-[9px] pl-[7px] text-[11.5px] transition-[filter] hover:brightness-[.96]"
      style={{ background: statusTint(book.status), color: STATUS_COLORS[book.status] }}
    >
      <span className="size-[5px] rounded-full bg-current" />
      {STATUS_LABELS[book.status]}
    </button>
  );
}
