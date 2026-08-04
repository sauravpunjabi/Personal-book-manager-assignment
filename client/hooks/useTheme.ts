'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'chapter-theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function storedChoice(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

/** System preference by default; an explicit toggle overrides it and is kept */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  // Until someone picks a side, follow the system if it changes mid-session.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);

    function followSystem(event: MediaQueryListEvent) {
      if (storedChoice()) {
        return;
      }

      const next: Theme = event.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setTheme(next);
    }

    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Private browsing can refuse storage; the toggle still works for this visit
      }

      return next;
    });
  }, []);

  return { theme, toggle };
}
