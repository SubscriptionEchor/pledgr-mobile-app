import { Tabs } from 'expo-router';
import { Chrome as Home, Library, Wallet, MessageSquare, Menu } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function CreatorTabLayout() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
                fontFamily: fonts.medium,
                fontSize: fontSize.xs,
                marginBottom: 4,
            },
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color }) => <Library size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="payout"
                options={{
                    title: 'Payout',
                    tabBarIcon: ({ color }) => <Wallet size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }) => <Menu size={24} color={color} />
                }}
            />
        </Tabs>
    );
}