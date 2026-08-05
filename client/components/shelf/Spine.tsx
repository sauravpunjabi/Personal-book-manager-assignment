'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { spineFor } from '@/lib/spine';
import { STATUS_LABELS } from '@/lib/bookStatus';
import { surnameOf } from '@/lib/bookCover';
import type { Book } from '@/types/book';

const HOVER_LIFT = -18;
const PULL_DEPTH = 52;
const OPEN_DELAY_MS = 190;

interface SpineProps {
  book: Book;
  isDimmed: boolean;
  isHovered: boolean;
  /** How far this book shuffles aside to make room for the one being hovered */
  shift: number;
  onHover: (id: string | null) => void;
  onOpen: (book: Book) => void;
}

export function Spine({ book, isDimmed, isHovered, shift, onHover, onOpen }: SpineProps) {
  const root = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const shape = spineFor(book);

  // The button's transform belongs to Flip alone. Lean lives on the inner
  // element so nothing here can overwrite a move between shelves mid-flight.
  const slide = useRef<gsap.QuickToFunc | null>(null);
  const lift = useRef<gsap.QuickToFunc | null>(null);
  const turn = useRef<gsap.QuickToFunc | null>(null);
  const hasSettled = useRef(false);

  useEffect(() => {
    if (!root.current || !body.current) {
      return;
    }

    gsap.set(body.current, { rotate: shape.lean });

    slide.current = gsap.quickTo(root.current, 'x', {
      duration: 0.5,
      ease: 'power3.out',
    });
    lift.current = gsap.quickTo(root.current, 'y', {
      duration: 0.45,
      ease: 'power3.out',
    });
    turn.current = gsap.quickTo(body.current, 'rotate', {
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [shape.lean]);

  useEffect(() => {
    // Skipping the first pass matters: on remount these would tween x and y to
    // zero, which cancels the Flip offset and teleports the book into place.
    if (!hasSettled.current) {
      hasSettled.current = true;
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    slide.current?.(shift);
    lift.current?.(isHovered ? HOVER_LIFT : 0);
    turn.current?.(isHovered ? 0 : shape.lean);

    gsap.to(root.current?.querySelector('[data-glow]') ?? [], {
      opacity: isHovered ? 0.5 : 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [shift, isHovered, shape.lean]);

  /** Nudges the book off the shelf, but never makes opening wait on the tween */
  function open() {
    const element = root.current;

    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onOpen(book);
      return;
    }

    gsap
      .timeline()
      .to(element, { z: PULL_DEPTH, y: -30, duration: 0.22, ease: 'back.out(2)' })
      .to(element, { z: 0, y: 0, duration: 0.3, ease: 'power2.inOut' });

    window.setTimeout(() => onOpen(book), OPEN_DELAY_MS);
  }

  return (
    <button
      ref={root}
      type="button"
      data-flip-id={book._id}
      onMouseEnter={() => onHover(book._id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(book._id)}
      onBlur={() => onHover(null)}
      onClick={open}
      aria-label={`${book.title} by ${book.author}. ${STATUS_LABELS[book.status]}. Open`}
      className="relative min-w-[14px] origin-bottom rounded-t-[3px] transition-opacity duration-300 will-change-transform"
      style={{
        width: shape.width,
        height: shape.height,
        opacity: isDimmed ? 0.2 : 1,
        pointerEvents: isDimmed ? 'none' : undefined,
      }}
    >
      <span
        data-glow
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-full opacity-0 blur-2xl"
        style={{ background: shape.palette.bg }}
      />

      <span
        ref={body}
        aria-hidden="true"
        className="relative flex h-full w-full origin-bottom flex-col items-center justify-between overflow-hidden rounded-t-[3px] py-3 shadow-[var(--cover-shadow)]"
        style={{ background: shape.palette.bg, color: shape.palette.fg }}
      >
        <span
          className="h-[3px] w-1/2 flex-none rounded-full"
          style={{ background: shape.palette.accent }}
        />

        <span
          className="font-display max-h-full overflow-hidden text-[12px] leading-none tracking-[0.02em] whitespace-nowrap"
          style={{ writingMode: 'vertical-rl' }}
        >
          {book.title}
        </span>

        <span
          className="text-[7px] tracking-[0.14em] whitespace-nowrap opacity-70"
          style={{ writingMode: 'vertical-rl' }}
        >
          {surnameOf(book.author)}
        </span>
      </span>
    </button>
  );
}
