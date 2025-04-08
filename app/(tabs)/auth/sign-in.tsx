import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, KeyboardAvoidingView, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Eye, EyeOff, ChevronRight, Check } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';
import { showToast } from '@/components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys, UserRole } from '@/lib/enums';
import { authAPI } from '@/lib/api/auth';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SignInScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const { loginWithGoogle, setUser } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check for remembered credentials on mount
  useEffect(() => {
    const checkRememberedCredentials = async () => {
      try {
        const [rememberMe, rememberedCreds] = await Promise.all([
          AsyncStorage.getItem(StorageKeys.REMEMBER_ME),
          AsyncStorage.getItem(StorageKeys.REMEMBER_ME_CREDS)
        ]);

        if (rememberMe === 'true' && rememberedCreds) {
          const creds = JSON.parse(rememberedCreds);
          setForm(prev => ({
            ...prev,
            email: creds.email,
            password: creds.password || '',
            rememberMe: true
          }));
        }
      } catch (error) {
        console.error('Error checking remembered credentials:', error);
      }
    };

    checkRememberedCredentials();
  }, []);

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      showToast.error('Missing fields', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Sign in
      const signInResponse = await authAPI.signIn({
        login: form.email,
        password: form.password,
      });

      // Store auth token and user data
      await Promise.all([
        AsyncStorage.setItem(StorageKeys.TOKEN, signInResponse?.data?.accessToken),
        AsyncStorage.setItem(StorageKeys.REMEMBER_ME, form.rememberMe.toString()),
        AsyncStorage.setItem(StorageKeys.USER_ROLE, UserRole.MEMBER),
        AsyncStorage.setItem(StorageKeys.IS_CREATOR_CREATED, 'false'),
        // Store credentials if remember me is enabled
        form.rememberMe ? 
          AsyncStorage.setItem(StorageKeys.REMEMBER_ME_CREDS, JSON.stringify({ 
            email: form.email, 
            password: form.password 
          })) :
          AsyncStorage.removeItem(StorageKeys.REMEMBER_ME_CREDS)
      ]);

        const baseInfoResponse = await authAPI.fetchBaseInfo();
        
        // Store access tokens if present
        if (baseInfoResponse?.data?.accessTokenMember) {
          await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN_MEMBER, baseInfoResponse?.data?.accessTokenMember);
        }
        if (baseInfoResponse?.data?.accessTokenCampaign) {
          await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN_CAMPAIGN, baseInfoResponse?.data?.accessTokenCampaign);
        }

        const data = baseInfoResponse.data;
        const userData = {
          name: data?.memberObj?.settings?.profile?.display_name || '',
          email: data?.memberObj?.settings?.profile?.email || '',
          role: UserRole.MEMBER,
          profile_photo: data?.memberObj?.settings?.profile?.profile_photo || ''
        };

        // Update user state
        setUser(userData);

      router.replace('/member/home');
    } catch (error: any) {
      console.error('Sign in error:', error);
      showToast.error(
        'Sign in failed',
        error.message || 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      showToast.error('Google sign in failed', 'Please try again');
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
              Welcome back
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
                  placeholder="Enter your password"
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
                    includeFontPadding: false
                  }
                ]}>
                  Remember me
                </Text>
              </TouchableOpacity>

              <Link href="/auth/forgot-password" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={[
                    styles.forgotPassword,
                    {
                      color: colors.primary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
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
                    Sign in
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
            onPress={handleGoogleSignIn}
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
                    Sign in with Google
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
              Don't have an account?{' '}
            </Text>
            <Link href="/auth/sign-up" asChild>
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