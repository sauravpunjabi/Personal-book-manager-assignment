import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

// The library screen brings its own chrome, so this layout only guards the route
export default function ProtectedAreaLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
