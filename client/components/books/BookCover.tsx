import { paletteFor, shapeFor, surnameOf, titleSizeFor } from '@/lib/bookCover';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

type CoverBook = Pick<Book, 'title' | 'author' | 'cover'>;

interface BookCoverProps {
  book: CoverBook;
  /** 'full' prints the title and author; 'thumb' is the bar-only treatment. */
  variant?: 'full' | 'thumb';
  /** Multiplier for type and spacing, for covers smaller than the grid's. */
  scale?: number;
  className?: string;
}

/** Covers are drawn, never fetched, so nothing can leave a hole in the shelf */
export function BookCover({
  book,
  variant = 'full',
  scale = 1,
  className,
}: BookCoverProps) {
  const palette = paletteFor(book.cover);
  const shape = shapeFor(book.title, book.author);
  const isFull = variant === 'full';

  const barWidth = shape.barWidth.endsWith('%')
    ? shape.barWidth
    : `${parseFloat(shape.barWidth) * scale}px`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex aspect-2/3 flex-col overflow-hidden',
        isFull
          ? 'rounded-[10px] shadow-[var(--cover-shadow)]'
          : 'justify-end rounded-[5px] p-1.5 shadow-[var(--shadow-1)]',
        className
      )}
      style={{
        background: palette.bg,
        color: palette.fg,
        justifyContent: isFull ? shape.justify : undefined,
        padding: isFull ? `${20 * scale}px ${17 * scale}px` : undefined,
      }}
    >
      <div
        className="flex-none"
        style={{
          width: isFull ? barWidth : '60%',
          height: isFull ? shape.barHeight * scale : 3,
          borderRadius: isFull ? shape.barRadius : '2px',
          background: palette.accent,
          marginBottom: isFull ? 16 * scale : 0,
        }}
      />

      {isFull && (
        <>
          <p
            className="line-clamp-5 font-display leading-[1.05] tracking-[-0.015em] text-balance"
            style={{ fontSize: titleSizeFor(book.title) * scale }}
          >
            {book.title}
          </p>
          <p
            className="truncate tracking-[0.16em] uppercase opacity-70"
            style={{ fontSize: 9.5 * scale, marginTop: 10 * scale }}
          >
            {surnameOf(book.author)}
          </p>
        </>
      )}
    </div>
  );
}
