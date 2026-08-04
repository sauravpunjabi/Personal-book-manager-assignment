import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  variant: 'no-books' | 'no-results';
  onAction: () => void;
}

const COPY = {
  'no-books': {
    title: 'Your shelf is empty.',
    body: 'Add the first book and it will show up here.',
    action: 'Add a book',
  },
  'no-results': {
    title: 'Nothing matches those filters.',
    body: 'Try loosening them, or clear them to see everything again.',
    action: 'Clear filters',
  },
} as const;

export function EmptyState({ variant, onAction }: EmptyStateProps) {
  const { title, body, action } = COPY[variant];

  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <ShelfMark />
      <h2 className="mt-6 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-muted">{body}</p>
      <Button variant="secondary" className="mt-6" onClick={onAction}>
        {action}
      </Button>
    </div>
  );
}

/** Three books leaning on a shelf, one of them fallen over. */
function ShelfMark() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden="true">
      <g stroke="currentColor" className="text-line" strokeWidth="2">
        <rect x="12" y="10" width="11" height="34" rx="1.5" />
        <rect x="26" y="16" width="11" height="28" rx="1.5" />
        <path d="M41 44v-11h20v11z" />
        <path d="M6 44h60" strokeLinecap="round" />
      </g>
    </svg>
  );
}
