import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/lib/theme';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import { ToastMessage } from '@/components/Toast';
import { BottomSheetProvider } from '@/lib/context/BottomSheetContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
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
  );
}