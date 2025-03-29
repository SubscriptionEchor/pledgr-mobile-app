import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const { user } = useAuth();

  // If no user, show the (auth) layout group
  if (!user || !user.role) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    );
  }

  // If the user is a member, show the (member) layout group
  if (user.role === UserRole.MEMBER) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="member" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    );
  }

  // If the user is a creator, show the (creator) layout group
  if (user.role === UserRole.CREATOR) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="creator" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    );
  }

  // If the user is a creator, show the (creator) layout group
  if (user.role === UserRole.CREATOR_ASSOCIATE) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="creator-associate" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    );
  }

  // Default or fallback
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}