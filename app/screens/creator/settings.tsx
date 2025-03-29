import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
    CreditCard,
    HardDrive,
    Eye,
    Bell,
    Users,
    Ban,
    ChevronRight
} from 'lucide-react-native';
import { useState } from 'react';
import { ProfileVisibilityModal } from '@/components/ProfileVisibilityModal';
import { ProfileVisibility } from '@/lib/enums';

const SETTINGS_SECTIONS = [
    {
        title: 'Account',
        items: [
            {
                id: 'plan',
                label: 'Current Plan',
                icon: CreditCard,
                route: '/screens/creator/plan',
            },
            {
                id: 'storage',
                label: 'Storage Usage',
                icon: HardDrive,
                route: '/screens/creator/storage',
            },
        ],
    },
    {
        title: 'Team',
        items: [
            {
                id: 'team',
                label: 'Team Members',
                icon: Users,
                route: '/screens/creator/team',
            },
        ],
    },
    {
        title: 'Preferences',
        items: [
            {
                id: 'visibility',
                label: 'Profile Visibility',
                icon: Eye,
                action: 'visibility',
            },
            {
                id: 'notifications',
                label: 'Notification',
                icon: Bell,
                route: '/screens/common/notifications',
            },
            {
                id: 'unpublish',
                label: 'Unpublish Page',
                icon: Ban,
                route: '/screens/creator/unpublish',
            },
        ],
    },
];

export default function SettingsScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [visibility, setVisibility] = useState(ProfileVisibility.PUBLIC);

    const handleNavigation = (route: string | undefined, action: string | undefined) => {
        if (action === 'visibility') {
            setShowVisibilityModal(true);
        } else if (route) {
            router.push(route);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Creator Settings" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {SETTINGS_SECTIONS.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={[
                            styles.sectionTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                            }
                        ]}>
                            {section.title}
                        </Text>

                        <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
                            {section.items.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.settingItem,
                                        index !== section.items.length - 1 && {
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors.border,
                                        },
                                    ]}
                                    onPress={() => handleNavigation(item.route, item.action)}>
                                    <View style={styles.settingItemLeft}>
                                        <View style={[
                                            styles.iconContainer,
                                            { backgroundColor: `${colors.primary}15` }
                                        ]}>
                                            <item.icon size={20} color={colors.textPrimary} />
                                        </View>
                                        <Text style={[
                                            styles.settingItemLabel,
                                            {
                                                color: colors.textPrimary,
                                                fontFamily: fonts.regular,
                                                fontSize: fontSize.md,
                                            }
                                        ]}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    <ChevronRight size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <ProfileVisibilityModal
                visible={showVisibilityModal}
                onClose={() => setShowVisibilityModal(false)}
                selectedVisibility={visibility}
                onSelect={setVisibility}
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
    section: {
        gap: 12,
    },
    sectionTitle: {
        paddingHorizontal: 4,
    },
    sectionContent: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingItemLabel: {
        lineHeight: 22,
    },
});