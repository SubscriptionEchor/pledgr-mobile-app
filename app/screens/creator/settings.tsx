import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useRouter } from 'expo-router';
import { Settings, CreditCard, HardDrive, Eye, Bell, Users, Ban, ChevronRight, Lightbulb, FileText, Lock } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ProfileVisibilityModal } from '@/components/ProfileVisibilityModal';
import { ProfileVisibility } from '@/lib/enums';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

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
  {
    title: 'Others',
    items: [
      {
        id: 'feature-request',
        label: 'Feature Request',
        icon: Lightbulb,
        route: '/screens/member/feature-request',
      },
      {
        id: 'terms',
        label: 'Terms of Service',
        icon: FileText,
        route: '/screens/common/terms',
      },
      {
        id: 'privacy',
        label: 'Privacy Policy',
        icon: Lock,
        route: '/screens/common/privacy',
      },
    ],
  },
];

export default function SettingsScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const { user } = useAuth();
  const { creatorSettings, isLoading, fetchCreatorSettings } = useCreatorSettings();

  useEffect(() => {
    fetchCreatorSettings();
  }, []);

  const handleNavigation = (route?: string, action?: string) => {
    if (action === 'visibility') {
      setShowVisibilityModal(true);
    } else if (route) {
      router.push(route);
    }
  };

  if (isLoading && !creatorSettings) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SubHeader title="Creator Settings" />
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
      <SubHeader title="Creator Settings" />
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
        selectedVisibility={creatorSettings?.campaign_details.owner_settings.shop_visibility ? ProfileVisibility.PUBLIC : ProfileVisibility.PRIVATE}
        onSelect={() => {}} // We don't need this anymore since the modal handles the update internally
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
