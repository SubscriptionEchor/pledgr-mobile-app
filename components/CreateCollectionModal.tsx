import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, FolderOpen, Tag, Image as ImageIcon, Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';

interface CreateCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  isTagCollection?: boolean;
}

export function CreateCollectionModal({ visible, onClose, isTagCollection = false }: CreateCollectionModalProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      showToast.error('Name required', 'Please enter a collection name');
      return;
    }

    // Create collection logic would go here
    showToast.success(
      'Collection created',
      `Your ${isTagCollection ? 'tag collection' : 'collection'} has been created successfully`
    );
    
    // Reset form and close modal
    setName('');
    setDescription('');
    setIsPrivate(false);
    onClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsPrivate(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              {isTagCollection ? (
                <Tag size={24} color={colors.primary} />
              ) : (
                <FolderOpen size={24} color={colors.primary} />
              )}
              <Text style={[
                styles.modalTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.bold,
                  fontSize: fontSize.xl,
                  includeFontPadding: false
                }
              ]}>
                {isTagCollection ? 'Create Tag Collection' : 'Create Collection'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <Text style={[
                styles.inputLabel,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Collection Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter collection name"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[
                styles.inputLabel,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Description (optional)
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter collection description"
                placeholderTextColor={colors.textSecondary}
                multiline
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}
                textAlignVertical="top"
              />
            </View>

            {isTagCollection && (
              <View style={styles.inputContainer}>
                <Text style={[
                  styles.inputLabel,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  Select Tags
                </Text>
                <View style={[
                  styles.tagsPlaceholder,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }
                ]}>
                  <Text style={[
                    styles.tagsPlaceholderText,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    No tags selected
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={[
                styles.inputLabel,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Visibility
              </Text>
              <View style={styles.visibilityOptions}>
                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    !isPrivate && { backgroundColor: `${colors.primary}15` },
                    { borderColor: !isPrivate ? colors.primary : 'transparent' }
                  ]}
                  onPress={() => setIsPrivate(false)}
                >
                  <View style={styles.visibilityIconContainer}>
                    <Eye size={24} color={!isPrivate ? colors.primary : colors.textSecondary} />
                  </View>
                  <View style={styles.visibilityTextContainer}>
                    <Text style={[
                      styles.visibilityTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Public
                    </Text>
                    <Text style={[
                      styles.visibilityDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Visible to everyone
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    isPrivate && { backgroundColor: `${colors.primary}15` },
                    { borderColor: isPrivate ? colors.primary : 'transparent' }
                  ]}
                  onPress={() => setIsPrivate(true)}
                >
                  <View style={styles.visibilityIconContainer}>
                    <Lock size={24} color={isPrivate ? colors.primary : colors.textSecondary} />
                  </View>
                  <View style={styles.visibilityTextContainer}>
                    <Text style={[
                      styles.visibilityTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Private
                    </Text>
                    <Text style={[
                      styles.visibilityDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Only visible to you
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelModalButton, { backgroundColor: colors.surface }]}
              onPress={handleClose}
            >
              <Text style={[
                styles.cancelModalText,
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
            <Button
              label="Create"
              onPress={handleCreate}
              variant="primary"
              disabled={!name.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textArea: {
    height: 120,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tagsPlaceholder: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsPlaceholderText: {
    fontSize: 16,
  },
  visibilityOptions: {
    gap: 12,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 16,
  },
  visibilityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibilityTextContainer: {
    flex: 1,
    gap: 4,
  },
  visibilityTitle: {
    fontSize: 16,
  },
  visibilityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  cancelModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModalText: {
    fontSize: 16,
  },
});