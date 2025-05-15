import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const REASONS = [
  'All reasons',
  'Harassment',
  'Spam',
  'Inappropriate content',
  'Unwanted contact',
  'Other',
];

interface BlockedUsersFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedReason: string;
  onSelectReason: (reason: string) => void;
  sortNewest: boolean;
  onToggleSort: () => void;
}

export const BlockedUsersFilterSheet = ({
  visible,
  onClose,
  selectedReason,
  onSelectReason,
  sortNewest,
  onToggleSort,
}: BlockedUsersFilterSheetProps) => {
  const { colors, fonts, fontSize } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.background }]} onPress={e => e.stopPropagation()}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.lg }]}>Filter by reason</Text>
          <View style={styles.reasonList}>
            {REASONS.map(reason => (
              <TouchableOpacity
                key={reason}
                style={styles.reasonRow}
                onPress={() => onSelectReason(reason)}
                activeOpacity={0.8}
              >
                <View style={[styles.radioOuter, { borderColor: colors.primary }]}> 
                  {selectedReason === reason && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.sortRow}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: fontSize.md }}>Sort:</Text>
            <TouchableOpacity
              style={[styles.sortBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={onToggleSort}
            >
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: fontSize.md }}>
                {sortNewest ? 'Newest first' : 'Oldest first'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.primary }]} onPress={onClose}>
            <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.md }}>Done</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    marginBottom: 18,
    textAlign: 'left',
  },
  reasonList: {
    marginBottom: 24,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sortBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 12,
  },
  closeBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
}); 