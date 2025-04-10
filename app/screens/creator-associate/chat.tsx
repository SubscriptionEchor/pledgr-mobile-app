import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';

export default function ChatScreen() {
  const { colors, fonts, fontSize } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Chat" />
      <View style={styles.content}>
        <Text style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontFamily: fonts.bold,
            fontSize: fontSize['2xl'],
            includeFontPadding: false
          }
        ]}>
          Chat
        </Text>
        <Text style={[
          styles.description,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
            includeFontPadding: false
          }
        ]}>
          This is the chat screen for creator associates.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
});