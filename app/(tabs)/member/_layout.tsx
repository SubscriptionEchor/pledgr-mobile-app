import { Tabs } from 'expo-router';
import { Home, Compass, Crown, MessageCircle, Menu } from 'lucide-react-native';

export default function MemberTabLayout() {
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
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <Compass size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="membership"
                options={{
                    title: 'Membership',
                    tabBarIcon: ({ color }) => <Crown size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />
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