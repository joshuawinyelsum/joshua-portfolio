import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setThemePreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system';
    try {
      const storedPref = localStorage.getItem('theme-preference') as ThemePreference | null;
      if (storedPref === 'light' || storedPref === 'dark' || storedPref === 'system') {
        return storedPref;
      }
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      return 'system';
    } catch {
      return 'system';
    }
  });

  const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setThemeState] = useState<Theme>(() => {
    if (preference === 'system') {
      return getSystemTheme();
    }
    return preference;
  });

  // Apply class to <html> and sync persistence
  const applyThemeClass = (effectiveTheme: Theme, currentPref: ThemePreference) => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme-preference', currentPref);
      if (currentPref === 'system') {
        localStorage.removeItem('theme');
      } else {
        localStorage.setItem('theme', effectiveTheme);
      }
    } catch {}
  };

  useEffect(() => {
    applyThemeClass(theme, preference);
  }, [theme, preference]);

  // Listen to OS media changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (preference === 'system') {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  const setThemePreference = (newPref: ThemePreference) => {
    setPreference(newPref);
    if (newPref === 'system') {
      setThemeState(getSystemTheme());
    } else {
      setThemeState(newPref);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemePreference(newTheme);
  };

  const toggleTheme = () => {
    setThemePreference(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themePreference: preference,
        isDark,
        toggleTheme,
        setTheme,
        setThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
