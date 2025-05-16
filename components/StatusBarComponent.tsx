import { StatusBar as RNStatusBar } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface StatusBarComponentProps {
  barStyle?: 'light-content' | 'dark-content' | 'default';
}

export function StatusBarComponent({ barStyle }: StatusBarComponentProps) {
  const { colors, isDark } = useTheme();

  return (
    <RNStatusBar
      barStyle={barStyle ?? (isDark ? 'light-content' : 'dark-content')}
      backgroundColor={colors.background}
      translucent
    />
  );
}