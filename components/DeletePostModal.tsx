import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Button } from './Button';

interface DeletePostModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle: string;
}

export function DeletePostModal({ visible, onClose, onConfirm, postTitle }: DeletePostModalProps) {
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
          <View style={styles.header}>
            <AlertTriangle size={32} color={colors.error} />
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: fontSize.xl,
                includeFontPadding: false
              }
            ]}>
              Delete Post
            </Text>
          </View>

          <Text style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Are you sure you want to delete "{postTitle}"? This action cannot be undone.
          </Text>

          <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.infoTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              This will:
            </Text>
            <View style={styles.infoList}>
              <Text style={[
                styles.infoItem,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                • Delete the post permanently
              </Text>
              <Text style={[
                styles.infoItem,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                • Remove it from any collections it's part of
              </Text>
              <Text style={[
                styles.infoItem,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                • Make it inaccessible to all members
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.surface }]}
              onPress={onClose}>
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
            <View style={styles.deleteButton}>
              <Button
                label="Delete Post"
                onPress={onConfirm}
                variant="error"
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
  header: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    lineHeight: 20,
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
  },
  deleteButton: {
    flex: 1,
  },
});