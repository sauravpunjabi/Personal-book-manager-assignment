import { paletteFor, type CoverPalette } from '@/lib/bookCover';
import type { Book } from '@/types/book';

const MIN_WIDTH = 26;
const MAX_WIDTH = 62;
const PAGES_PER_PIXEL = 14;
const DEFAULT_PAGES = 280;

const MIN_HEIGHT = 156;
const MAX_HEIGHT = 232;

export interface SpineShape {
  width: number;
  height: number;
  palette: CoverPalette;
  /** A degree or two off vertical, so a shelf never looks machine-stacked */
  lean: number;
}

function hash(text: string): number {
  let value = 0;
  for (let index = 0; index < text.length; index += 1) {
    value = (value * 31 + text.charCodeAt(index)) >>> 0;
  }
  return value;
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(Math.max(value, low), high);
}

/** Thickness comes from the page count, so a long book is visibly a long book */
export function spineFor(book: Book): SpineShape {
  const pages = book.pages > 0 ? book.pages : DEFAULT_PAGES;
  const seed = hash(`${book.title}|${book.author}`);

  return {
    width: Math.round(clamp(MIN_WIDTH + pages / PAGES_PER_PIXEL, MIN_WIDTH, MAX_WIDTH)),
    height: MIN_HEIGHT + (seed % (MAX_HEIGHT - MIN_HEIGHT)),
    palette: paletteFor(book.cover),
    lean: ((seed >> 8) % 5) - 2,
  };
}
