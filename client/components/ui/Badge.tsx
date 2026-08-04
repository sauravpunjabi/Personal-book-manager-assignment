import { cn } from '@/lib/utils';
import type { BookStatus } from '@/types/book';

type BadgeVariant = BookStatus | 'tag';

const VARIANTS: Record<BadgeVariant, string> = {
  'want-to-read': 'bg-status-want/10 text-status-want',
  reading: 'bg-status-reading/10 text-status-reading',
  completed: 'bg-status-done/10 text-status-done',
  tag: 'bg-line/60 text-muted',
};

interface BadgeProps extends React.ComponentPropsWithRef<'span'> {
  variant: BadgeVariant;
}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
