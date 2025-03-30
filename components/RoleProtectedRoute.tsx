import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Lock } from 'lucide-react-native';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { colors, fonts, fontSize } = useTheme();

  if (isLoading) {
    return null;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <Lock size={48} color={colors.error} />
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
            Access Denied
          </Text>
          <Text style={[
            styles.message,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            You don't have permission to access this page.
          </Text>
        </View>
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
  },
});