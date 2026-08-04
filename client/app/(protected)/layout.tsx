import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

// The library screen owns its own sidebar and header, matching the design's
// single-screen app, so this layout only guards the route.
export default function ProtectedAreaLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
