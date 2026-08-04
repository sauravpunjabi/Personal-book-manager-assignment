import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { STATUS_LABELS } from '@/lib/bookStatus';
import type { Book } from '@/types/book';

interface ReadingSectionProps {
  title: string;
  books: Book[];
  emptyMessage: string;
}

export function ReadingSection({ title, books, emptyMessage }: ReadingSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold">{title}</h2>

      {books.length === 0 ? (
        <p className="text-sm text-muted">{emptyMessage}</p>
      ) : (
        <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
          {books.map((book) => (
            <li key={book._id} className="w-56 shrink-0 snap-start">
              <Link
                href="/books"
                className="flex h-full flex-col gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-muted/50"
              >
                <div className="space-y-1">
                  <p className="font-display leading-snug font-semibold text-balance">
                    {book.title}
                  </p>
                  <p className="text-sm text-muted">{book.author}</p>
                </div>
                <Badge variant={book.status} className="mt-auto self-start">
                  {STATUS_LABELS[book.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
