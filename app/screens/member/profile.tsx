import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { Camera, ChevronLeft, Eye, EyeOff, X } from 'lucide-react-native';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { CountryPicker } from '@/components/CountryPicker';
import { showToast } from '@/components/Toast';
import { emailRegex } from '@/lib/utils/validation';

interface ProfileForm {
    name: string;
    email: string;
    country: string;
    state: string;
}

interface ChangeEmailModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (newEmail: string) => void;
}

function VerifyPasswordModal({ visible, onClose, onVerify }: {
    visible: boolean;
    onClose: () => void;
    onVerify: () => void;
}) {
    const { colors, fonts, fontSize } = useTheme();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        if (!password) {
            setError('Please enter your password');
            return;
        }

        setError(null);
        setIsVerifying(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            onVerify();
            setPassword('');
        } catch (error) {
            setError('Invalid password. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setError(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.modalOverlay}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[
                            styles.modalTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.bold,
                                fontSize: fontSize.xl,
                                includeFontPadding: false
                            }
                        ]}>
                            Verify your password
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <X size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[
                        styles.modalDescription,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                            includeFontPadding: false
                        }
                    ]}>
                        For security, please enter your password to continue
                    </Text>

                    <View style={styles.inputGroup}>
                        <View style={[
                            styles.passwordContainer,
                            {
                                backgroundColor: colors.surface,
                                borderColor: error ? colors.error : colors.border,
                            }
                        ]}>
                            <TextInput
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError(null);
                                }}
                                secureTextEntry={!showPassword}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.textSecondary}
                                style={[
                                    styles.passwordInput,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                        includeFontPadding: false
                                    }
                                ]}
                                editable={!isVerifying}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                                disabled={isVerifying}>
                                {showPassword ? (
                                    <EyeOff size={20} color={colors.textSecondary} />
                                ) : (
                                    <Eye size={20} color={colors.textSecondary} />
                                )}
                            </TouchableOpacity>
                        </View>
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

                    <View style={styles.modalActions}>
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
                            {isVerifying ? (
                                <View style={[styles.loadingButton, { backgroundColor: colors.primary }]}>
                                    <ActivityIndicator color={colors.buttonText} />
                                </View>
                            ) : (
                                <Button
                                    label="Continue"
                                    onPress={handleVerify}
                                    variant="primary"
                                />
                            )}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function ChangeEmailModal({ visible, onClose, onSubmit }: ChangeEmailModalProps) {
    const { colors, fonts, fontSize } = useTheme();
    const [newEmail, setNewEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!newEmail) {
            setError('Please enter a new email address');
            return;
        }

        if (!emailRegex.test(newEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            onSubmit(newEmail);
            setNewEmail('');
        } catch (error) {
            setError('Failed to update email. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setNewEmail('');
        setError(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.modalOverlay}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[
                            styles.modalTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.bold,
                                fontSize: fontSize.xl,
                            }
                        ]}>
                            Enter new email
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <X size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[
                        styles.modalDescription,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                        }
                    ]}>
                        Enter your new email address. We'll send a verification code to confirm it's yours.
                    </Text>

                    <View style={styles.inputGroup}>
                        <TextInput
                            value={newEmail}
                            onChangeText={(text) => {
                                setNewEmail(text);
                                setError(null);
                            }}
                            placeholder="Enter new email"
                            placeholderTextColor={colors.textSecondary}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.surface,
                                    color: colors.textPrimary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.md,
                                    borderColor: error ? colors.error : colors.border,
                                }
                            ]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isSubmitting}
                        />
                        {error && (
                            <Text style={[
                                styles.errorText,
                                {
                                    color: colors.error,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.sm,
                                }
                            ]}>
                                {error}
                            </Text>
                        )}
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={[styles.cancelButton, { backgroundColor: colors.surface }]}>
                            <Text style={[
                                styles.cancelButtonText,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                }
                            ]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.continueButton}>
                            {isSubmitting ? (
                                <View style={[styles.loadingButton, { backgroundColor: colors.primary }]}>
                                    <ActivityIndicator color={colors.buttonText} />
                                </View>
                            ) : (
                                <Button
                                    label="Send code"
                                    onPress={handleSubmit}
                                    variant="primary"
                                />
                            )}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default function ProfileScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [form, setForm] = useState<ProfileForm>({
        name: 'John Doe',
        email: 'john@example.com',
        country: 'United States',
        state: 'California'
    });

    const handleImageUpload = () => {
        // Implement image upload logic
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showToast.success(
                'Profile updated',
                'Your changes have been saved successfully'
            );
        } catch (error) {
            showToast.error(
                'Update failed',
                'Please try again later'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleEmailChange = async (newEmail: string) => {
        try {
            // Simulate API call to update email
            await new Promise(resolve => setTimeout(resolve, 1000));

            setForm(prev => ({ ...prev, email: newEmail }));
            setShowChangeEmail(false);

            showToast.success(
                'Email updated',
                'Your email has been updated successfully'
            );
        } catch (error) {
            showToast.error(
                'Update failed',
                'Failed to update email. Please try again.'
            );
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Profile" />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.imageSection}>
                        <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity
                                onPress={handleImageUpload}
                                style={[styles.uploadButton, { backgroundColor: colors.primary }]}>
                                <Camera size={20} color={colors.buttonText} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.medium,
                                    fontSize: fontSize.sm,
                                }
                            ]}>
                                Name
                            </Text>
                            <TextInput
                                value={form.name}
                                onChangeText={(text) => setForm({ ...form, name: text })}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textSecondary}
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.surface,
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                    }
                                ]}
                            />
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
                                Email
                            </Text>
                            <View style={styles.emailContainer}>
                                <TextInput
                                    value={form.email}
                                    editable={false}
                                    style={[
                                        styles.input,
                                        styles.emailInput,
                                        {
                                            backgroundColor: colors.surface,
                                            color: colors.textPrimary,
                                            fontFamily: fonts.regular,
                                        }
                                    ]}
                                />
                                <TouchableOpacity
                                    style={[styles.changeButton, { backgroundColor: colors.primary }]}
                                    onPress={() => setShowVerifyPassword(true)}>
                                    <Text style={[
                                        styles.changeButtonText,
                                        {
                                            color: colors.buttonText,
                                            fontFamily: fonts.semibold,
                                            fontSize: fontSize.sm,
                                        }
                                    ]}>
                                        Change
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.locationSection}>
                            <TouchableOpacity
                                onPress={() => setShowCountryPicker(true)}
                                style={[styles.input, styles.pickerButton, { backgroundColor: colors.surface }]}>
                                <Text style={[
                                    styles.pickerButtonText,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                    }
                                ]}>
                                    {form.country}
                                </Text>
                                <ChevronLeft size={20} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
                            </TouchableOpacity>

                            <TextInput
                                value={form.state}
                                onChangeText={(text) => setForm({ ...form, state: text })}
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.surface,
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                    }
                                ]}
                                placeholder="State/Province"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>
                    </View>

                    {isSaving ? (
                        <View style={[styles.loadingButton, { backgroundColor: colors.primary }]}>
                            <ActivityIndicator color={colors.buttonText} />
                        </View>
                    ) : (
                        <Button label="Save Changes" onPress={handleSave} variant="primary" />
                    )}
                </View>
            </ScrollView>

            <CountryPicker
                visible={showCountryPicker}
                onClose={() => setShowCountryPicker(false)}
                onSelect={(country) => {
                    setForm({ ...form, country });
                    setShowCountryPicker(false);
                }}
            />

            <VerifyPasswordModal
                visible={showVerifyPassword}
                onClose={() => setShowVerifyPassword(false)}
                onVerify={() => {
                    setShowVerifyPassword(false);
                    setShowChangeEmail(true);
                }}
            />

            <ChangeEmailModal
                visible={showChangeEmail}
                onClose={() => setShowChangeEmail(false)}
                onSubmit={handleEmailChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        gap: 32,
    },
    imageSection: {
        alignItems: 'center',
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    uploadButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formSection: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        marginLeft: 4,
    },
    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emailInput: {
        flex: 1,
        opacity: 0.7,
    },
    changeButton: {
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeButtonText: {
        fontSize: 14,
    },
    locationSection: {
        gap: 12,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerButtonText: {
        fontSize: 15,
    },
    loadingButton: {
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
        marginBottom: Platform.OS === 'ios' ? 100 : 0,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
    },
    modalDescription: {
        marginBottom: 24,
        lineHeight: 24,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
    },
    eyeButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 8,
        marginLeft: 4,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
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
    },
    continueButton: {
        flex: 2,
    },
});