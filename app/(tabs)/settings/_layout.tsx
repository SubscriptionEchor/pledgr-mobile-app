import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function SettingsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="profile" />
      </Stack>
    </View>
  );
}