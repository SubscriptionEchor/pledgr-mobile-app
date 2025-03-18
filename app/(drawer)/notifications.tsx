import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function NotificationsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});