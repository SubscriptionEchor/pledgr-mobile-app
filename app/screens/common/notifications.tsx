import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState, useEffect } from 'react';
import { Bell, Mail, Tag, MessageSquare, Users, Store, Share2, ThumbsUp, MessageCircle, DollarSign, ArrowUpDown, Circle as XCircle } from 'lucide-react-native';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { useMemberSettings } from '@/hooks/useMemberSettings';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    icon: any;
    enabled: boolean;
}

export default function NotificationsScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const { user } = useAuth();
    const { memberSettings, updateMemberSettings } = useMemberSettings();
    const isCreator = user?.role === UserRole.CREATOR;

    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
        {
            id: 'marketing',
            title: 'Marketing',
            description: 'Product updates and community announcements',
            icon: Bell,
            enabled: memberSettings?.notification_preferences.email.marketing || false,
        },
        {
            id: 'newsletter',
            title: 'Member Newsletter',
            description: 'Weekly digest of platform highlights',
            icon: Mail,
            enabled: memberSettings?.notification_preferences.email.newsletter || false,
        },
        {
            id: 'special_offers',
            title: 'Special Offers',
            description: 'Special offers and promotions',
            icon: Tag,
            enabled: memberSettings?.notification_preferences.email.special_offers || false,
        },
        {
            id: 'creator_updates',
            title: 'Creator Updates',
            description: 'General creator updates and announcements',
            icon: Users,
            enabled: memberSettings?.notification_preferences.email.creator_updates || false,
        },
        {
            id: 'comment_replies',
            title: 'Comment Replies',
            description: 'Replies to your comments',
            icon: MessageSquare,
            enabled: memberSettings?.notification_preferences.email.comment_replies || false,
        },
    ]);

    const handleToggle = async (id: string) => {
        try {
            const updatedSettings = {
                notification_preferences: {
                    email: {
                        ...memberSettings?.notification_preferences.email,
                        [id]: !memberSettings?.notification_preferences.email[id as keyof typeof memberSettings.notification_preferences.email]
                    }
                }
            };
            
            await updateMemberSettings(updatedSettings);
        } catch (error) {
            console.error('Error updating notification settings:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Notifications" />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={[
                                styles.title,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.xl,
                                    includeFontPadding: false
                                }
                            ]}>
                                Notification Preferences
                            </Text>
                            <Text style={[
                                styles.subtitle,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                Choose what notifications you want to receive
                            </Text>
                        </View>
                    </View>

                    <View style={styles.settings}>
                        {notificationSettings.map((setting) => (
                            <View
                                key={setting.id}
                                style={[
                                    styles.settingItem,
                                    { backgroundColor: colors.surface }
                                ]}>
                                <View style={styles.settingContent}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                        <setting.icon size={20} color={colors.primary} />
                                    </View>
                                    <View style={styles.settingText}>
                                        <Text style={[
                                            styles.settingTitle,
                                            {
                                                color: colors.textPrimary,
                                                fontFamily: fonts.semibold,
                                                fontSize: fontSize.md,
                                                includeFontPadding: false,
                                            }
                                        ]}>
                                            {setting.title}
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
                                            {setting.description}
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={setting.enabled}
                                    onValueChange={() => handleToggle(setting.id)}
                                    trackColor={{ false: colors.border, true: colors.primary }}
                                    thumbColor="#FFFFFF"
                                />
                            </View>
                        ))}
                    </View>

                    <Text style={[
                        styles.footer,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                        }
                    ]}>
                        You can change these preferences at any time. Email notifications will be sent to your registered email address.
                    </Text>
                </View>
            </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 20,
  },
  settings: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    marginBottom: 2,
  },
  settingDescription: {
    lineHeight: 20,
  },
  footer: {
    lineHeight: 20,
    textAlign: 'center',
  },
});