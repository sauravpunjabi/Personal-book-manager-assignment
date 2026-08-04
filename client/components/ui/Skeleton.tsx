import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded bg-line/70 motion-safe:animate-pulse', className)}
    />
  );
}
