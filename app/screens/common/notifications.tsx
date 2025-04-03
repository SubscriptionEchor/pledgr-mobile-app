import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { Bell, Mail, Tag, MessageSquare, Users, Store, Share2, ThumbsUp, MessageCircle, DollarSign, ArrowUpDown, Circle as XCircle } from 'lucide-react-native';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';

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
    const isCreator = user?.role === UserRole.CREATOR;

    const [memberSettings, setMemberSettings] = useState<NotificationSetting[]>([
        {
            id: 'marketing',
            title: 'Marketing',
            description: 'Product updates and community announcements',
            icon: Bell,
            enabled: true,
        },
        {
            id: 'newsletter',
            title: 'Member Newsletter',
            description: 'Weekly digest of platform highlights',
            icon: Mail,
            enabled: true,
        },
        {
            id: 'offers',
            title: 'Special Offers',
            description: 'Special offers and promotions',
            icon: Tag,
            enabled: false,
        },
        {
            id: 'creator_updates',
            title: 'Creator Updates',
            description: 'General creator updates and announcements',
            icon: Users,
            enabled: true,
        },
        {
            id: 'comments',
            title: 'Comment Replies',
            description: 'Replies to your comments',
            icon: MessageSquare,
            enabled: true,
        },
    ]);

    const [creatorSettings, setCreatorSettings] = useState({
        notificationFeed: {
            posts: {
                title: 'Posts, comments and messages',
                items: [
                    { id: 'post_likes', title: 'Likes on posts, comments and messages', enabled: true },
                    { id: 'post_comments', title: 'Comments and replies on posts', enabled: true },
                    { id: 'chat_messages', title: 'Chat messages and replies', enabled: true },
                ]
            },
            memberships: {
                title: 'Memberships',
                items: [
                    { id: 'free_members', title: 'New Free Members', enabled: true },
                    { id: 'paid_members', title: 'New paid members', enabled: true },
                    { id: 'upgraded_members', title: 'Upgraded members', enabled: true },
                    { id: 'downgraded_members', title: 'Downgraded members', enabled: true },
                    { id: 'cancelled_members', title: 'Cancelled members', enabled: true },
                ]
            }
        },
        email: {
            posts: {
                title: 'Posts, comments and messages',
                items: [
                    { id: 'email_new_post', title: 'Every time you post', enabled: true },
                    { id: 'email_comments', title: 'Comments and replies on posts', enabled: true },
                    { id: 'email_messages', title: 'Direct messages', enabled: true },
                ]
            },
            memberships: {
                title: 'Memberships',
                items: [
                    { id: 'email_paid_members', title: 'New paid members', enabled: true }
                ]
            },
            shop: {
                title: 'Shop purchases',
                items: [
                    { id: 'shop_purchases', title: 'When someone buys a product from your shop', enabled: true }
                ]
            },
            reminders: {
                title: 'Reminders to share',
                items: [
                    { id: 'share_reminders', title: 'When a clip of your post is ready to be shared', enabled: true }
                ]
            }
        }
    });

    const toggleMemberSetting = (id: string) => {
        setMemberSettings(settings =>
            settings.map(setting =>
                setting.id === id
                    ? { ...setting, enabled: !setting.enabled }
                    : setting
            )
        );
    };

    const toggleCreatorSetting = (section: 'notificationFeed' | 'email', category: string, id: string) => {
        setCreatorSettings(prev => {
            const newSettings = { ...prev };
            const items = newSettings[section][category].items;
            const itemIndex = items.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                items[itemIndex] = { ...items[itemIndex], enabled: !items[itemIndex].enabled };
            }
            return newSettings;
        });
    };

    const renderCreatorSection = (
        title: string,
        items: Array<{ id: string; title: string; enabled: boolean }>,
        section: 'notificationFeed' | 'email',
        category: string
    ) => (
        <View style={styles.section}>
            <Text style={[
                styles.sectionTitle,
                {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                }
            ]}>
                {title}
            </Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
                {items.map((item, index) => (
                    <View
                        key={item.id}
                        style={[
                            styles.settingItem,
                            index !== items.length - 1 && {
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                            },
                        ]}>
                        <Text style={[
                            styles.settingTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.md,
                                includeFontPadding: false,
                                width: "80%"
                            }
                        ]}>
                            {item.title}
                        </Text>
                        <Switch
                            value={item.enabled}
                            onValueChange={() => toggleCreatorSetting(section, category, item.id)}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                ))}
            </View>
        </View>
    );

    if (isCreator) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <SubHeader title="Notifications" />
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={[
                            styles.title,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.bold,
                                fontSize: fontSize.xl,
                                includeFontPadding: false
                            }
                        ]}>
                            Notification Feed
                        </Text>
                    </View>

                    {renderCreatorSection(
                        creatorSettings.notificationFeed.posts.title,
                        creatorSettings.notificationFeed.posts.items,
                        'notificationFeed',
                        'posts'
                    )}

                    {renderCreatorSection(
                        creatorSettings.notificationFeed.memberships.title,
                        creatorSettings.notificationFeed.memberships.items,
                        'notificationFeed',
                        'memberships'
                    )}

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.header}>
                        <Text style={[
                            styles.title,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.bold,
                                fontSize: fontSize.xl,
                                includeFontPadding: false
                            }
                        ]}>
                            Email
                        </Text>
                    </View>

                    {renderCreatorSection(
                        creatorSettings.email.posts.title,
                        creatorSettings.email.posts.items,
                        'email',
                        'posts'
                    )}

                    {renderCreatorSection(
                        creatorSettings.email.memberships.title,
                        creatorSettings.email.memberships.items,
                        'email',
                        'memberships'
                    )}

                    {renderCreatorSection(
                        creatorSettings.email.shop.title,
                        creatorSettings.email.shop.items,
                        'email',
                        'shop'
                    )}

                    {renderCreatorSection(
                        creatorSettings.email.reminders.title,
                        creatorSettings.email.reminders.items,
                        'email',
                        'reminders'
                    )}

                    <TouchableOpacity style={styles.marketingLink}>
                        <Text style={[
                            styles.marketingText,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.sm,
                                includeFontPadding: false
                            }
                        ]}>
                            Edit your preferences on{' '}
                            <Text style={{ color: colors.primary, includeFontPadding: false }}>
                                marketing email settings
                            </Text>
                            .
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Return existing member notification UI
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
                        {memberSettings.map((setting) => (
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
                                    onValueChange={() => toggleMemberSetting(setting.id)}
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
    section: {
        gap: 12,
    },
    sectionTitle: {
        marginLeft: 4,
    },
    sectionContent: {
        borderRadius: 16,
        overflow: 'hidden',
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
        paddingHorizontal: 20,
    },
    divider: {
        height: 1,
        marginVertical: 24,
    },
    marketingLink: {
        marginTop: 8,
        alignItems: 'center',
    },
    marketingText: {
        textAlign: 'center',
        lineHeight: 20,
    },
});