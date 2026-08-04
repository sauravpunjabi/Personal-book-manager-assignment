import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

export default function ProtectedAreaLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
