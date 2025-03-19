import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function ChangePasswordScreen() {
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Handle password update logic here
    console.log('Updating password...');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Change Password" />
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Choose a strong password that you haven't used before. A good password is at least 8 characters long and includes a mix of letters, numbers, and symbols.
        </Text>

        {error && (
          <Text style={[styles.error, { color: colors.error }]}>
            {error}
          </Text>
        )}

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    fontSize: 14,
    fontWeight: '500',
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