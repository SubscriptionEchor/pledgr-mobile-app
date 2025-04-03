import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { FileText, Shield, Scale, Users } from 'lucide-react-native';

export default function TermsScreen() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Terms of Service" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <FileText size={32} color={colors.primary} />
                    {/* <Text style={[
                        styles.title,
                        {
                            color: colors.textPrimary,
                            fontFamily: fonts.bold,
                            fontSize: fontSize['2xl'],
                            includeFontPadding: false
                        }
                    ]}>
                        Terms of Service
                    </Text> */}
                    <Text style={[
                        styles.subtitle,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                            includeFontPadding: false
                        }
                    ]}>
                        Last updated: March 15, 2024
                    </Text>
                </View>

                <View style={styles.highlights}>
                    <View style={[styles.highlightCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <Shield size={24} color={colors.primary} />
                        </View>
                        <Text style={[
                            styles.highlightTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            Data Protection
                        </Text>
                    </View>

                    <View style={[styles.highlightCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <Scale size={24} color={colors.primary} />
                        </View>
                        <Text style={[
                            styles.highlightTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            Fair Usage
                        </Text>
                    </View>

                    <View style={[styles.highlightCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <Users size={24} color={colors.primary} />
                        </View>
                        <Text style={[
                            styles.highlightTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            Community Rules
                        </Text>
                    </View>
                </View>

                <View style={styles.sections}>
                    {TERMS_SECTIONS.map((section, index) => (
                        <View key={index} style={styles.section}>
                            <Text style={[
                                styles.sectionTitle,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.lg,
                                    includeFontPadding: false
                                }
                            ]}>
                                {section.title}
                            </Text>
                            <Text style={[
                                styles.sectionContent,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.md,
                                    includeFontPadding: false
                                }
                            ]}>
                                {section.content}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const TERMS_SECTIONS = [
    {
        title: '1. Acceptance of Terms',
        content: 'By accessing and using this platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.',
    },
    {
        title: '2. User Accounts',
        content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.',
    },
    {
        title: '3. Content Guidelines',
        content: 'Users are responsible for all content they post on the platform. Content must not violate any applicable laws or regulations. We reserve the right to remove any content that violates these terms or is otherwise objectionable.',
    },
    {
        title: '4. Intellectual Property',
        content: 'The platform and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.',
    },
    {
        title: '5. Privacy Policy',
        content: 'Your use of the platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.',
    },
    {
        title: '6. Termination',
        content: 'We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.',
    },
    {
        title: '7. Changes to Terms',
        content: 'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.',
    },
    {
        title: '8. Contact Information',
        content: 'If you have any questions about these Terms, please contact us through the appropriate channels provided in the platform.',
    },
];

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
    header: {
        alignItems: 'center',
        gap: 12,
    },
    highlights: {
        gap: 12,
    },
    highlightCard: {
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sections: {
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionContent: {
        lineHeight: 24,
    },
});