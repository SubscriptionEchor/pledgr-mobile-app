import { Tabs } from 'expo-router';
import { Home, Compass, Crown, Download, Menu } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

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
            }}
            initialRouteName="home"
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <View style={{ padding: 10 }}>
                            <Home size={22} color={color} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => (
                        <View style={{ padding: 10 }}>
                            <Compass size={22} color={color} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="downloads"
                options={{
                    title: 'Downloads',
                    tabBarIcon: ({ color }) => (
                        <View style={{ padding: 10 }}>
                            <Download size={22} color={color} />
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