import React, { createContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { SplashScreen } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';

const BRAND_COLOR_KEY = '@brand_color';

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
  updateBrandColor: (color: string) => Promise<void>;
}

const DEFAULT_PRIMARY_COLOR = '#1e88e5';

const getBaseColors = (isDark: boolean, primaryColor: string = DEFAULT_PRIMARY_COLOR): ThemeColors => ({
  primary: primaryColor,
  primaryHover: isDark ? '#2563eb' : '#1976d2',
  primaryLight: isDark ? '#60a5fa' : '#bbdefb',
  primaryDark: isDark ? '#1d4ed8' : '#1565c0',
  secondary: isDark ? '#a855f7' : '#9c27b0',
  background: isDark ? '#0f1011' : '#ffffff',
  surface: isDark ? '#18191a' : '#f0f4f3',
  surfaceHover: isDark ? '#242526' : '#e8eceb',
  border: isDark ? '#2f3336' : '#e3e6ea',
  textPrimary: isDark ? '#fcfcfc' : '#131313',
  textSecondary: isDark ? '#a1a1aa' : '#6b7b8a',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: isDark ? '#3b82f6' : '#0ea5e9',
  buttonText: '#ffffff',
});

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
  const [brandColor, setBrandColor] = useState(DEFAULT_PRIMARY_COLOR);
  const { user } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Light': Outfit_300Light,
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
  });

  useEffect(() => {
    const loadBrandColor = async () => {
      try {
        if (user?.role === UserRole.CREATOR) {
          const savedColor = await AsyncStorage.getItem(BRAND_COLOR_KEY);
          if (savedColor) {
            setBrandColor(savedColor);
          }
        } else {
          setBrandColor(DEFAULT_PRIMARY_COLOR);
        }
      } catch (error) {
        console.error('Error loading brand color:', error);
      }
    };

    loadBrandColor();
  }, [user?.role]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const updateBrandColor = async (color: string) => {
    if (user?.role === UserRole.CREATOR) {
      try {
        await AsyncStorage.setItem(BRAND_COLOR_KEY, color);
        setBrandColor(color);
      } catch (error) {
        console.error('Error saving brand color:', error);
      }
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const colors = getBaseColors(isDark, brandColor);

  const value = {
    colors,
    shadows: isDark ? darkShadows : lightShadows,
    fonts,
    fontSize,
    isDark,
    toggleTheme,
    updateBrandColor,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}