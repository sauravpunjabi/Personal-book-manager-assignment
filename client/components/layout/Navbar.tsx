'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import * as authService from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      // The cookie may survive, but keeping someone stuck in the app because
      // the network blipped is worse. Clear locally either way.
      console.error(error);
    } finally {
      clearSession();
      router.replace('/');
    }
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-3">
      <span className="font-display text-base font-semibold md:hidden">Bookmark</span>

      <div className="ml-auto flex items-center gap-3">
        {user && <span className="hidden text-sm text-muted sm:inline">{user.name}</span>}
        <Button variant="ghost" size="sm" isLoading={isLoggingOut} onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
