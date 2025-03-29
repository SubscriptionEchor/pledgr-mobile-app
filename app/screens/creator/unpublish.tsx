import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useState } from 'react';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { showToast } from '@/components/Toast';

export default function UnpublishScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleUnpublish = () => {
        showToast.success(
            'Page unpublished',
            'Your page has been unpublished successfully'
        );
        setShowConfirmation(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Unpublish Page" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.warningBox]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.error }]}>
                        <AlertTriangle size={24} color={colors.buttonText} />
                    </View>
                </View>

                <Text style={[
                    styles.description,
                    {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                    }
                ]}>
                    When you unpublish your page:
                </Text>

                <View style={styles.bulletPoints}>
                    <Text style={[
                        styles.bulletPoint,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                        }
                    ]}>
                        • Members will not be able to access your creator page and member billing will be suspended
                    </Text>

                    <Text style={[
                        styles.bulletPoint,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                        }
                    ]}>
                        • Customers who have bought items from your shop will keep access to their purchases, but your shop and products will otherwise no longer be visible
                    </Text>

                    <Text style={[
                        styles.bulletPoint,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                        }
                    ]}>
                        • We'll keep your creator page content and member information, including pledges, for when you decide to launch your page at a later date
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.unpublishButton, { backgroundColor: `${colors.error}15` }]}
                    onPress={() => setShowConfirmation(true)}
                >
                    <AlertTriangle size={20} color={colors.error} />
                    <Text style={[
                        styles.unpublishButtonText,
                        {
                            color: colors.error,
                            fontFamily: fonts.semibold,
                            fontSize: fontSize.md,
                        }
                    ]}>
                        Unpublish your page
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <ConfirmationModal
                visible={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleUnpublish}
                title="Unpublish Page"
                description="Are you sure you want to unpublish your page? This action cannot be undone."
                confirmLabel="Unpublish"
                confirmVariant="error"
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
        gap: 24,
    },
    warningBox: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        lineHeight: 24,
    },
    bulletPoints: {
        gap: 16,
    },
    bulletPoint: {
        lineHeight: 24,
    },
    unpublishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 48,
        borderRadius: 12,
        marginTop: 8,
    },
    unpublishButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});