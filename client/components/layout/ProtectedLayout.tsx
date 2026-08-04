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

  // Showing the shell rather than a spinner means the session check and the
  // book fetch read as one continuous load instead of two separate flashes.
  if (isLoading) {
    return <LibraryShellSkeleton />;
  }

  // Nothing renders during the redirect — showing the page first would leak a
  // flash of someone else's library.
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
