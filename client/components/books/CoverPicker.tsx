'use client';

import { BookCover } from '@/components/books/BookCover';
import { COVERS } from '@/lib/bookCover';

interface CoverPickerProps {
  title: string;
  author: string;
  cover: number;
  onChange: (cover: number) => void;
}

/** Live preview and swatches; the server picks a colour if nobody chooses one */
export function CoverPicker({ title, author, cover, onChange }: CoverPickerProps) {
  return (
    <div className="flex-none">
      <p className="mb-2.5 text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">Cover</p>

      <BookCover
        book={{ title: title.trim() || 'Untitled', author, cover }}
        scale={0.58}
        className="w-[104px] transition-[background] duration-300"
      />

      <div
        role="radiogroup"
        aria-label="Cover colour"
        className="mt-3 flex w-[104px] flex-wrap gap-1.5"
      >
        {COVERS.map((palette, index) => (
          <button
            key={palette.bg}
            type="button"
            role="radio"
            aria-checked={cover === index}
            aria-label={`Cover colour ${index + 1}`}
            onClick={() => onChange(index)}
            className="size-5 rounded-[6px] transition-transform hover:scale-110"
            style={{
              background: palette.bg,
              boxShadow:
                cover === index
                  ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${palette.bg}`
                  : 'none',
            }}
          />
        ))}
      </div>

      <p className="mt-2.5 w-[104px] text-[11px] leading-[1.5] text-ink-3">
        Optional — we&rsquo;ll set a spine colour for you.
      </p>
    </div>
  );
}
