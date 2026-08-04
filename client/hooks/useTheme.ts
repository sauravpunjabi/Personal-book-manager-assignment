'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'bookmark-theme';

/**
 * The inline script in the root layout applies the stored theme before paint,
 * so this hook only has to read back what is already on the element. Starting
 * from 'light' and correcting on mount keeps the server and client markup
 * identical during hydration.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Private browsing can refuse storage. The toggle still works for the
        // current visit, it just will not be remembered.
      }

      return next;
    });
  }, []);

  return { theme, toggle };
}
