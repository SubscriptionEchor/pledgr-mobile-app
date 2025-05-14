import { Tabs } from 'expo-router';
import { Home, Compass, Crown, MessageCircle, Menu } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type TabParamList = {
  home: undefined;
  explore: undefined;
  membership: undefined;
  chat: undefined;
  menu: undefined;
};

type TabScreenProps = BottomTabScreenProps<TabParamList>;

export default function MemberTabLayout() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <Tabs<TabParamList>
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
                name="membership"
                options={{
                    title: 'Membership',
                    tabBarIcon: ({ color }: { color: string }) => <Crown size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color }: { color: string }) => <MessageCircle size={24} color={color} />
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