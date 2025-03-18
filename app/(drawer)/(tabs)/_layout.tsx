import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Footer } from '@/components/Footer';
import { View } from 'react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="membership" />
        <Tabs.Screen name="chat" />
      </Tabs>
      <Footer />
    </View>
  );
}