import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/lib/theme';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import { ToastMessage } from '@/components/Toast';
import { BottomSheetProvider } from '@/lib/context/BottomSheetContext';
import { AuthProvider } from '@/lib/context/AuthContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ThemeProvider>
        <BottomSheetProvider>
          <StatusBarComponent />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
          <ToastMessage />
        </BottomSheetProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}