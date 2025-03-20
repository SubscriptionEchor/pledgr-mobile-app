import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { useTheme } from '@/hooks/useTheme';

export function ToastMessage() {
  const { colors } = useTheme();

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.success,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.error
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