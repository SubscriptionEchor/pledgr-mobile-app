import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState, useEffect } from 'react';
import { Bell, Mail, Tag, MessageSquare, Users, Store, Eye, Shield } from 'lucide-react-native';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { useMemberSettings } from '@/hooks/useMemberSettings';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

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
  const { memberSettings, updateMemberSettings, isLoading: isMemberLoading } = useMemberSettings();
  const { creatorSettings, updateCreatorNotifications, isLoading: isCreatorLoading, fetchCreatorSettings } = useCreatorSettings();
  const isCreator = user?.role === UserRole.CREATOR;

  const [memberNotificationSettings, setMemberNotificationSettings] = useState<NotificationSetting[]>([]);
  const [creatorEmailSettings, setCreatorEmailSettings] = useState<NotificationSetting[]>([]);
  const [creatorFeedSettings, setCreatorFeedSettings] = useState<NotificationSetting[]>([]);

  useEffect(() => {
    if (isCreator) {
      fetchCreatorSettings();
    }
  }, [isCreator]);

  useEffect(() => {
    if (isCreator) {
      // Initialize creator settings
      if (creatorSettings) {
        const { notification_preferences } = creatorSettings.campaign_details.owner_settings;
        
        // Email notifications
        setCreatorEmailSettings([
          {
            id: 'receive_email_on_post',
            title: 'New Posts',
            description: 'Get notified when you publish a new post',
            icon: Mail,
            enabled: notification_preferences.email.receive_email_on_post,
          },
          {
            id: 'receive_email_on_comments',
            title: 'Comments',
            description: 'Get notified about comments on your posts',
            icon: MessageSquare,
            enabled: notification_preferences.email.receive_email_on_comments,
          },
          {
            id: 'receive_email_on_direct_message',
            title: 'Direct Messages',
            description: 'Get notified about new direct messages',
            icon: Mail,
            enabled: notification_preferences.email.receive_email_on_direct_message,
          },
          {
            id: 'receive_email_on_new_paid_member',
            title: 'New Paid Members',
            description: 'Get notified when you get a new paid member',
            icon: Users,
            enabled: notification_preferences.email.receive_email_on_new_paid_member,
          },
          {
            id: 'receive_email_on_shop_purchases',
            title: 'Shop Purchases',
            description: 'Get notified about new shop purchases',
            icon: Store,
            enabled: notification_preferences.email.receive_email_on_shop_purchases,
          },
          {
            id: 'receive_email_on_reminder_to_share',
            title: 'Share Reminders',
            description: 'Get reminders to share your content',
            icon: Eye,
            enabled: notification_preferences.email.receive_email_on_reminder_to_share,
          },
        ]);

        // Feed notifications
        setCreatorFeedSettings([
          {
            id: 'receive_notification_on_likes',
            title: 'Likes',
            description: 'Get notified about likes on your content',
            icon: Bell,
            enabled: notification_preferences.notification_feed.receive_notification_on_likes,
          },
          {
            id: 'receive_notification_on_comments',
            title: 'Comments',
            description: 'Get notified about comments on your content',
            icon: MessageSquare,
            enabled: notification_preferences.notification_feed.receive_notification_on_comments,
          },
          {
            id: 'receive_notification_on_chat_messages',
            title: 'Chat Messages',
            description: 'Get notified about new chat messages',
            icon: MessageSquare,
            enabled: notification_preferences.notification_feed.receive_notification_on_chat_messages,
          },
          {
            id: 'receive_notification_on_new_free_members',
            title: 'New Free Members',
            description: 'Get notified about new free members',
            icon: Users,
            enabled: notification_preferences.notification_feed.receive_notification_on_new_free_members,
          },
          {
            id: 'receive_notification_on_new_paid_members',
            title: 'New Paid Members',
            description: 'Get notified about new paid members',
            icon: Shield,
            enabled: notification_preferences.notification_feed.receive_notification_on_new_paid_members,
          },
          {
            id: 'receive_notification_on_upgraded_members',
            title: 'Member Upgrades',
            description: 'Get notified when members upgrade their tier',
            icon: Users,
            enabled: notification_preferences.notification_feed.receive_notification_on_upgraded_members,
          },
          {
            id: 'receive_notification_on_downgraded_members',
            title: 'Member Downgrades',
            description: 'Get notified when members downgrade their tier',
            icon: Users,
            enabled: notification_preferences.notification_feed.receive_notification_on_downgraded_members,
          },
          {
            id: 'receive_notification_on_cancelled_members',
            title: 'Membership Cancellations',
            description: 'Get notified when members cancel their subscription',
            icon: Users,
            enabled: notification_preferences.notification_feed.receive_notification_on_cancelled_members,
          },
        ]);
      }
    } else {
      // Initialize member settings
      if (memberSettings) {
        setMemberNotificationSettings([
          {
            id: 'marketing',
            title: 'Marketing',
            description: 'Product updates and community announcements',
            icon: Bell,
            enabled: memberSettings.notification_preferences.email.marketing,
          },
          {
            id: 'newsletter',
            title: 'Member Newsletter',
            description: 'Weekly digest of platform highlights',
            icon: Mail,
            enabled: memberSettings.notification_preferences.email.newsletter,
          },
          {
            id: 'special_offers',
            title: 'Special Offers',
            description: 'Special offers and promotions',
            icon: Tag,
            enabled: memberSettings.notification_preferences.email.special_offers,
          },
          {
            id: 'creator_updates',
            title: 'Creator Updates',
            description: 'General creator updates and announcements',
            icon: Users,
            enabled: memberSettings.notification_preferences.email.creator_updates,
          },
          {
            id: 'comment_replies',
            title: 'Comment Replies',
            description: 'Replies to your comments',
            icon: MessageSquare,
            enabled: memberSettings.notification_preferences.email.comment_replies,
          },
        ]);
      }
    }
  }, [memberSettings, creatorSettings, isCreator]);

  const handleMemberToggle = async (id: string) => {
    // Update state immediately
    setMemberNotificationSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));

    try {
      // Create updated settings object with all existing settings plus changes
      const { type, ...settingsWithoutType } = memberSettings || {};
      const updatedSettings = {
        ...settingsWithoutType,
        notification_preferences: {
          email: {
            ...settingsWithoutType.notification_preferences.email,
            [id]: !settingsWithoutType.notification_preferences.email[id as keyof typeof settingsWithoutType.notification_preferences.email]
          }
        },
        security: {
          ...settingsWithoutType.security,
        },
        social_media: {
          ...settingsWithoutType.social_media,
        },
        content_preferences: {
          ...settingsWithoutType.content_preferences,
        }
      };

      await updateMemberSettings(updatedSettings);
    } catch (error) {
      // Revert state if API call fails
      setMemberNotificationSettings(prev => prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      ));
      console.error('Error updating notification settings:', error);
    }
  };

  const handleCreatorToggle = async (type: 'email' | 'feed', id: string) => {
  if (!creatorSettings) return;
  
  // Update UI state immediately
  if (type === 'email') {
    setCreatorEmailSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  } else {
    setCreatorFeedSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  }

  try {
    // Get the current notification preferences
    const currentEmailPrefs = creatorSettings.campaign_details.owner_settings.notification_preferences.email;
    const currentFeedPrefs = creatorSettings.campaign_details.owner_settings.notification_preferences.notification_feed;
    const currentValue = type === 'email' 
      ? currentEmailPrefs[id as keyof typeof currentEmailPrefs]
      : currentFeedPrefs[id as keyof typeof currentFeedPrefs];

    // Construct the complete payload
    const payload = {
      notification_preferences: {
        email: {
          receive_email_on_post: currentEmailPrefs.receive_email_on_post,
          receive_email_on_comments: currentEmailPrefs.receive_email_on_comments,
          receive_email_on_direct_message: currentEmailPrefs.receive_email_on_direct_message,
          receive_email_on_new_paid_member: currentEmailPrefs.receive_email_on_new_paid_member,
          receive_email_on_shop_purchases: currentEmailPrefs.receive_email_on_shop_purchases,
          receive_email_on_reminder_to_share: currentEmailPrefs.receive_email_on_reminder_to_share,
          ...(type === 'email' ? { [id]: !currentValue } : {})
        },
        notification_feed: {
          receive_notification_on_likes: currentFeedPrefs.receive_notification_on_likes,
          receive_notification_on_comments: currentFeedPrefs.receive_notification_on_comments,
          receive_notification_on_chat_messages: currentFeedPrefs.receive_notification_on_chat_messages,
          receive_notification_on_new_free_members: currentFeedPrefs.receive_notification_on_new_free_members,
          receive_notification_on_new_paid_members: currentFeedPrefs.receive_notification_on_new_paid_members,
          receive_notification_on_upgraded_members: currentFeedPrefs.receive_notification_on_upgraded_members,
          receive_notification_on_downgraded_members: currentFeedPrefs.receive_notification_on_downgraded_members,
          receive_notification_on_cancelled_members: currentFeedPrefs.receive_notification_on_cancelled_members,
          ...(type === 'feed' ? { [id]: !currentValue } : {})
        }
      },
      marketing_preferences: {
        receive_marketing_emails: creatorSettings.campaign_details.owner_settings.marketing_preferences.receive_marketing_emails
      },
      published: creatorSettings.campaign_details.owner_settings.published,
      shop_visibility: creatorSettings.campaign_details.owner_settings.shop_visibility
    };
    
    // Call the update function with the complete payload
    await updateCreatorNotifications(payload);
  } catch (error) {
    // Revert UI state if API call fails
    if (type === 'email') {
      setCreatorEmailSettings(prev => prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      ));
    } else {
      setCreatorFeedSettings(prev => prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      ));
    }
    console.error('Error updating notification settings:', error);
  }
};


  if ((isCreator && isCreatorLoading && !creatorSettings) || (!isCreator && isMemberLoading && !memberSettings)) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SubHeader title="Notifications" />
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
            Loading notification settings...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Notifications" />
      {(isCreator ? isCreatorLoading : isMemberLoading) && (
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

          {isCreator ? (
            // Creator notification settings
            <>
              <View style={styles.section}>
                <Text style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.lg,
                    includeFontPadding: false
                  }
                ]}>
                  Email Notifications
                </Text>
                <View style={styles.settings}>
                  {creatorEmailSettings.map((setting) => (
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
                        onValueChange={() => handleCreatorToggle('email', setting.id)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor="#FFFFFF"
                        disabled={isCreatorLoading}
                      />
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.lg,
                    includeFontPadding: false
                  }
                ]}>
                  Feed Notifications
                </Text>
                <View style={styles.settings}>
                  {creatorFeedSettings.map((setting) => (
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
                        onValueChange={() => handleCreatorToggle('feed', setting.id)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor="#FFFFFF"
                        disabled={isCreatorLoading}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            // Member notification settings
            <View style={styles.settings}>
              {memberNotificationSettings.map((setting) => (
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
                    onValueChange={() => handleMemberToggle(setting.id)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#FFFFFF"
                    disabled={isMemberLoading}
                  />
                </View>
              ))}
            </View>
          )}

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
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 4,
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