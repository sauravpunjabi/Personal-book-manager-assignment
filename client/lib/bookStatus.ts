import { BOOK_STATUSES, type BookStatus } from '@/types/book';

export const STATUS_LABELS: Record<BookStatus, string> = {
  'want-to-read': 'Want to read',
  reading: 'Reading',
  completed: 'Completed',
};

/** Order matters here — this is the loop the card's status badge walks through. */
export function nextStatus(current: BookStatus): BookStatus {
  const index = BOOK_STATUSES.indexOf(current);
  return BOOK_STATUSES[(index + 1) % BOOK_STATUSES.length];
}
