'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookCover } from '@/components/books/BookCover';
import { useDialogBehaviour } from '@/hooks/useDialogBehaviour';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/bookStatus';
import { BOOK_STATUSES, type Book, type BookStatus } from '@/types/book';

interface BookDrawerProps {
  book: Book | null;
  onClose: () => void;
  onStatusChange: (book: Book, status: BookStatus) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export function BookDrawer({
  book,
  onClose,
  onStatusChange,
  onEdit,
  onDelete,
}: BookDrawerProps) {
  const isOpen = book !== null;
  const panelRef = useDialogBehaviour(isOpen, onClose);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {book && (
        <motion.div
          key="drawer"
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28 }}
        >
          <div className="absolute inset-0 bg-[rgba(28,24,20,.34)]" onClick={onClose} />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 right-0 flex w-full max-w-[456px] flex-col border-l border-line bg-surface shadow-[var(--shadow-3)]"
            initial={reduceMotion ? false : { x: 28 }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: 28 }}
            transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line-soft px-6 py-[18px]">
              <p className="text-[11px] tracking-[0.12em] text-ink-3 uppercase">
                Added{' '}
                {new Date(book.createdAt).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-[30px] items-center justify-center rounded-[9px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pt-7 pb-6">
              <div className="flex items-start gap-5">
                <BookCover book={book} className="w-[124px] flex-none" />
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="font-display text-[25px] leading-[1.18] tracking-[-0.015em] text-pretty"
                  >
                    {book.title}
                  </h2>
                  <p className="mt-2 text-[14px] text-ink-2">{book.author}</p>
                  {book.pages > 0 && (
                    <p className="mt-3.5 text-[12.5px] text-ink-3">{book.pages} pages</p>
                  )}
                  {book.tags.length > 0 && (
                    <ul className="mt-3.5 flex flex-wrap gap-1.5">
                      {book.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] text-ink-2"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <section className="mt-7">
                <h3 className="mb-2.5 text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">
                  Reading status
                </h3>
                <div className="flex gap-1.5 rounded-[12px] bg-surface-2 p-1">
                  {BOOK_STATUSES.map((choice) => {
                    const isActive = book.status === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onStatusChange(book, choice)}
                        className={`flex h-9 flex-1 items-center justify-center gap-[7px] rounded-[9px] text-[12.5px] transition-colors ${
                          isActive
                            ? 'bg-surface font-medium shadow-[var(--shadow-1)]'
                            : 'text-ink-2'
                        }`}
                        style={{ color: isActive ? STATUS_COLORS[choice] : undefined }}
                      >
                        <span
                          className="size-[5px] rounded-full"
                          style={{ background: STATUS_COLORS[choice] }}
                        />
                        {STATUS_LABELS[choice]}
                      </button>
                    );
                  })}
                </div>
              </section>

              {book.status === 'reading' && book.pages > 0 && (
                <Progress current={book.currentPage} total={book.pages} />
              )}

              {book.note && (
                <section className="mt-[26px] rounded-[13px] border border-line-soft bg-[color-mix(in_oklab,var(--color-accent)_6%,var(--color-surface-2))] p-[18px]">
                  <h3 className="text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">
                    My note
                  </h3>
                  <p className="mt-2.5 font-display text-[16.5px] leading-[1.55] text-pretty italic">
                    {book.note}
                  </p>
                </section>
              )}
            </div>

            <footer className="flex gap-2.5 border-t border-line-soft px-6 py-4">
              <button
                type="button"
                onClick={() => onEdit(book)}
                className="h-[42px] flex-1 rounded-[12px] border border-line bg-surface text-[13.5px] font-medium transition-colors hover:bg-surface-2"
              >
                Edit details
              </button>
              <button
                type="button"
                onClick={() => onDelete(book)}
                className="h-[42px] rounded-[12px] px-4 text-[13.5px] text-ink-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent)_10%,var(--color-surface))] hover:text-accent"
              >
                Remove
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const percent = Math.min(Math.round((current / total) * 100), 100);

  return (
    <section className="mt-6">
      <div className="flex justify-between text-[12.5px] text-ink-2">
        <span>
          Page {current} of {total}
        </span>
        <span className="text-ink-3">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        className="mt-2.5 h-1 overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-[600ms] ease-[cubic-bezier(.2,.7,.3,1)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
}
