import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Eye, EyeOff, X } from 'lucide-react-native';
import { useState } from 'react';
import { Button } from '@/components/Button';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (passwords: { currentPassword: string; newPassword: string }) => void;
}

export function ChangePasswordModal({ visible, onClose, onSubmit }: ChangePasswordModalProps) {
  const { colors } = useTheme();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = () => {
    if (form.newPassword !== form.confirmPassword) {
      // Handle password mismatch
      return;
    }
    onSubmit({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    // Reset form
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Change Password</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Please enter your current password and choose a new password to update your credentials.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                <TextInput
                  value={form.currentPassword}
                  onChangeText={(text) => setForm({ ...form, currentPassword: text })}
                  style={[styles.input, { color: colors.textPrimary }]}
                  secureTextEntry={!showPasswords.current}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  style={styles.eyeButton}>
                  {showPasswords.current ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                <TextInput
                  value={form.newPassword}
                  onChangeText={(text) => setForm({ ...form, newPassword: text })}
                  style={[styles.input, { color: colors.textPrimary }]}
                  secureTextEntry={!showPasswords.new}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  style={styles.eyeButton}>
                  {showPasswords.new ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                <TextInput
                  value={form.confirmPassword}
                  onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                  style={[styles.input, { color: colors.textPrimary }]}
                  secureTextEntry={!showPasswords.confirm}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  style={styles.eyeButton}>
                  {showPasswords.confirm ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Button label="Update Password" onPress={handleSubmit} variant="primary" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  eyeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});