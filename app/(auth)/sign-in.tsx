import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Eye, EyeOff, ChevronRight, Check } from 'lucide-react-native';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';
import { showToast } from '@/components/Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SignInScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      showToast.error('Missing fields', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await login(form.email, form.password, form.rememberMe);
      router.replace('/(tabs)');
    } catch (error) {
      showToast.error('Sign in failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
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
          <View style={styles.header}>
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: Platform.OS === 'web' ? fontSize['4xl'] : fontSize['2xl'],
              }
            ]}>
              Welcome back
            </Text>
            <Text style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: Platform.OS === 'web' ? fontSize.xl : fontSize.md,
              }
            ]}>
              Sign in to continue building amazing things.
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
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  style={[
                    styles.inputWithButton,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
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
            </View>

            <View style={styles.options}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setForm({ ...form, rememberMe: !form.rememberMe })}
                disabled={isLoading}>
                <View style={[
                  styles.checkboxBox,
                  {
                    backgroundColor: form.rememberMe ? colors.primary : 'transparent',
                    borderColor: form.rememberMe ? colors.primary : colors.border,
                  }
                ]}>
                  {form.rememberMe && (
                    <Check size={14} color={colors.buttonText} strokeWidth={3} />
                  )}
                </View>
                <Text style={[
                  styles.checkboxLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                  }
                ]}>
                  Remember me
                </Text>
              </TouchableOpacity>

              <Link href="/forgot-password" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={[
                    styles.forgotPassword,
                    {
                      color: colors.primary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.sm,
                    }
                  ]}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                }
              ]}
              onPress={handleSignIn}
              disabled={isLoading}>
              <Text style={[
                styles.buttonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                }
              ]}>
                Sign in
              </Text>
              <ChevronRight size={20} color={colors.buttonText} />
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
              }
            ]}>
              Or continue with
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: colors.surface }]}
            disabled={isLoading}>
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
              }
            ]}>
              Sign in with Google
            </Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[
              styles.footerText,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
              }
            ]}>
              Don't have an account?{' '}
            </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity disabled={isLoading}>
                <Text style={[
                  styles.footerLink,
                  {
                    color: colors.primary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.sm,
                  }
                ]}>
                  Sign up for free
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
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  forgotPassword: {
    fontSize: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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