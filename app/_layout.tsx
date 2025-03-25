import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/lib/theme';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import { ToastMessage } from '@/components/Toast';
import { BottomSheetProvider } from '@/lib/context/BottomSheetContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Hide splash screen after resources are loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <BottomSheetProvider>
          <StatusBarComponent />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
          <ToastMessage />
        </BottomSheetProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}