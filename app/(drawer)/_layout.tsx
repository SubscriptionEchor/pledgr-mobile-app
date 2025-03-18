import { Drawer } from 'expo-router/drawer';
import { useTheme } from '@/hooks/useTheme';
import { Download, History, Heart, Bell, Wallet, Chrome as Home, User, Settings } from 'lucide-react-native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.logoContainer, { paddingHorizontal: 24 }]}>
            <Text style={[styles.logoText, { color: colors.textPrimary }]}>
              Pledgr
            </Text>
          </View>
          <ScrollView {...props} style={styles.scroll}>
            {props.state.routes.map((route, i) => {
              const focused = i === props.state.index;
              const { title, drawerIcon } = props.descriptors[route.key].options;
              
              return (
                <TouchableOpacity
                  key={route.key}
                  style={[
                    styles.drawerItem,
                    focused && { backgroundColor: colors.surface }
                  ]}
                  onPress={() => props.navigation.navigate(route.name)}>
                  {drawerIcon?.({
                    size: 24,
                    color: focused ? colors.primary : colors.textSecondary
                  })}
                  <Text
                    style={[
                      styles.drawerLabel,
                      {
                        color: focused ? colors.primary : colors.textSecondary
                      }
                    ]}>
                    {title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View
            style={[
              styles.profile,
              { borderTopColor: colors.border }
            ]}>
            <User size={32} color={colors.textPrimary} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                John Doe
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                john@example.com
              </Text>
            </View>
          </View>
        </SafeAreaView>
      )}
      screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          drawerStyle: {
            backgroundColor: colors.background,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textSecondary,
        }}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: 'Home',
            drawerIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="downloads"
          options={{
            title: 'My Downloads',
            drawerIcon: ({ size, color }) => <Download size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: 'History',
            drawerIcon: ({ size, color }) => <History size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="liked"
          options={{
            title: 'Liked',
            drawerIcon: ({ size, color }) => <Heart size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            drawerIcon: ({ size, color }) => <Bell size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="wallet"
          options={{
            title: 'My Wallet',
            drawerIcon: ({ size, color }) => <Wallet size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerIcon: ({ size, color }) => <Settings size={size} color={color} />,
          }}
        />
      </Drawer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  logoContainer: {
    padding: 24,
    paddingBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  profileInfo: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
});