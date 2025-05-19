import { Tabs } from 'expo-router';
import { Home, Library, Wallet, Menu, Plus, BookOpen, User, BarChart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { View, TouchableOpacity } from 'react-native';

export default function CreatorTabLayout() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <Tabs
            screenOptions={({ route }) => ({
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
            })}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color }) => <Library size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            backgroundColor: colors.primary,
                            borderRadius: 28,
                            width: 56,
                            height: 56,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: -24,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.18,
                            shadowRadius: 6,
                            elevation: 8,
                        }}>
                            <Plus color="#fff" size={32} />
                        </View>
                    ),
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            onPress={() => { console.log('Add button pressed'); }}
                            style={[props.style, { alignItems: 'center', justifyContent: 'center' }]}
                        >
                            {props.children}
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color }) => <BarChart size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}