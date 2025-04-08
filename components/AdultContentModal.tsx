import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Globe, Users, Lock, TriangleAlert as AlertTriangle, Store, Eye, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { useMemberSettings } from '@/hooks/useMemberSettings';

interface AdultContentModalProps {
  visible: boolean;
  onClose: () => void;
  initialSettings: {
    enabled: boolean;
  };
  onSave: (settings: { enabled: boolean }) => void;
}

export function AdultContentModal({
  visible,
  onClose,
  initialSettings,
  onSave
}: AdultContentModalProps) {
  const { colors, fonts, fontSize } = useTheme();
  const { memberSettings, updateMemberSettings, isLoading } = useMemberSettings();
  const [enabled, setEnabled] = useState(initialSettings.enabled);

  const handleToggle = async (value: boolean) => {
    // Update state immediately
    setEnabled(value);
    onSave({ enabled: value });

    try {
      // Create updated settings object with all existing settings plus changes
      const { type, ...settingsWithoutType } = memberSettings || {};
      const updatedSettings = {
        ...settingsWithoutType,
        content_preferences: {
          ...settingsWithoutType.content_preferences,
          adult_content: value
        },
        security: {
          ...settingsWithoutType.security,
        },
        social_media: {
          ...settingsWithoutType.social_media,
        },
        notification_preferences: {
          ...settingsWithoutType.notification_preferences,
        }
      };

      await updateMemberSettings(updatedSettings);
    } catch (error) {
      // Revert state if API call fails
      setEnabled(!value);
      onSave({ enabled: !value });
      console.error('Error updating adult content settings:', error);
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
            Adult Content
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
              These settings control how adult content is displayed in your feed. Please adjust according to your preferences.
            </Text>
          </View>

          <View style={[styles.mainSetting, { backgroundColor: colors.surface }]}>
            <View style={styles.settingContent}>
              <Text style={[
                styles.settingTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.lg,
                  includeFontPadding: false
                }
              ]}>
                Show Adult Content
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
                Allow adult content to appear in your feed
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              disabled={isLoading}
            />
          </View>

          <View style={styles.infoSection}>
            <Text style={[
              styles.infoTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              What this means:
            </Text>

            <View style={styles.infoCards}>
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Eye size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[
                    styles.infoCardTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Content Filtering
                  </Text>
                  <Text style={[
                    styles.infoCardDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    Users will see explicit content like nudity or sexual themes from adult creators in their feed, per the platform's definition.
                  </Text>
                </View>
              </View>

              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[
                    styles.infoCardTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Safe Browsing
                  </Text>
                  <Text style={[
                    styles.infoCardDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    Automatic filtering, warnings, and blur effects for adult content will be turned off, showing unfiltered material.
                  </Text>
                </View>
              </View>

              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Globe size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[
                    styles.infoCardTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Recommendations
                  </Text>
                  <Text style={[
                    styles.infoCardDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    This will include adult content, tailoring the feed to mature themes based on user interactions.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0
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
    gap: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    lineHeight: 24,
  },
  mainSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    marginBottom: 4,
  },
  settingDescription: {
    lineHeight: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoTitle: {
    marginBottom: 4,
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    marginBottom: 2,
  },
  infoCardDescription: {
    lineHeight: 20,
  },
});