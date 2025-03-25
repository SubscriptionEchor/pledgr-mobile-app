import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { showToast } from '@/components/Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      showToast.error('Missing email', 'Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast.success(
        'Reset link sent',
        'Check your email for instructions to reset your password'
      );
      
      router.back();
    } catch (error) {
      showToast.error(
        'Failed to send',
        'Please try again later'
      );
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
              }
            ]}>
              Reset password
            </Text>
            <Text style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: Platform.OS === 'web' ? fontSize.xl : fontSize.md,
              }
            ]}>
              Enter your email address and we'll send you instructions to reset your password.
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
                value={email}
                onChangeText={setEmail}
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

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                }
              ]}
              onPress={handleSubmit}
              disabled={isLoading}>
              <Send size={20} color={colors.buttonText} />
              <Text style={[
                styles.buttonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                }
              ]}>
                Send reset link
              </Text>
            </TouchableOpacity>
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
  button: {
    height: Platform.OS === 'web' ? 48 : 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});