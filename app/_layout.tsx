import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/lib/theme';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import { ToastMessage } from '@/components/Toast';
import { BottomSheetProvider } from '@/lib/context/BottomSheetContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { ProfileSheetProvider } from '@/lib/context/ProfileSheetContext';

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
          <ProfileSheetProvider>
            <StatusBarComponent />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            </Stack>
            <ToastMessage />
          </ProfileSheetProvider>
        </BottomSheetProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}