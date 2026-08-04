import { paletteFor, shapeFor, surnameOf } from '@/lib/bookCover';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

type CoverBook = Pick<Book, 'title' | 'author' | 'cover'>;

interface BookCoverProps {
  book: CoverBook;
  /** 'full' prints the title and author; 'thumb' is the bar-only treatment. */
  variant?: 'full' | 'thumb';
  className?: string;
}

/**
 * Covers are drawn, never fetched. Colour comes from the book, shape from its
 * title, so every spine is stable and no network request can leave a hole in
 * the shelf.
 */
export function BookCover({ book, variant = 'full', className }: BookCoverProps) {
  const palette = paletteFor(book.cover);
  const shape = shapeFor(book.title, book.author);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex aspect-2/3 flex-col overflow-hidden shadow-[var(--cover-shadow)]',
        variant === 'full'
          ? 'rounded-[10px] px-4 py-[18px]'
          : 'justify-end rounded-[5px] p-1.5',
        className
      )}
      style={{
        background: palette.bg,
        color: palette.fg,
        justifyContent: variant === 'full' ? shape.justify : undefined,
      }}
    >
      <div
        className="flex-none"
        style={{
          width: variant === 'full' ? shape.barWidth : '60%',
          height: variant === 'full' ? shape.barHeight : '3px',
          borderRadius: variant === 'full' ? shape.barRadius : '2px',
          background: palette.accent,
          marginBottom: variant === 'full' ? 16 : 0,
        }}
      />

      {variant === 'full' && (
        <>
          <p
            className="font-display leading-[1.1] tracking-[-0.012em]"
            style={{ fontSize: shape.titleSize }}
          >
            {book.title}
          </p>
          <p className="mt-2.5 text-[9px] tracking-[0.16em] uppercase opacity-70">
            {surnameOf(book.author)}
          </p>
        </>
      )}
    </div>
  );
}
