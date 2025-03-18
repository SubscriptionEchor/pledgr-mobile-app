import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Menu, Chrome as Home, Compass, Crown, MessageCircle } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter, usePathname } from 'expo-router';

export function Footer() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

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
        onPress={() => router.push('/(drawer)/(tabs)/home')}>
        <Home 
          size={24} 
          color={isActive('home') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(drawer)/(tabs)/explore')}>
        <Compass 
          size={24} 
          color={isActive('explore') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(drawer)/(tabs)/membership')}>
        <Crown 
          size={24} 
          color={isActive('membership') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/(drawer)/(tabs)/chat')}>
        <MessageCircle 
          size={24} 
          color={isActive('chat') ? colors.primary : colors.textSecondary} 
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openDrawer}
        style={styles.tab}>
        <Menu 
          size={24} 
          color={colors.textSecondary} 
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