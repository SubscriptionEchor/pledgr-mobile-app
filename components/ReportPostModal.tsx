import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const REPORT_REASONS = [
  'Spam',
  'Inappropriate content',
  'Harassment or bullying',
  'Misinformation',
  'Other',
];

interface ReportPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description?: string) => void;
  postAuthor: string;
}

export const ReportPostModal = ({ visible, onClose, onSubmit, postAuthor }: ReportPostModalProps) => {
  const { colors, fonts, fontSize } = useTheme();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherDescription, setOtherDescription] = useState('');

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== 'Other') setOtherDescription('');
  };

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, selectedReason === 'Other' ? otherDescription : undefined);
      setSelectedReason(null);
      setOtherDescription('');
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setOtherDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.18)' }]} onPress={handleClose}>
        <Pressable style={[styles.modal, { 
          backgroundColor: colors.background,
          shadowColor: colors.textPrimary 
        }]} onPress={e => e.stopPropagation()}>
          <View style={styles.headerRow}>
            <Feather name="alert-triangle" size={24} color={colors.warning} style={{ marginRight: 8 }} />
            <Text style={[styles.title, { color: colors.textPrimary }]}>Report Post</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={handleClose} hitSlop={12}>
              <Feather name="x" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            You are about to report a post by <Text style={[styles.author, { color: colors.textPrimary }]}>{postAuthor}</Text>. Please select a reason for your report.
          </Text>
          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Reason for Report</Text>
          <View style={styles.radioGroup}>
            {REPORT_REASONS.map(reason => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.radioOption,
                  { backgroundColor: colors.surface },
                  selectedReason === reason && { 
                    borderColor: colors.primary,
                    backgroundColor: colors.primaryLight 
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => handleReasonSelect(reason)}
              >
                <View style={[styles.radioCircleOuter, { borderColor: colors.primary }]}>
                  {selectedReason === reason && <View style={[styles.radioCircleInner, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>{reason}</Text>
              </TouchableOpacity>
            ))}
            {selectedReason === 'Other' && (
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.textPrimary 
                }]}
                placeholder="Add an optional description..."
                placeholderTextColor={colors.textSecondary}
                value={otherDescription}
                onChangeText={setOtherDescription}
                multiline
                maxLength={300}
              />
            )}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.reportButton,
                { backgroundColor: colors.primary },
                !selectedReason && { backgroundColor: colors.primaryLight }
              ]}
              onPress={handleSubmit}
              disabled={!selectedReason}
            >
              <Text style={[styles.reportButtonText, { color: colors.buttonText }]}>Report Post</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 380,
    maxWidth: '95%',
    borderRadius: 16,
    padding: 28,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    marginBottom: 18,
    marginTop: 2,
  },
  author: {
    fontWeight: '700',
  },
  sectionLabel: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radioCircleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: '#fff',
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  textInput: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reportButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  reportButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
}); 