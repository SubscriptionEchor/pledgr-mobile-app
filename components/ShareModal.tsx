import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Link, Twitter, Facebook, MessageCircle } from 'lucide-react-native';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: (type: 'copy' | 'twitter' | 'facebook' | 'whatsapp') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, onShare }) => {
  const { colors, fonts, fontSize } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: '#fff' }]} onPress={e => e.stopPropagation()}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.lg }]}>Share</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.option} onPress={() => onShare('copy')}>
              <Link size={28} color={colors.textPrimary} />
              <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => onShare('twitter')}>
              <Twitter size={28} color={'#1DA1F2'} />
              <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => onShare('facebook')}>
              <Facebook size={28} color={'#1877F3'} />
              <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => onShare('whatsapp')}>
              <MessageCircle size={28} color={'#25D366'} />
              <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: '90%',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
    padding: 8,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
    fontSize: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  option: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  optionLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
}); 