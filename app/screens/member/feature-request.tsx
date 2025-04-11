import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState, useRef } from 'react';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';
import { Lightbulb, Sparkles, Zap } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeatureRequestScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            showToast.error(
                'Missing information',
                'Please fill in all fields'
            );
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showToast.success(
                'Request submitted',
                'Thank you for your feedback!'
            );

            // Reset form
            setTitle('');
            setDescription('');
        } catch (error) {
            showToast.error(
                'Submission failed',
                'Please try again later'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFocus = (inputPosition: number) => {
        // Wait for the keyboard to appear
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: inputPosition,
                animated: true
            });
        }, 100);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Feature Request" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Lightbulb size={32} color={colors.primary} />
                        <Text style={[
                            styles.title,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.bold,
                                fontSize: fontSize['2xl'],
                                includeFontPadding: false
                            }
                        ]}>
                            Share Your Ideas
                        </Text>
                        <Text style={[
                            styles.subtitle,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            Help us improve by suggesting new features or improvements
                        </Text>
                    </View>

                    <View style={styles.features}>
                        <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
                            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                <Sparkles size={24} color={colors.primary} />
                            </View>
                            <Text style={[
                                styles.featureTitle,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                    includeFontPadding: false,
                                    textAlign: 'center'
                                }
                            ]}>
                                Innovation Welcome
                            </Text>
                            <Text style={[
                                styles.featureDescription,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                We value fresh ideas that can make the platform better for everyone
                            </Text>
                        </View>

                        <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
                            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                <Zap size={24} color={colors.primary} />
                            </View>
                            <Text style={[
                                styles.featureTitle,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                    includeFontPadding: false,
                                    textAlign: 'center'
                                }
                            ]}>
                                Quick Implementation
                            </Text>
                            <Text style={[
                                styles.featureDescription,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                Popular requests may be implemented in upcoming updates
                            </Text>
                        </View>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.medium,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                Feature Title
                            </Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Enter a short, descriptive title"
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
                                editable={!isSubmitting}
                                onFocus={() => handleFocus(200)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.medium,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                Description
                            </Text>
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe the feature and how it would help"
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                style={[
                                    styles.input,
                                    styles.textArea,
                                    {
                                        backgroundColor: colors.surface,
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                        includeFontPadding: false
                                    }
                                ]}
                                editable={!isSubmitting}
                                onFocus={() => handleFocus(300)}
                            />
                        </View>

                        <Button
                            label={isSubmitting ? "Submitting..." : "Submit Request"}
                            onPress={handleSubmit}
                            variant="primary"
                        />
                    </View>
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
        gap: 32,
        paddingBottom: Platform.OS === 'ios' ? 120 : 20, // Extra padding for iOS keyboard
    },
    header: {
        alignItems: 'center',
        gap: 12,
    },
    features: {
        flexDirection: 'row',
        gap: 12,
    },
    featureCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
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
    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    textArea: {
        height: 120,
        paddingTop: 12,
        paddingBottom: 12,
    },
    title: {
        marginBottom: 20,
    },
});