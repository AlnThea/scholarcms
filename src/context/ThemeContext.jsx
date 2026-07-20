'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('scholarcms_theme');
    return saved === 'dark';
  });
  const [mounted, setMounted] = useState(false);

  // Ensure class and localStorage stay in sync whenever isDark changes
  // Sync class & storage whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('scholarcms_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('scholarcms_theme', 'light');
    }
  }, [isDark]);

  // On first mount, ensure a theme value exists in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('scholarcms_theme');
    if (!saved) {
      const defaultTheme = isDark ? 'dark' : 'light';
      localStorage.setItem('scholarcms_theme', defaultTheme);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('scholarcms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('scholarcms_theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
