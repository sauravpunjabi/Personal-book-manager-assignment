'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { STATUS_LABELS, nextStatus } from '@/lib/bookStatus';
import type { Book, BookStatus } from '@/types/book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onStatusChange: (book: Book, status: BookStatus) => void;
}

export function BookCard({ book, onEdit, onDelete, onStatusChange }: BookCardProps) {
  const reduceMotion = useReducedMotion();
  const upcoming = nextStatus(book.status);

  return (
    <motion.li
      layout={!reduceMotion}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5"
    >
      <div className="space-y-1">
        <h3 className="font-display text-lg leading-snug font-semibold text-balance">
          {book.title}
        </h3>
        <p className="text-sm text-muted">{book.author}</p>
      </div>

      {book.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="tag">{tag}</Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        {/* The badge doubles as the control for advancing status. The label
            spells out where the next tap lands so it is not a guessing game. */}
        <button
          type="button"
          onClick={() => onStatusChange(book, upcoming)}
          aria-label={`Status: ${STATUS_LABELS[book.status]}. Change to ${STATUS_LABELS[upcoming]}`}
          className="rounded-full transition-opacity hover:opacity-70"
        >
          <Badge variant={book.status}>{STATUS_LABELS[book.status]}</Badge>
        </button>

        <div className="flex items-center gap-1">
          <IconButton label={`Edit ${book.title}`} onClick={() => onEdit(book)}>
            <PencilIcon />
          </IconButton>
          <IconButton label={`Delete ${book.title}`} onClick={() => onDelete(book)}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    </motion.li>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-md text-muted transition-colors hover:bg-paper hover:text-ink"
    >
      {children}
    </button>
  );
}

function PencilIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11.5 2.5a1.77 1.77 0 0 1 2.5 2.5L5.5 13.5 2 14l.5-3.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 4h11M6 4V2.5h4V4M4 4l.6 9.5h6.8L12 4M6.5 7v4M9.5 7v4" />
    </svg>
  );
}
