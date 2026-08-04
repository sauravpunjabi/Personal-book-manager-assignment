'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { STATUS_LABELS } from '@/lib/bookStatus';
import { cn } from '@/lib/utils';
import { useFilterStore, type StatusFilter } from '@/store/filter.store';
import { BOOK_STATUSES } from '@/types/book';

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  ...BOOK_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
];

export function FilterPanel({ availableTags }: { availableTags: string[] }) {
  const reduceMotion = useReducedMotion();
  const status = useFilterStore((state) => state.status);
  const tags = useFilterStore((state) => state.tags);
  const setStatus = useFilterStore((state) => state.setStatus);
  const toggleTag = useFilterStore((state) => state.toggleTag);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const isFiltered = status !== 'all' || tags.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={status === option.value}
              onClick={() => setStatus(option.value)}
              className={cn(
                'h-9 rounded-md px-3 text-sm font-medium transition-colors',
                status === option.value
                  ? 'bg-ink text-paper'
                  : 'text-muted hover:bg-line/50 hover:text-ink'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto text-sm text-muted underline underline-offset-4 hover:text-ink"
          >
            Clear filters
          </button>
        )}
      </div>

      {availableTags.length > 0 && (
        <div role="group" aria-label="Filter by tag" className="flex flex-wrap gap-1.5">
          <AnimatePresence initial={false}>
            {availableTags.map((tag) => (
              <motion.button
                key={tag}
                type="button"
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: reduceMotion ? 0 : 0.15 }}
                aria-pressed={tags.includes(tag)}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  tags.includes(tag)
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line text-muted hover:border-muted hover:text-ink'
                )}
              >
                {tag}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
