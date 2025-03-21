import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Menu, Chrome as Home, Compass, Crown, MessageCircle, BookOpen, Wallet } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useBottomSheet } from '@/lib/context/BottomSheetContext';
import { Platform } from 'react-native';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';

export function Footer() {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { isSheetVisible } = useBottomSheet();
  const { user } = useAuth();

  const isCreator = user?.role === UserRole.CREATOR;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  if (isSheetVisible) return null;

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}>
      {isCreator ? (
        <>
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
            onPress={() => router.push('/(tabs)/library')}>
            <BookOpen 
              size={24} 
              color={isActive('library') ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => router.push('/(tabs)/payouts')}>
            <Wallet 
              size={24} 
              color={isActive('payouts') ? colors.primary : colors.textSecondary} 
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
        </>
      ) : (
        <>
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 84 : 60,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 32 : 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});