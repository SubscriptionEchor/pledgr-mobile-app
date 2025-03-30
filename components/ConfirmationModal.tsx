import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/Button';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
}

export function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
}: ConfirmationModalProps) {
  const { colors, fonts, fontSize } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.content}>
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.xl,
                includeFontPadding: false
              }
            ]}>
              {title}
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
              {description}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelButton, { backgroundColor: colors.surface }]}>
              <Text style={[
                styles.cancelButtonText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <View style={styles.confirmButton}>
              <Button
                label={confirmLabel}
                onPress={onConfirm}
                variant={confirmVariant}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
  },
});