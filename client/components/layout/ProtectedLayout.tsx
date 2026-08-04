'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LibraryShellSkeleton } from '@/components/library/LibraryShellSkeleton';
import { useAuthStore } from '@/store/auth.store';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // The shell rather than a spinner, so the load reads as one step instead of two
  if (isLoading) {
    return <LibraryShellSkeleton />;
  }

  // Nothing renders mid-redirect, or we would flash someone else's library
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
