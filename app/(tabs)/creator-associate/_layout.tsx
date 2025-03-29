import { Tabs } from 'expo-router';
import { Home, Menu } from 'lucide-react-native';

export default function CreatorAssociateTabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />
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