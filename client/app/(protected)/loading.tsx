import { LibraryShellSkeleton } from '@/components/library/LibraryShellSkeleton';

// Streamed while the route loads, so a slow connection still sees the layout
export default function Loading() {
  return <LibraryShellSkeleton />;
}
