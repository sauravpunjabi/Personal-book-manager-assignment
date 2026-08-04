import { LibraryShellSkeleton } from '@/components/library/LibraryShellSkeleton';

// Streamed by Next while the route segment loads, so a slow connection sees
// the layout immediately instead of a blank page.
export default function Loading() {
  return <LibraryShellSkeleton />;
}
