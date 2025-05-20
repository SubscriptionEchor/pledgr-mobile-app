import { Stack } from 'expo-router';

export default function CreatorScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="CreateCollectionScreen" 
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="TierDetailsScreen" 
        options={{
          animation: 'slide_from_right',
        }} 
      />
      {/* Add other screens here as needed */}
    </Stack>
  );
} 