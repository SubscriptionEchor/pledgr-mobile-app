import React, { createContext, useState, useCallback } from 'react';

interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  buttonText: string;
}

interface Shadow {
  sm: string;
  md: string;
  lg: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  shadows: Shadow;
  isDark: boolean;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  primary: '#1e88e5',
  primaryHover: '#1976d2',
  primaryLight: '#bbdefb',
  primaryDark: '#1565c0',
  secondary: '#9c27b0',
  background: '#ffffff',
  surface: '#f0f4f3',
  surfaceHover: '#e8eceb',
  border: '#e3e6ea',
  textPrimary: '#131313',
  textSecondary: '#6b7b8a',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
  buttonText: '#ffffff',
};

const darkColors: ThemeColors = {
  primary: '#60a5fa',
  primaryHover: '#3b82f6',
  primaryLight: '#1e3a8a',
  primaryDark: '#93c5fd',
  secondary: '#d946ef',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceHover: '#293548',
  border: '#334155',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  error: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',
  info: '#60a5fa',
  buttonText: '#ffffff',
};

const lightShadows: Shadow = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

const darkShadows: Shadow = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = {
    colors: isDark ? darkColors : lightColors,
    shadows: isDark ? darkShadows : lightShadows,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}