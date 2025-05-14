import { StatusBar as RNStatusBar } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface StatusBarComponentProps {
  barStyle?: 'light-content' | 'dark-content' | 'default';
}

export function StatusBarComponent({ barStyle }: StatusBarComponentProps) {
  const { colors } = useTheme();

  return (
    <RNStatusBar
      barStyle={barStyle}
      backgroundColor={colors.background}
      translucent
    />
  );
}