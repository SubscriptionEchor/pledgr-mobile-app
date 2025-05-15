import { Tabs } from 'expo-router';
import { Home, Compass, Crown, Download, Menu } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type TabParamList = {
  home: undefined;
  explore: undefined;
  membership: undefined;
  downloads: undefined;
  menu: undefined;
};

type TabScreenProps = BottomTabScreenProps<TabParamList>;

export default function MemberTabLayout() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarLabelStyle: {
                    fontFamily: fonts.medium,
                    fontSize: 10,
                    marginBottom: 4,
                },
            }}
            initialRouteName="home"
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }: { color: string }) => <Home size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }: { color: string }) => <Compass size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="downloads"
                options={{
                    title: 'Downloads',
                    tabBarIcon: ({ color }: { color: string }) => <Download size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }: { color: string }) => <Menu size={24} color={color} />
                }}
            />
        </Tabs>
    );
}