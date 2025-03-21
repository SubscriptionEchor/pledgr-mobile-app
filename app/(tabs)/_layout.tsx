import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Footer } from '@/components/Footer';
import { Platform, View } from 'react-native';
import { usePathname } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';

export default function TabLayout() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const { user } = useAuth();

  const isCreator = user?.role === UserRole.CREATOR;

  // Only show footer on main tab screens
  const showFooter = pathname === '/' || 
                    pathname === '/explore' || 
                    pathname === '/membership' || 
                    pathname === '/chat' || 
                    pathname === '/menu' ||
                    pathname === '/library' ||
                    pathname === '/payouts';

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}>
        <Tabs.Screen 
          name="index"
          options={{
            href: '/',
          }}
        />
        {isCreator ? (
          <>
            <Tabs.Screen 
              name="library"
              options={{
                href: '/library',
              }}
            />
            <Tabs.Screen 
              name="payouts"
              options={{
                href: '/payouts',
              }}
            />
          </>
        ) : (
          <>
            <Tabs.Screen 
              name="explore"
              options={{
                href: '/explore',
              }}
            />
            <Tabs.Screen 
              name="membership"
              options={{
                href: '/membership',
              }}
            />
          </>
        )}
        <Tabs.Screen 
          name="chat"
          options={{
            href: '/chat',
          }}
        />
        <Tabs.Screen 
          name="menu"
          options={{
            href: '/menu',
          }}
        />
        <Tabs.Screen 
          name="creator"
          options={{
            href: null,
          }}
        />
      </Tabs>
      {showFooter && <Footer />}
    </View>
  );
}