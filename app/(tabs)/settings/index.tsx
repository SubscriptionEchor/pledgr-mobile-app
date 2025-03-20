import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { ProfileVisibilityModal } from '@/components/ProfileVisibilityModal';
import { AdultContentModal } from '@/components/AdultContentModal';
import { LanguagePicker } from '@/components/LanguagePicker';
import { AuthenticatorModal } from '@/components/AuthenticatorModal';
import { DeviceManagementModal } from '@/components/DeviceManagementModal';
import { User, Key, Languages, Bell, Shield, Smartphone, Crown, FileText, Lightbulb, Lock, ChevronRight, Eye, TriangleAlert as AlertTriangle } from 'lucide-react-native';

const MOCK_DEVICES = [
  {
    id: '1',
    name: 'MacBook Pro',
    type: 'desktop',
    location: 'San Francisco, US',
    lastActive: 'Active now',
    isCurrentDevice: true,
  },
  {
    id: '2',
    name: 'iPhone 14',
    type: 'mobile',
    location: 'San Francisco, US',
    lastActive: '2 hours ago',
    isCurrentDevice: false,
  },
  {
    id: '3',
    name: 'iPad Pro',
    type: 'tablet',
    location: 'New York, US',
    lastActive: '3 days ago',
    isCurrentDevice: false,
  },
];

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Profile', icon: User, route: '/settings/profile' },
      { label: 'Change Password', icon: Key, route: '/settings/change-password' }
    ]
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Profile Visibility', icon: Eye, action: 'visibility' },
      { label: 'Adult Content', icon: AlertTriangle, action: 'adult-content' },
      { label: 'Language', icon: Languages, action: 'language' },
      { label: 'Notifications', icon: Bell, route: '/settings/notifications' }
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
      { label: 'Subscription', icon: Crown, route: '/settings/subscription' }
    ]
  },
  {
    title: 'Others',
    items: [
      { label: 'Feature Request', icon: Lightbulb, route: '/settings/feature-request' },
      { label: 'Terms of Service', icon: FileText, route: '/settings/terms' },
      { label: 'Privacy Policy', icon: Lock, route: '/settings/privacy' }
    ]
  }
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showAdultContentModal, setShowAdultContentModal] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showAuthenticatorModal, setShowAuthenticatorModal] = useState(false);
  const [showDeviceManagementModal, setShowDeviceManagementModal] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState('public');
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'en',
    name: 'English'
  });
  const [adultContentSettings, setAdultContentSettings] = useState({
    enabled: false
  });
  const [isAuthenticatorEnabled, setIsAuthenticatorEnabled] = useState(false);
  const [devices, setDevices] = useState(MOCK_DEVICES);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Settings" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {SETTINGS_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {section.title}
              </Text>
              <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => handleNavigation(item.route, item.action)}
                    style={[
                      styles.settingItem,
                      index !== section.items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}>
                    <View style={styles.settingItemLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                        <item.icon size={20} color={colors.textPrimary} />
                      </View>
                      <Text style={[styles.settingItemLabel, { color: colors.textPrimary }]}>
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
        selectedVisibility={selectedVisibility}
        onSelect={setSelectedVisibility}
      />

      <AdultContentModal
        visible={showAdultContentModal}
        onClose={() => setShowAdultContentModal(false)}
        initialSettings={adultContentSettings}
        onSave={setAdultContentSettings}
      />

      <LanguagePicker
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        onSelect={(language) => {
          setSelectedLanguage(language);
          setShowLanguagePicker(false);
        }}
        selectedCode={selectedLanguage.code}
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
    fontSize: 16,
    fontWeight: '600',
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
  },
  settingItemLabel: {
    fontSize: 15,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});