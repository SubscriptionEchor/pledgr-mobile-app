import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { User, MessageCircle, Bell } from 'lucide-react-native';
import { useProfileSheet } from '@/lib/context/ProfileSheetContext';
import { useRouter } from 'expo-router';

export function Header() {
  const { colors, fonts, fontSize, isDark } = useTheme();
  const { showProfileSheet } = useProfileSheet();
  const router = useRouter();

  const logoSource = isDark
    ? require('../assets/images/pledgr-light.png')
    : require('../assets/images/pledgr-dark.png');

  const handleChatPress = () => {
    router.push('/screens/common/chat');
  };

  const handleNotificationPress = () => {
    router.push('/screens/member/notifications');
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          shadowColor: colors.textPrimary,
        },
      ]}>
      <View style={styles.leftContainer}>
        <Image
          source={logoSource}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={handleChatPress}
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.surface,
            },
          ]}>
          <MessageCircle size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.surface,
            },
          ]}>
          <Bell size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showProfileSheet}
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.surface,
            },
          ]}>
          <User size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    height: 32,
    width: 110,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});