import React, { createContext, useState, useCallback } from 'react';
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { SplashScreen } from 'expo-router';

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

interface FontFamily {
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
}

interface FontSize {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

interface ThemeContextType {
  colors: ThemeColors;
  shadows: Shadow;
  fonts: FontFamily;
  fontSize: FontSize;
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
  info: '#0ea5e9',
  buttonText: '#ffffff',
};

const darkColors: ThemeColors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',
  secondary: '#a855f7',
  background: '#0f1011',
  surface: '#18191a',
  surfaceHover: '#242526',
  border: '#2f3336',
  textPrimary: '#fcfcfc',
  textSecondary: '#a1a1aa',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
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

const fonts: FontFamily = {
  light: 'Outfit-Light',
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semibold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
};

const fontSize: FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Light': Outfit_300Light,
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
  });

  // Prevent splash screen from auto-hiding
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Return null while fonts are loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  const value = {
    colors: isDark ? darkColors : lightColors,
    shadows: isDark ? darkShadows : lightShadows,
    fonts,
    fontSize,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}