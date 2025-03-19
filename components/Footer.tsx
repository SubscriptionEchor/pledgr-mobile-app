import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Menu, Chrome as Home, Compass, Crown, MessageCircle } from 'lucide-react-native';
import { useRouter, usePathname, Link } from 'expo-router';

export function Footer() {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  console.log(pathname, "path");

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(tabs)')}>
        <Home 
          size={24} 
          color={pathname === '/' ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(tabs)/explore')}>
        <Compass 
          size={24} 
          color={isActive('explore') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(tabs)/membership')}>
        <Crown 
          size={24} 
          color={isActive('membership') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(tabs)/chat')}>
        <MessageCircle 
          size={24} 
          color={isActive('chat') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(tabs)/menu')}>
        <Menu 
          size={24} 
          color={isActive('menu') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});