import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { User } from 'lucide-react-native';

export function Header() {
  const { colors, shadows } = useTheme();

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
        <Text style={[styles.logoText, { color: colors.textPrimary }]}>
          Pledgr
        </Text>
      </View>
      <View
        style={[
          styles.profileButton,
          {
            backgroundColor: colors.surface,
          },
        ]}>
        <User size={24} color={colors.textPrimary} />
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
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});