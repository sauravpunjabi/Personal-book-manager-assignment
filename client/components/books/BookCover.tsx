'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

// Flat washes only — enough to tell one spine from another on a shelf.
const SPINE_TINTS = [
  'bg-status-want/15',
  'bg-status-reading/15',
  'bg-status-done/15',
  'bg-line',
];

/** Same title always gets the same colour, so a shelf stays put between loads. */
function tintFor(title: string): string {
  let hash = 0;
  for (let index = 0; index < title.length; index += 1) {
    hash = (hash * 31 + title.charCodeAt(index)) >>> 0;
  }
  return SPINE_TINTS[hash % SPINE_TINTS.length];
}

const COVER_HOST = 'covers.openlibrary.org';

/**
 * next/image throws while rendering if the host is not in next.config's
 * remotePatterns, which takes the whole page down and never reaches onError.
 * Checking first means an unexpected URL degrades to the drawn cover instead.
 */
function isRenderable(coverUrl: string): boolean {
  try {
    const { protocol, hostname } = new URL(coverUrl);
    return protocol === 'https:' && hostname === COVER_HOST;
  } catch {
    return false;
  }
}

interface BookCoverProps {
  book: Pick<Book, 'title' | 'author' | 'coverUrl'>;
  sizes: string;
  className?: string;
}

export function BookCover({ book, sizes, className }: BookCoverProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const showArtwork = isRenderable(book.coverUrl) && !hasFailed;

  return (
    <div
      className={cn(
        'relative aspect-2/3 overflow-hidden rounded border border-line',
        !showArtwork && tintFor(book.title),
        className
      )}
    >
      {showArtwork ? (
        // Decorative: the title and author sit next to it in real text, so
        // announcing the cover as well would just repeat them.
        <Image
          src={book.coverUrl}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setHasFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col justify-between gap-1 p-2">
          <p className="font-display text-[11px] leading-tight font-semibold line-clamp-4">
            {book.title}
          </p>
          <p className="text-[9px] leading-tight text-muted line-clamp-2">
            {book.author}
          </p>
        </div>
      )}
    </div>
  );
}
