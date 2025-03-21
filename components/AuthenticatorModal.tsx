import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Shield, QrCode, Copy, Download, Check } from 'lucide-react-native';
import { Button } from './Button';
import { useState, useEffect } from 'react';
import { showToast } from '@/components/Toast';

const BACKUP_CODES = [
  '2KD8NM',
  'MIQJPH',
  '5UMNEJ',
  'IC5168',
  '1VZIB2',
  'QCDC3M',
  'HCEQH6',
  '0I8VTO',
];

interface AuthenticatorModalProps {
  visible: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export function AuthenticatorModal({ 
  visible, 
  onClose,
  isEnabled,
  onToggle
}: AuthenticatorModalProps) {
  const { colors } = useTheme();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>('');

  useEffect(() => {
    if (!visible) {
      // Reset state when modal is closed
      if (!isEnabled) {
        setShowVerification(false);
        setVerificationCode('');
        setError(null);
        setIsVerifying(false);
        setIsVerified(false);
        setLastVerifiedTime('');
      }
    }
  }, [visible]);

  const handleToggle = (value: boolean) => {
    if (!value && showVerification) {
      // Reset everything if turning off during verification
      setShowVerification(false);
      setVerificationCode('');
      setError(null);
      setIsVerifying(false);
      setIsVerified(false);
      setLastVerifiedTime('');
    }
    onToggle(value);
  };

  const handleCopyCodes = () => {
    // Implement copy functionality
  };

  const handleDownloadCodes = () => {
    // Implement download functionality
  };

  const handleContinue = () => {
    setShowVerification(true);
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsVerified(true);
      setLastVerifiedTime(new Date().toLocaleString());
      onToggle(true);

      showToast.success(
        'Two-factor authentication enabled',
        'Your account is now more secure'
      );
    } catch (error) {
      showToast.error(
        'Verification failed',
        'Please try again'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setShowVerification(false);
    setVerificationCode('');
    setError(null);
    onToggle(false);
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Two-Factor Authentication
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isEnabled && isVerified ? (
            // Show simplified success view
            <View style={styles.successView}>
              <View style={[styles.successIcon, { backgroundColor: `${colors.success}15` }]}>
                <Check size={32} color={colors.success} />
              </View>
              
              <View style={styles.successContent}>
                <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                  Two-Factor Authentication is Enabled
                </Text>
                <Text style={[styles.successDescription, { color: colors.textSecondary }]}>
                  Your account is protected with an additional layer of security.
                </Text>
                {lastVerifiedTime && (
                  <Text style={[styles.lastVerified, { color: colors.textSecondary }]}>
                    Last verified: {lastVerifiedTime}
                  </Text>
                )}
              </View>

              <View style={[styles.mainSetting, { backgroundColor: colors.surface }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                    Two-Factor Authentication
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Use an authenticator app to generate verification codes
                  </Text>
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={handleToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isEnabled ? colors.buttonText : colors.surface}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={[styles.warningBox, { backgroundColor: `${colors.primary}15` }]}>
                <Shield size={24} color={colors.primary} />
                <Text style={[styles.warningText, { color: colors.textPrimary }]}>
                  Add an extra layer of security to your account by requiring both your password and a verification code from your phone.
                </Text>
              </View>

              <View style={[styles.mainSetting, { backgroundColor: colors.surface }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                    Enable Two-Factor Authentication
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Use an authenticator app to generate verification codes
                  </Text>
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={handleToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isEnabled ? colors.buttonText : colors.surface}
                />
              </View>

              {!isEnabled ? (
                <View style={styles.infoSection}>
                  <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                    How it works:
                  </Text>
                  
                  <View style={styles.infoCards}>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                        <QrCode size={20} color={colors.primary} />
                      </View>
                      <View style={styles.infoCardContent}>
                        <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                          Setup Process
                        </Text>
                        <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                          Scan a QR code with your authenticator app to link it to your account
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                        <Shield size={20} color={colors.primary} />
                      </View>
                      <View style={styles.infoCardContent}>
                        <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                          Enhanced Security
                        </Text>
                        <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                          Protect your account even if your password is compromised
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : showVerification ? (
                <View style={styles.verificationSection}>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                    3. Verify authentication code
                  </Text>
                  <View style={styles.form}>
                    <View style={styles.inputSection}>
                      <TextInput
                        value={verificationCode}
                        onChangeText={(text) => {
                          setVerificationCode(text.replace(/[^0-9]/g, ''));
                          setError(null);
                        }}
                        style={[
                          styles.input,
                          { 
                            backgroundColor: colors.surface,
                            color: colors.textPrimary,
                            borderColor: error ? colors.error : colors.border 
                          }
                        ]}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!isVerifying && !isVerified}
                      />
                      {error && (
                        <Text style={[styles.errorText, { color: colors.error }]}>
                          {error}
                        </Text>
                      )}
                    </View>

                    {isVerified ? (
                      <View style={[styles.successMessage, { backgroundColor: `${colors.success}15` }]}>
                        <Text style={[styles.successText, { color: colors.success }]}>
                          Two-factor authentication has been enabled successfully!
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.instructions, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.instructionsTitle, { color: colors.textPrimary }]}>
                          Verification Instructions
                        </Text>
                        <View style={styles.instructionsList}>
                          <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                            1. Open your authenticator app
                          </Text>
                          <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                            2. Find the Pledgr entry
                          </Text>
                          <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                            3. Enter the 6-digit code shown in the app
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => setShowVerification(false)}
                      style={[styles.cancelButton, { backgroundColor: colors.surface }]}
                      disabled={isVerifying || isVerified}>
                      <Text style={[
                        styles.cancelButtonText, 
                        { 
                          color: colors.textPrimary,
                          opacity: (isVerifying || isVerified) ? 0.5 : 1 
                        }
                      ]}>
                        Back
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.verifyButton}>
                      {isVerifying ? (
                        <View style={[styles.loadingButton, { backgroundColor: colors.primary }]}>
                          <ActivityIndicator color={colors.buttonText} />
                        </View>
                      ) : (
                        <Button
                          label="Verify"
                          onPress={handleVerify}
                          variant="primary"
                          disabled={isVerified}
                        />
                      )}
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.setupSection}>
                  <View style={styles.step}>
                    <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                      1. Scan QR code
                    </Text>
                    <View style={[styles.qrContainer, { backgroundColor: colors.surface }]}>
                      <Image
                        source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Example:user@example.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=Example&algorithm=SHA1&digits=6&period=30' }}
                        style={styles.qrCode}
                      />
                      <Text style={[styles.qrText, { color: colors.textSecondary }]}>
                        Scan this QR code with your Google Authenticator app
                      </Text>
                    </View>
                    <View style={[styles.manualContainer, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.manualTitle, { color: colors.textSecondary }]}>
                        Or enter this code manually:
                      </Text>
                      <Text style={[styles.manualCode, { color: colors.textPrimary }]}>
                        2H7D65Y7LBUWQNJ275BTFULRPFWQGMGF
                      </Text>
                    </View>
                  </View>

                  <View style={styles.step}>
                    <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                      2. Save backup codes
                    </Text>
                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                      Keep these backup codes safe — you'll need them if you lose access to your authenticator app
                    </Text>
                    <View style={[styles.codesContainer, { backgroundColor: colors.surface }]}>
                      <View style={styles.codesGrid}>
                        {BACKUP_CODES.map((code, index) => (
                          <View 
                            key={code}
                            style={[
                              styles.codeItem,
                              { backgroundColor: `${colors.primary}15` }
                            ]}>
                            <Text style={[styles.codeText, { color: colors.textPrimary }]}>
                              {code}
                            </Text>
                          </View>
                        ))}
                      </View>
                      <View style={styles.codesActions}>
                        <TouchableOpacity
                          onPress={handleCopyCodes}
                          style={[styles.actionButton, { backgroundColor: colors.surface }]}>
                          <Copy size={20} color={colors.textPrimary} />
                          <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
                            Copy codes
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleDownloadCodes}
                          style={[styles.actionButton, { backgroundColor: colors.surface }]}>
                          <Download size={20} color={colors.primary} />
                          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                            Download codes
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.footer}>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={[styles.cancelButton, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.continueButton}>
                      <Button
                        label="Continue"
                        onPress={handleContinue}
                        variant="primary"
                      />
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  mainSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoCardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  setupSection: {
    gap: 32,
  },
  step: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  qrContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  qrCode: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  qrText: {
    fontSize: 14,
    textAlign: 'center',
  },
  manualContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  manualTitle: {
    fontSize: 14,
  },
  manualCode: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  codesContainer: {
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  codesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  codeItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  codesActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
  },
  verificationSection: {
    gap: 24,
  },
  form: {
    gap: 24,
  },
  inputSection: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: 'monospace',
    letterSpacing: 8,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  instructions: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsList: {
    gap: 8,
  },
  instruction: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  verifyButton: {
    flex: 1,
  },
  loadingButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  successText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  successView: {
    gap: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  successContent: {
    alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  lastVerified: {
    fontSize: 14,
    marginTop: 4,
  },
});

export { AuthenticatorModal }