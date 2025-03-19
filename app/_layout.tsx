import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/lib/theme';
import { StatusBarComponent } from '@/components/StatusBarComponent';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <StatusBarComponent />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
    </ThemeProvider>
  );
}