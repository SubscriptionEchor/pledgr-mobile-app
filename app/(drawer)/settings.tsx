import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const { colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <Button 
          label="Toggle Theme"
          onPress={toggleTheme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});