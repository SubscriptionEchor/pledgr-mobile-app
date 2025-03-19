import { Switch as RNSwitch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Switch({ value, onValueChange }: SwitchProps) {
  const { colors } = useTheme();
  
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={value ? colors.buttonText : colors.surface}
    />
  );
}