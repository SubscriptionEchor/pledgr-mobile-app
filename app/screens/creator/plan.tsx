import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Crown, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { PlanSelectionModal } from '@/components/PlanSelectionModal';
import { useState } from 'react';

export default function PlanScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [showPlanModal, setShowPlanModal] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Current Plan" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <LinearGradient
                        colors={[colors.primary, '#9333ea']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.iconContainer}
                    >
                        <Crown size={24} color="#fff" />
                    </LinearGradient>
                    <Text style={[
                        styles.subtitle,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                            includeFontPadding: false
                        }
                    ]}>
                        Manage your platform fees and features
                    </Text>
                </View>

                <View style={[styles.planCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.planHeader}>
                        <View>
                            <Text style={[
                                styles.planName,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.xl,
                                    includeFontPadding: false
                                }
                            ]}>
                                Basic Plan
                            </Text>
                            <View style={styles.feeContainer}>
                                <Text style={[
                                    styles.feeAmount,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.bold,
                                        fontSize: fontSize['3xl'],
                                        includeFontPadding: false
                                    }
                                ]}>
                                    15%
                                </Text>
                                <Text style={[
                                    styles.feeLabel,
                                    {
                                        color: colors.textSecondary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.lg,
                                        includeFontPadding: false
                                    }
                                ]}>
                                    platform fee
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
                            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                            <Text style={[
                                styles.statusText,
                                {
                                    color: colors.success,
                                    fontFamily: fonts.medium,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                Active
                            </Text>
                        </View>
                    </View>

                    <Text style={[
                        styles.planDescription,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                            includeFontPadding: false
                        }
                    ]}>
                        Platform fee + applicable fees and taxes will be charged on all transactions. Upgrade to Pro plan for reduced fees.
                    </Text>

                    <View style={[styles.upgradeCard, { backgroundColor: `${colors.primary}15` }]}>
                        <View style={styles.upgradeLeft}>
                            <LinearGradient
                                colors={[colors.primary, '#9333ea']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.upgradeIcon}
                            >
                                <Sparkles size={20} color="#fff" />
                            </LinearGradient>
                            <View style={styles.upgradeText}>
                                <Text style={[
                                    styles.upgradeTitle,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.semibold,
                                        fontSize: fontSize.md,
                                        includeFontPadding: false
                                    }
                                ]}>
                                    Upgrade to Pro
                                </Text>
                                <Text style={[
                                    styles.upgradeDescription,
                                    {
                                        color: colors.textSecondary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.sm,
                                        includeFontPadding: false
                                    }
                                ]}>
                                    Get more features and lower fees
                                </Text>
                            </View>
                        </View>
                        <Button
                            label="Upgrade to Pro"
                            onPress={() => setShowPlanModal(true)}
                            variant="primary"
                        />
                    </View>
                </View>
            </ScrollView>

            <PlanSelectionModal
                visible={showPlanModal}
                onClose={() => setShowPlanModal(false)}
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
    header: {
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
    },
    planCard: {
        padding: 24,
        borderRadius: 16,
        gap: 24,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    planName: {
        marginBottom: 8,
    },
    feeContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    feeAmount: {
        letterSpacing: -1,
    },
    feeLabel: {
        letterSpacing: -0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    planDescription: {
        lineHeight: 24,
    },
    upgradeCard: {
        borderRadius: 16,
        padding: 20,
        gap: 20,
    },
    upgradeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    upgradeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    upgradeText: {
        flex: 1,
    },
    upgradeTitle: {
        marginBottom: 4,
    },
    upgradeDescription: {
        lineHeight: 18,
    },
});