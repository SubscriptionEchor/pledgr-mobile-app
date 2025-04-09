import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Globe, Users, Lock, TriangleAlert as AlertTriangle, Store, Eye } from 'lucide-react-native';
import { useState } from 'react';
import { ProfileVisibility } from '@/lib/enums';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { useMemberSettings } from '@/hooks/useMemberSettings';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

interface ProfileVisibilityModalProps {
  visible: boolean;
  onClose: () => void;
  selectedVisibility: string;
  onSelect: (visibility: string) => void;
}

export function ProfileVisibilityModal({
  visible,
  onClose,
  selectedVisibility,
  onSelect
}: ProfileVisibilityModalProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [isPublic, setIsPublic] = useState(selectedVisibility === ProfileVisibility.PUBLIC);
  const { user } = useAuth();
  const { memberSettings, updateMemberSettings, isLoading: isMemberLoading } = useMemberSettings();
  const { creatorSettings, updateCreatorNotifications, isLoading: isCreatorLoading } = useCreatorSettings();

  const isCreator = user?.role === UserRole.CREATOR;
  const isLoading = isCreator ? isCreatorLoading : isMemberLoading;

  const handleToggle = async (value: boolean) => {
    // Update state immediately
    setIsPublic(value);
    onSelect(value ? ProfileVisibility.PUBLIC : ProfileVisibility.PRIVATE);

    try {
      if (isCreator) {
        // Handle creator settings update
        const payload = {
          notification_preferences: {
            email: creatorSettings?.campaign_details.owner_settings.notification_preferences.email || {},
            notification_feed: creatorSettings?.campaign_details.owner_settings.notification_preferences.notification_feed || {}
          },
          marketing_preferences: {
            receive_marketing_emails: creatorSettings?.campaign_details.owner_settings.marketing_preferences.receive_marketing_emails || false
          },
          published: creatorSettings?.campaign_details.owner_settings.published || false,
          shop_visibility: value // This is the only value we're updating
        };

        await updateCreatorNotifications(payload);
      } else {
        // Handle member settings update (existing functionality)
        const { type, ...settingsWithoutType } = memberSettings || {};
        const updatedSettings = {
          ...settingsWithoutType,
          security: {
            ...settingsWithoutType.security,
            public_profile: value
          },
          social_media: {
            ...settingsWithoutType.social_media,
          },
          content_preferences: {
            ...settingsWithoutType.content_preferences,
          },
          notification_preferences: {
            ...settingsWithoutType.notification_preferences,
          }
        };
        await updateMemberSettings(updatedSettings);
      }
    } catch (error) {
      // Revert state if API call fails
      setIsPublic(!value);
      onSelect(!value ? ProfileVisibility.PUBLIC : ProfileVisibility.PRIVATE);
      console.error('Error updating visibility:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
            Profile Visibility
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[
                styles.loadingText,
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.warningBox, { backgroundColor: `${colors.warning}15` }]}>
            <AlertTriangle size={24} color={colors.warning} />
            <Text style={[
              styles.warningText,
              {
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Choose who can see your {isCreator ? 'shop and ' : ''}profile content. You can change this at any time.
            </Text>
          </View>

          {isCreator ? (
            <>
              <View style={[styles.toggleContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.toggleContent}>
                  <Text style={[
                    styles.toggleTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.lg,
                      includeFontPadding: false
                    }
                  ]}>
                    Shop Visibility
                  </Text>
                  <Text style={[
                    styles.toggleDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Make your shop and products visible to the public
                  </Text>
                </View>
                <Switch
                  value={creatorSettings?.campaign_details.owner_settings.shop_visibility || false}
                  onValueChange={handleToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                  disabled={isLoading}
                />
              </View>

              <View style={[styles.infoBox, { backgroundColor: isPublic ? `${colors.primary}15` : `${colors.warning}15` }]}>
                <View style={[styles.infoIcon, { backgroundColor: isPublic ? colors.primary : colors.warning }]}>
                  {isPublic ? (
                    <Store size={20} color={colors.buttonText} />
                  ) : (
                    <Lock size={20} color={colors.buttonText} />
                  )}
                </View>
                <Text style={[
                  styles.infoText,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  {isPublic ? (
                    'Your shop is visible to everyone'
                  ) : (
                    'Your shop is hidden from the public'
                  )}
                </Text>
              </View>

              {!isPublic && (
                <View style={styles.restrictions}>
                  <Text style={[
                    styles.restrictionsTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    When visibility is off:
                  </Text>
                  <View style={styles.restrictionsList}>
                    <Text style={[
                      styles.restrictionItem,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      • Products will no longer be visible to the public but customers who have already purchased products will still have access to them
                    </Text>
                    <Text style={[
                      styles.restrictionItem,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      • Posts and collections will remain visible on your page but no longer appear in the shop tab
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <>
              <View style={[styles.toggleContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.toggleContent}>
                  <Text style={[
                    styles.toggleTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.lg,
                      includeFontPadding: false
                    }
                  ]}>
                    Public Profile
                  </Text>
                  <Text style={[
                    styles.toggleDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Allow anyone to view your profile and content
                  </Text>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={handleToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                  disabled={isLoading}
                />
              </View>

              <Text style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.lg,
                  marginTop: 24,
                  includeFontPadding: false
                }
              ]}>
                What this means:
              </Text>

              <View style={styles.infoCards}>
                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                  <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                    <Globe size={24} color={colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[
                      styles.infoTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Public Profile
                    </Text>
                    <Text style={[
                      styles.infoDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Your profile, posts, and activity are visible to everyone
                    </Text>
                  </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                  <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                    <Users size={24} color={colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[
                      styles.infoTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Engagement
                    </Text>
                    <Text style={[
                      styles.infoDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Anyone can follow you and interact with your content
                    </Text>
                  </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                  <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                    <Lock size={24} color={colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[
                      styles.infoTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Privacy Control
                    </Text>
                    <Text style={[
                      styles.infoDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      You can still block specific users and control who can message you
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
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
  loadingText: {
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  warningText: {
    flex: 1,
    lineHeight: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  toggleContent: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    marginBottom: 4,
  },
  toggleDescription: {
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
  restrictions: {
    marginTop: 8,
    gap: 12,
  },
  restrictionsTitle: {
    marginBottom: 4,
  },
  restrictionsList: {
    gap: 8,
  },
  restrictionItem: {
    lineHeight: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    marginBottom: 4,
  },
  infoDescription: {
    lineHeight: 22,
  },
});

export { ProfileVisibilityModal }