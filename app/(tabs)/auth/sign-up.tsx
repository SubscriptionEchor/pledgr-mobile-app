import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, KeyboardAvoidingView, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';
import { showToast } from '@/components/Toast';
import { emailRegex, validatePassword } from '@/lib/utils/validation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SignUpScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignUp = async () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      showToast.error('Missing fields', 'Please fill in all fields');
      return;
    }

    if (!emailRegex.test(form.email)) {
      showToast.error('Invalid email', 'Please enter a valid email address');
      return;
    }

    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      showToast.error('Invalid password', passwordValidation.error || 'Please check password requirements');
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast.error('Password mismatch', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await login(form.email, form.password);
      router.replace('/member/home');
    } catch (error) {
      showToast.error('Sign up failed', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      showToast.error('Google sign up failed', 'Please try again');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: SCREEN_HEIGHT }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: colors.surface }
            ]}
            disabled={isLoading}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: Platform.OS === 'web' ? fontSize['4xl'] : fontSize['2xl'],
                includeFontPadding: false
              }
            ]}>
              Create your account
            </Text>
            <Text style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: Platform.OS === 'web' ? fontSize.xl : fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Join our community of creators and innovators.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Email address
              </Text>
              <TextInput
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                placeholder="Enter your email"
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
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.label,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Password
              </Text>
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surface }
              ]}>
                <TextInput
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  style={[
                    styles.inputWithButton,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  disabled={isLoading}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={[
                styles.passwordHint,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.xs,
                  includeFontPadding: false
                }
              ]}>
                Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.label,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Confirm password
              </Text>
              <View style={[
                styles.inputContainer,
                { backgroundColor: colors.surface }
              ]}>
                <TextInput
                  value={form.confirmPassword}
                  onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  style={[
                    styles.inputWithButton,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  disabled={isLoading}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                }
              ]}
              onPress={handleSignUp}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <>
                  <Text style={[
                    styles.buttonText,
                    {
                      color: colors.buttonText,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Create account
                  </Text>
                  <ChevronRight size={20} color={colors.buttonText} />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[
              styles.dividerText,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              Or continue with
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: colors.surface }]}
            onPress={handleGoogleSignUp}
            disabled={isLoading || isGoogleLoading}>
            <View style={styles.socialButtonContent}>
              {isGoogleLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }}
                    style={styles.socialIcon}
                  />
                  <Text style={[
                    styles.socialButtonText,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Sign up with Google
                  </Text>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[
              styles.footerText,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              Already have an account?{' '}
            </Text>
            <Link href="/auth/sign-in" asChild>
              <TouchableOpacity disabled={isLoading}>
                <Text style={[
                  styles.footerLink,
                  {
                    color: colors.primary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    padding: Platform.OS === 'web' ? 40 : 24,
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: Platform.OS === 'web' ? 40 : 32,
    gap: Platform.OS === 'web' ? 12 : 8,
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    textAlign: 'left',
  },
  form: {
    gap: Platform.OS === 'web' ? 24 : 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  input: {
    height: Platform.OS === 'web' ? 48 : 44,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'web' ? 48 : 44,
    borderRadius: 12,
  },
  inputWithButton: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
  },
  eyeButton: {
    width: Platform.OS === 'web' ? 48 : 44,
    height: Platform.OS === 'web' ? 48 : 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordHint: {
    marginLeft: 4,
  },
  button: {
    height: Platform.OS === 'web' ? 48 : 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Platform.OS === 'web' ? 32 : 24,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    textAlign: 'center',
  },
  socialButton: {
    height: Platform.OS === 'web' ? 48 : 44,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 32 : 24,
  },
  footerText: {
    textAlign: 'center',
  },
  footerLink: {
    textAlign: 'center',
  },
});