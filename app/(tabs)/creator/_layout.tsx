import { Tabs } from 'expo-router';
import { Home, Library, Wallet, Menu } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { View } from 'react-native';

export default function CreatorTabLayout() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
                height: 60,
                paddingBottom: 8,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
                fontFamily: fonts.medium,
                fontSize: 10,
                marginTop: 4,
            },
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'My Page',
                    tabBarIcon: ({ color }) => (
                        <View style={{ padding: 10 }}>
                            <Home size={22} color={color} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color }) => (
                        <View style={{ padding: 10 }}>
                            <Library size={22} color={color} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="payout"
                options={{
                    title: 'Payout',
                    tabBarIcon: ({ color }) => (
                        <View style={{ padding: 10 }}>
                            <Wallet size={22} color={color} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }) => (
                        <View style={{ padding: 10 }}>
                            <Menu size={22} color={color} />
                        </View>
                    )
                }}
            />
        </Tabs>
    );
}