import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Footer } from '@/components/Footer';
import { Platform, View } from 'react-native';
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const { colors } = useTheme();
  const pathname = usePathname();

  // Only show footer on main tab screens
  const showFooter = pathname === '/' || 
                    pathname === '/explore' || 
                    pathname === '/membership' || 
                    pathname === '/chat' || 
                    pathname === '/menu';

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="membership" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="menu" />
      </Tabs>
      {showFooter && <Footer />}
    </View>
  );
}