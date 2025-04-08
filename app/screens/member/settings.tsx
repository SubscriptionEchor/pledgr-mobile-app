import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { useState, useEffect } from 'react';
import { ProfileVisibilityModal } from '@/components/ProfileVisibilityModal';
import { AdultContentModal } from '@/components/AdultContentModal';
import { LanguagePicker } from '@/components/LanguagePicker';
import { AuthenticatorModal } from '@/components/AuthenticatorModal';
import { DeviceManagementModal } from '@/components/DeviceManagementModal';
import { User, Key, Languages, Bell, Shield, Smartphone, Crown, FileText, Lightbulb, Lock, ChevronRight, Eye, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { MOCK_DEVICES } from '@/lib/constants';
import { useMemberSettings } from '@/hooks/useMemberSettings';

const SETTINGS_SECTIONS = [
    {
        title: 'Account',
        items: [
            { label: 'Profile', icon: User, route: '/screens/member/profile' },
            { label: 'Change Password', icon: Key, route: '/screens/member/change-password' }
        ]
    },
    {
        title: 'Preferences',
        items: [
            { label: 'Profile Visibility', icon: Eye, action: 'visibility' },
            { label: 'Adult Content', icon: AlertTriangle, action: 'adult-content' },
            { label: 'Language', icon: Languages, action: 'language' },
            { label: 'Notifications', icon: Bell, route: '/screens/common/notifications' }
        ]
    },
    {
        title: 'Security',
        items: [
            { label: 'Two-Factor Authentication', icon: Shield, action: 'authenticator' },
            { label: 'Device Management', icon: Smartphone, action: 'devices' }
        ]
    },
    {
        title: 'Memberships',
        items: [
            { label: 'Subscription', icon: Crown, route: '/screens/member/subscription' }
        ]
    },
    {
        title: 'Others',
        items: [
            { label: 'Feature Request', icon: Lightbulb, route: '/screens/member/feature-request' },
            { label: 'Terms of Service', icon: FileText, route: '/screens/common/terms' },
            { label: 'Privacy Policy', icon: Lock, route: '/screens/common/privacy' }
        ]
    }
];

export default function SettingsScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [showAdultContentModal, setShowAdultContentModal] = useState(false);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    const [showAuthenticatorModal, setShowAuthenticatorModal] = useState(false);
    const [showDeviceManagementModal, setShowDeviceManagementModal] = useState(false);
    const [isAuthenticatorEnabled, setIsAuthenticatorEnabled] = useState(false);
    const [devices, setDevices] = useState(MOCK_DEVICES);
    const { memberSettings, isLoading, fetchMemberSettings, updateMemberSettings } = useMemberSettings();

    useEffect(() => {
        fetchMemberSettings();
    }, []);

    const handleNavigation = (route?: string, action?: string) => {
        if (action === 'visibility') {
            setShowVisibilityModal(true);
        } else if (action === 'adult-content') {
            setShowAdultContentModal(true);
        } else if (action === 'language') {
            setShowLanguagePicker(true);
        } else if (action === 'authenticator') {
            setShowAuthenticatorModal(true);
        } else if (action === 'devices') {
            setShowDeviceManagementModal(true);
        } else if (route) {
            router.push(route);
        }
    };

    const handleLogoutDevice = (deviceId: string) => {
        setDevices(devices.filter(device => device.id !== deviceId));
    };

    const handleLogoutAllDevices = () => {
        setDevices(devices.filter(device => device.isCurrentDevice));
    };

    const handleVisibilityChange = async (visibility: string) => {
        try {
            await updateMemberSettings({
                security: {
                    public_profile: visibility === 'public'
                }
            });
            setShowVisibilityModal(false);
        } catch (error) {
            console.error('Error updating visibility:', error);
        }
    };

    const handleAdultContentChange = async (settings: { enabled: boolean }) => {
        try {
            await updateMemberSettings({
                content_preferences: {
                    ...memberSettings?.content_preferences,
                    adult_content: settings.enabled
                }
            });
            setShowAdultContentModal(false);
        } catch (error) {
            console.error('Error updating adult content settings:', error);
        }
    };

    const handleLanguageChange = async (language: { code: string; name: string }) => {
        try {
            await updateMemberSettings({
                content_preferences: {
                    ...memberSettings?.content_preferences,
                    language: language.code
                }
            });
            setShowLanguagePicker(false);
        } catch (error) {
            console.error('Error updating language:', error);
        }
    };

    if (isLoading && !memberSettings) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <SubHeader title="Settings" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[
                        styles.loadingText,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                            includeFontPadding: false,
                            marginTop: 12
                        }
                    ]}>
                        Loading settings...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Settings" />
            {isLoading && (
                <View style={styles.updatingOverlay}>
                    <View style={[styles.updatingContainer, { backgroundColor: colors.surface }]}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[
                            styles.updatingText,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.medium,
                                fontSize: fontSize.sm,
                                includeFontPadding: false,
                                marginLeft: 8
                            }
                        ]}>
                            Updating...
                        </Text>
                    </View>
                </View>
            )}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {SETTINGS_SECTIONS.map((section) => (
                        <View key={section.title} style={styles.section}>
                            <Text style={[
                                styles.sectionTitle,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                    includeFontPadding: false
                                }
                            ]}>
                                {section.title}
                            </Text>

                            <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
                                {section.items.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.label}
                                        style={[
                                            styles.settingItem,
                                            index !== section.items.length - 1 && {
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.border,
                                            },
                                        ]}
                                        onPress={() => handleNavigation(item.route, item.action)}
                                        disabled={isLoading}>
                                        <View style={styles.settingItemLeft}>
                                            <View style={[styles.iconContainer, { backgroundColor: 'transparent' }]}>
                                                <item.icon size={20} color={colors.textPrimary} />
                                            </View>
                                            <Text style={[
                                                styles.settingItemLabel,
                                                {
                                                    color: colors.textPrimary,
                                                    fontFamily: fonts.regular,
                                                    fontSize: fontSize.md,
                                                    includeFontPadding: false
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
                </View>
            </ScrollView>

            <ProfileVisibilityModal
                visible={showVisibilityModal}
                onClose={() => setShowVisibilityModal(false)}
                selectedVisibility={memberSettings?.security.public_profile ? 'public' : 'private'}
                onSelect={handleVisibilityChange}
            />

            <AdultContentModal
                visible={showAdultContentModal}
                onClose={() => setShowAdultContentModal(false)}
                initialSettings={{ enabled: memberSettings?.content_preferences.adult_content || false }}
                onSave={handleAdultContentChange}
            />

            <LanguagePicker
                visible={showLanguagePicker}
                onClose={() => setShowLanguagePicker(false)}
                onSelect={handleLanguageChange}
                selectedCode={memberSettings?.content_preferences.language}
            />

            <AuthenticatorModal
                visible={showAuthenticatorModal}
                onClose={() => setShowAuthenticatorModal(false)}
                isEnabled={isAuthenticatorEnabled}
                onToggle={setIsAuthenticatorEnabled}
            />

            <DeviceManagementModal
                visible={showDeviceManagementModal}
                onClose={() => setShowDeviceManagementModal(false)}
                devices={devices}
                onLogoutDevice={handleLogoutDevice}
                onLogoutAllDevices={handleLogoutAllDevices}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
    },
    updatingOverlay: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        zIndex: 1000,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    updatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    updatingText: {
        textAlign: 'center',
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
        padding: 12,
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