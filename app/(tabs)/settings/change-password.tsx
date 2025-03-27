import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';
import { validatePassword, passwordRegex } from '@/lib/utils/validation';

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

export default function ChangePasswordScreen() {
  const { colors, fonts, fontSize } = useTheme();
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
  const [isUpdating, setIsUpdating] = useState(false);

  const passwordRequirements: PasswordRequirement[] = [
    { label: 'At least 8 characters long', regex: /.{8,}/, met: form.newPassword.length >= 8 },
    { label: 'Contains uppercase letter', regex: passwordRegex.uppercase, met: passwordRegex.uppercase.test(form.newPassword) },
    { label: 'Contains lowercase letter', regex: passwordRegex.lowercase, met: passwordRegex.lowercase.test(form.newPassword) },
    { label: 'Contains number', regex: passwordRegex.digit, met: passwordRegex.digit.test(form.newPassword) },
    { label: 'Contains special character', regex: passwordRegex.special, met: passwordRegex.special.test(form.newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const handleSubmit = async () => {
    setError(null);
    
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    const validation = validatePassword(form.newPassword);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsUpdating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast.success(
        'Password updated',
        'Your password has been changed successfully'
      );

      // Reset form
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showToast.error(
        'Update failed',
        'Please try again later'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Change Password" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[
            styles.description, 
            { 
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
            }
          ]}>
            Choose a strong password that you haven't used before.
          </Text>

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.error}15` }]}>
              <X size={20} color={colors.error} />
              <Text style={[
                styles.errorText, 
                { 
                  color: colors.error,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                }
              ]}>
                {error}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                { 
                  color: colors.textSecondary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                }
              ]}>
                Current Password
              </Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: colors.surface,
                  borderColor: error && !form.currentPassword ? colors.error : colors.border,
                }
              ]}>
                <TextInput
                  value={form.currentPassword}
                  onChangeText={(text) => {
                    setForm({ ...form, currentPassword: text });
                    setError(null);
                  }}
                  style={[
                    styles.input, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                    }
                  ]}
                  secureTextEntry={!showPasswords.current}
                  placeholderTextColor={colors.textSecondary}
                  editable={!isUpdating}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  style={styles.eyeButton}
                  disabled={isUpdating}>
                  {showPasswords.current ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                { 
                  color: colors.textSecondary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                }
              ]}>
                New Password
              </Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: colors.surface,
                  borderColor: error && !form.newPassword ? colors.error : colors.border,
                }
              ]}>
                <TextInput
                  value={form.newPassword}
                  onChangeText={(text) => {
                    setForm({ ...form, newPassword: text });
                    setError(null);
                  }}
                  style={[
                    styles.input, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                    }
                  ]}
                  secureTextEntry={!showPasswords.new}
                  placeholderTextColor={colors.textSecondary}
                  editable={!isUpdating}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  style={styles.eyeButton}
                  disabled={isUpdating}>
                  {showPasswords.new ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.requirementsContainer, { backgroundColor: colors.surface }]}>
              <Text style={[
                styles.requirementsTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                }
              ]}>
                Password Requirements
              </Text>
              <View style={styles.requirementsList}>
                {passwordRequirements.map((requirement, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <View style={[
                      styles.checkmark,
                      { 
                        backgroundColor: requirement.met ? `${colors.success}15` : `${colors.textSecondary}15`,
                      }
                    ]}>
                      <Check 
                        size={14} 
                        color={requirement.met ? colors.success : colors.textSecondary} 
                      />
                    </View>
                    <Text style={[
                      styles.requirementText,
                      {
                        color: requirement.met ? colors.textPrimary : colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                      }
                    ]}>
                      {requirement.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                { 
                  color: colors.textSecondary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                }
              ]}>
                Confirm New Password
              </Text>
              <View style={[
                styles.inputContainer, 
                { 
                  backgroundColor: colors.surface,
                  borderColor: error && !form.confirmPassword ? colors.error : colors.border,
                }
              ]}>
                <TextInput
                  value={form.confirmPassword}
                  onChangeText={(text) => {
                    setForm({ ...form, confirmPassword: text });
                    setError(null);
                  }}
                  style={[
                    styles.input, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                    }
                  ]}
                  secureTextEntry={!showPasswords.confirm}
                  placeholderTextColor={colors.textSecondary}
                  editable={!isUpdating}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  style={styles.eyeButton}
                  disabled={isUpdating}>
                  {showPasswords.confirm ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {isUpdating ? (
            <View style={[styles.loadingButton, { backgroundColor: colors.primary }]}>
              <ActivityIndicator color={colors.buttonText} />
            </View>
          ) : (
            <Button 
              label="Update Password" 
              onPress={handleSubmit} 
              variant="primary"
              disabled={!allRequirementsMet || !form.currentPassword || !form.confirmPassword}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
    paddingBottom: Platform.OS === 'ios' ? 120 : 20, // Extra padding for iOS keyboard
  },
  description: {
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    flex: 1,
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  eyeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementsContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  requirementsTitle: {
    marginBottom: 4,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementText: {
    flex: 1,
    lineHeight: 20,
  },
  loadingButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});