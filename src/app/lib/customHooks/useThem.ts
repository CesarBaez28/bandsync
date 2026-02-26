'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem('theme') as Theme | null;
    const systemDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = stored ?? (systemDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  if (!mounted) {
    return { theme: 'light' as Theme, toggleTheme: () => {} };
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  return { theme, toggleTheme };
}