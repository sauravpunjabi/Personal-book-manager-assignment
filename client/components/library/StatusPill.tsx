'use client';

import { STATUS_COLORS, STATUS_LABELS, nextStatus, statusTint } from '@/lib/bookStatus';
import type { Book, BookStatus } from '@/types/book';

/** The pill doubles as the control: the label says where the next click lands */
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
      className="inline-flex w-fit items-center gap-1.5 rounded-full py-[3px] pr-[9px] pl-[7px] text-[11.5px] transition-[filter] hover:brightness-[.96]"
      style={{ background: statusTint(book.status), color: STATUS_COLORS[book.status] }}
    >
      <span className="size-[5px] rounded-full bg-current" />
      {STATUS_LABELS[book.status]}
    </button>
  );
}
