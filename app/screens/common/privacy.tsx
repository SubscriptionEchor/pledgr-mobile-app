import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Lock, Shield, Eye, Trash2 } from 'lucide-react-native';

export default function PrivacyScreen() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Privacy Policy" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Lock size={32} color={colors.primary} />
                    <Text style={[
                        styles.title,
                        {
                            color: colors.textPrimary,
                            fontFamily: fonts.bold,
                            fontSize: fontSize['2xl'],
                            includeFontPadding: false
                        }
                    ]}>
                        Privacy Policy
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
                        Last updated: March 15, 2024
                    </Text>
                </View>

                <View style={styles.principles}>
                    <View style={[styles.principleCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <Shield size={24} color={colors.primary} />
                        </View>
                        <Text style={[
                            styles.principleTitle,
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

                    <View style={[styles.principleCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <Eye size={24} color={colors.primary} />
                        </View>
                        <Text style={[
                            styles.principleTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            Transparency
                        </Text>
                    </View>

                    <View style={[styles.principleCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <Trash2 size={24} color={colors.primary} />
                        </View>
                        <Text style={[
                            styles.principleTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            Data Control
                        </Text>
                    </View>
                </View>

                <View style={styles.sections}>
                    {PRIVACY_SECTIONS.map((section, index) => (
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

const PRIVACY_SECTIONS = [
    {
        title: '1. Information We Collect',
        content: 'We collect information that you provide directly to us, including but not limited to your name, email address, and profile information. We also automatically collect certain information about your device and usage of our platform.',
    },
    {
        title: '2. How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, to personalize your experience, and to protect our platform and users.',
    },
    {
        title: '3. Information Sharing',
        content: 'We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our platform, conducting our business, or serving our users.',
    },
    {
        title: '4. Data Security',
        content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
    },
    {
        title: '5. Your Rights',
        content: 'You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your information. Contact us to exercise these rights.',
    },
    {
        title: '6. Cookies and Tracking',
        content: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
    },
    {
        title: '7. Children\'s Privacy',
        content: 'Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
    },
    {
        title: '8. Changes to Privacy Policy',
        content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.',
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
    principles: {
        gap: 12,
    },
    principleCard: {
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