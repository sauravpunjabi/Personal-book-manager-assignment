'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Spine } from '@/components/shelf/Spine';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/bookStatus';
import { BOOK_STATUSES, type Book, type BookStatus } from '@/types/book';

interface BookshelfProps {
  books: Book[];
  /** Books that fall outside the current search or tag, greyed but still shelved */
  dimmedIds: Set<string>;
  onOpen: (book: Book) => void;
  onAdd: () => void;
}

export function Bookshelf({ books, dimmedIds, onOpen, onAdd }: BookshelfProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-shelf-row]', {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.12,
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="space-y-10">
      {BOOK_STATUSES.map((status) => (
        <ShelfRow
          key={status}
          status={status}
          books={shelveOrder(books.filter((book) => book.status === status))}
          dimmedIds={dimmedIds}
          onOpen={onOpen}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}

function ShelfRow({
  status,
  books,
  dimmedIds,
  onOpen,
  onAdd,
}: {
  status: BookStatus;
  books: Book[];
  dimmedIds: Set<string>;
  onOpen: (book: Book) => void;
  onAdd: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredIndex = books.findIndex((book) => book._id === hoveredId);

  return (
    <section data-shelf-row>
      <div className="mb-2 flex items-baseline gap-2.5 px-1">
        <span
          className="size-[7px] rounded-full"
          style={{ background: STATUS_COLORS[status] }}
        />
        <h2 className="font-display text-[17px] tracking-[-0.01em]">
          {STATUS_LABELS[status]}
        </h2>
        <span className="text-[12px] text-ink-3 tabular-nums">{books.length}</span>
      </div>

      {/* perspective on the wrapper is what lets a spine pull toward the viewer */}
      <div className="[perspective:900px]">
        {/* No overflow clipping here: a book travelling between shelves has to
            be able to leave this box, or it disappears mid-flight */}
        <div
          onMouseLeave={() => setHoveredId(null)}
          className="flex min-h-[236px] items-end gap-[3px] px-1 pb-1 [transform-style:preserve-3d]"
        >
          {books.length === 0 ? (
            <EmptyShelf status={status} onAdd={onAdd} />
          ) : (
            books.map((book, index) => (
              <Spine
                key={book._id}
                book={book}
                isDimmed={dimmedIds.has(book._id)}
                isHovered={hoveredId === book._id}
                shift={shiftFor(index, hoveredIndex)}
                onHover={setHoveredId}
                onOpen={onOpen}
              />
            ))
          )}
        </div>
      </div>

      <div className="h-[6px] w-full rounded-[2px] bg-[color-mix(in_oklab,var(--color-ink)_16%,transparent)] shadow-[var(--shadow-1)]" />
    </section>
  );
}

/** Oldest first, so a book you just moved slots in at the right-hand end */
function shelveOrder(books: Book[]): Book[] {
  return [...books].sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt));
}

const NEAR_SHIFT = 8;
const FAR_SHIFT = 3;

/** Books lean away from whichever one you are reaching for, nearest moving most */
function shiftFor(index: number, hoveredIndex: number): number {
  if (hoveredIndex < 0 || index === hoveredIndex) {
    return 0;
  }

  const distance = Math.abs(index - hoveredIndex);
  const direction = index < hoveredIndex ? -1 : 1;

  if (distance === 1) {
    return direction * NEAR_SHIFT;
  }
  return distance === 2 ? direction * FAR_SHIFT : 0;
}

function EmptyShelf({ status, onAdd }: { status: BookStatus; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="mb-1 flex h-[150px] w-[104px] flex-none flex-col items-center justify-center gap-2 rounded-t-[3px] border border-dashed border-line text-[11px] text-ink-3 transition-colors hover:border-ink-3 hover:text-ink-2"
    >
      <span className="text-[18px] leading-none">+</span>
      Nothing {STATUS_LABELS[status].toLowerCase()}
    </button>
  );
}
