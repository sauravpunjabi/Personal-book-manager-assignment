import { Skeleton } from '@/components/ui/Skeleton';

export function SkeletonCard() {
  return (
    <div className="space-y-4 rounded-lg border border-line bg-surface p-5">
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
}
