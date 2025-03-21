import { Stack } from 'expo-router';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { UserRole } from '@/lib/enums';

export default function CreatorLayout() {
  return (
    <RoleProtectedRoute allowedRoles={[UserRole.MEMBER]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-page" />
      </Stack>
    </RoleProtectedRoute>
  );
}