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
  const { colors, fonts, fontSize } = useTheme();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>('');

  useEffect(() => {
    if (!visible) {
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
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
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
            <View style={styles.successView}>
              <View style={[styles.successIcon, { backgroundColor: `${colors.success}15` }]}>
                <Check size={32} color={colors.success} />
              </View>

              <View style={styles.successContent}>
                <Text style={[
                  styles.successTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.xl,
                    includeFontPadding: false
                  }
                ]}>
                  Two-Factor Authentication is Enabled
                </Text>
                <Text style={[
                  styles.successDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  Your account is protected with an additional layer of security.
                </Text>
                {lastVerifiedTime && (
                  <Text style={[
                    styles.lastVerified,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    Last verified: {lastVerifiedTime}
                  </Text>
                )}
              </View>

              <View style={[styles.mainSetting, { backgroundColor: colors.surface }]}>
                <View style={styles.settingContent}>
                  <Text style={[
                    styles.settingTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Two-Factor Authentication
                  </Text>
                  <Text style={[
                    styles.settingDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
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
                <Text style={[
                  styles.warningText,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Add an extra layer of security to your account by requiring both your password and a verification code from your phone.
                </Text>
              </View>

              <View style={[styles.mainSetting, { backgroundColor: colors.surface }]}>
                <View style={styles.settingContent}>
                  <Text style={[
                    styles.settingTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Enable Two-Factor Authentication
                  </Text>
                  <Text style={[
                    styles.settingDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
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
                  <Text style={[
                    styles.infoTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    How it works:
                  </Text>

                  <View style={styles.infoCards}>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                        <QrCode size={20} color={colors.primary} />
                      </View>
                      <View style={styles.infoCardContent}>
                        <Text style={[
                          styles.infoCardTitle,
                          {
                            color: colors.textPrimary,
                            fontFamily: fonts.semibold,
                            fontSize: fontSize.md,
                            includeFontPadding: false
                          }
                        ]}>
                          Setup Process
                        </Text>
                        <Text style={[
                          styles.infoCardDescription,
                          {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                          }
                        ]}>
                          Scan a QR code with your authenticator app to link it to your account
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                        <Shield size={20} color={colors.primary} />
                      </View>
                      <View style={styles.infoCardContent}>
                        <Text style={[
                          styles.infoCardTitle,
                          {
                            color: colors.textPrimary,
                            fontFamily: fonts.semibold,
                            fontSize: fontSize.md,
                            includeFontPadding: false
                          }
                        ]}>
                          Enhanced Security
                        </Text>
                        <Text style={[
                          styles.infoCardDescription,
                          {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                          }
                        ]}>
                          Protect your account even if your password is compromised
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : showVerification ? (
                <View style={styles.verificationSection}>
                  <Text style={[
                    styles.stepTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.lg,
                      includeFontPadding: false
                    }
                  ]}>
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
                            borderColor: error ? colors.error : colors.border,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.lg,
                            includeFontPadding: false
                          }
                        ]}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!isVerifying && !isVerified}
                      />
                      {error && (
                        <Text style={[
                          styles.errorText,
                          {
                            color: colors.error,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                          }
                        ]}>
                          {error}
                        </Text>
                      )}
                    </View>

                    {isVerified ? (
                      <View style={[styles.successMessage, { backgroundColor: `${colors.success}15` }]}>
                        <Text style={[
                          styles.successText,
                          {
                            color: colors.success,
                            fontFamily: fonts.medium,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                          }
                        ]}>
                          Two-factor authentication has been enabled successfully!
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.instructions, { backgroundColor: colors.surface }]}>
                        <Text style={[
                          styles.instructionsTitle,
                          {
                            color: colors.textPrimary,
                            fontFamily: fonts.semibold,
                            fontSize: fontSize.md,
                            includeFontPadding: false
                          }
                        ]}>
                          Verification Instructions
                        </Text>
                        <View style={styles.instructionsList}>
                          <Text style={[
                            styles.instruction,
                            {
                              color: colors.textSecondary,
                              fontFamily: fonts.regular,
                              fontSize: fontSize.sm,
                              includeFontPadding: false
                            }
                          ]}>
                            1. Open your authenticator app
                          </Text>
                          <Text style={[
                            styles.instruction,
                            {
                              color: colors.textSecondary,
                              fontFamily: fonts.regular,
                              fontSize: fontSize.sm,
                              includeFontPadding: false
                            }
                          ]}>
                            2. Find the Pledgr entry
                          </Text>
                          <Text style={[
                            styles.instruction,
                            {
                              color: colors.textSecondary,
                              fontFamily: fonts.regular,
                              fontSize: fontSize.sm,
                              includeFontPadding: false
                            }
                          ]}>
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
                          fontFamily: fonts.semibold,
                          fontSize: fontSize.md,
                          opacity: (isVerifying || isVerified) ? 0.5 : 1,
                          includeFontPadding: false
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
                    <Text style={[
                      styles.stepTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.lg,
                        includeFontPadding: false
                      }
                    ]}>
                      1. Scan QR code
                    </Text>
                    <View style={[styles.qrContainer, { backgroundColor: colors.surface }]}>
                      <Image
                        source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Example:user@example.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=Example&algorithm=SHA1&digits=6&period=30' }}
                        style={styles.qrCode}
                      />
                      <Text style={[
                        styles.qrText,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Scan this QR code with your Google Authenticator app
                      </Text>
                    </View>
                    <View style={[styles.manualContainer, { backgroundColor: colors.surface }]}>
                      <Text style={[
                        styles.manualTitle,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Or enter this code manually:
                      </Text>
                      <Text style={[
                        styles.manualCode,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          fontSize: fontSize.md,
                          includeFontPadding: false
                        }
                      ]}>
                        2H7D65Y7LBUWQNJ275BTFULRPFWQGMGF
                      </Text>
                    </View>
                  </View>

                  <View style={styles.step}>
                    <Text style={[
                      styles.stepTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.lg,
                        includeFontPadding: false
                      }
                    ]}>
                      2. Save backup codes
                    </Text>
                    <Text style={[
                      styles.stepDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
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
                            <Text style={[
                              styles.codeText,
                              {
                                color: colors.textPrimary,
                                fontFamily: fonts.medium,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                              }
                            ]}>
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
                          <Text style={[
                            styles.actionButtonText,
                            {
                              color: colors.textPrimary,
                              fontFamily: fonts.medium,
                              fontSize: fontSize.sm,
                              includeFontPadding: false
                            }
                          ]}>
                            Copy codes
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleDownloadCodes}
                          style={[styles.actionButton, { backgroundColor: colors.surface }]}>
                          <Download size={20} color={colors.primary} />
                          <Text style={[
                            styles.actionButtonText,
                            {
                              color: colors.primary,
                              fontFamily: fonts.medium,
                              fontSize: fontSize.sm,
                              includeFontPadding: false
                            }
                          ]}>
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
                      <Text style={[
                        styles.cancelButtonText,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.semibold,
                          fontSize: fontSize.md,
                          includeFontPadding: false
                        }
                      ]}>
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
    marginBottom: 2,
  },
  settingDescription: {
    lineHeight: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoTitle: {
    marginBottom: 4,
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
    marginBottom: 2,
  },
  infoCardDescription: {
    lineHeight: 20,
  },
  setupSection: {
    gap: 32,
  },
  step: {
    gap: 16,
  },
  stepTitle: {
    marginBottom: 4,
  },
  stepDescription: {
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
    textAlign: 'center',
  },
  manualContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  manualTitle: {
    textAlign: 'center',
  },
  manualCode: {
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
    fontFamily: 'monospace',
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
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    letterSpacing: 8,
    borderWidth: 1,
  },
  errorText: {
    marginTop: 4,
  },
  instructions: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  instructionsTitle: {
    marginBottom: 4,
  },
  instructionsList: {
    gap: 8,
  },
  instruction: {
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
    textAlign: 'center',
  },
  successDescription: {
    textAlign: 'center',
    lineHeight: 22,
  },
  lastVerified: {
    marginTop: 4,
  },
});

export { AuthenticatorModal }