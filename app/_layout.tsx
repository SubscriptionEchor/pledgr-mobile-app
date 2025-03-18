import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Redirect } from 'expo-router';
import { ThemeProvider } from '@/lib/theme';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <Redirect href="/(drawer)/(tabs)/home" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}