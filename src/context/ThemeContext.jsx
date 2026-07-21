'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
  mounted: false
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Sync state from localStorage after initial hydration
  useEffect(() => {
    const saved = localStorage.getItem('scholarcms_theme');
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
      localStorage.setItem('scholarcms_theme', 'dark');
    }
    setMounted(true);
  }, []);

  // Sync class & storage whenever isDark changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('scholarcms_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('scholarcms_theme', 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const root = document.documentElement;
    if (nextDark) {
      root.classList.add('dark');
      localStorage.setItem('scholarcms_theme', 'dark');
    } else {
      root.classList.remove('dark');
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

