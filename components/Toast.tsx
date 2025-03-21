import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { useTheme } from '@/hooks/useTheme';

export function ToastMessage() {
  const { colors, fonts, fontSize } = useTheme();

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.success,
        }}
        text1Style={{
          fontFamily: fonts.semibold,
          fontSize: fontSize.sm,
        }}
        text2Style={{
          fontFamily: fonts.regular,
          fontSize: fontSize.xs,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.error
        }}
        text1Style={{
          fontFamily: fonts.semibold,
          fontSize: fontSize.sm,
        }}
        text2Style={{
          fontFamily: fonts.regular,
          fontSize: fontSize.xs,
        }}
      />
    ),
  };

  return <Toast config={toastConfig} />;
}

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  },
};