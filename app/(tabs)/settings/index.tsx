import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { 
  User, 
  Shield, 
  Moon,
  Bell,
  Globe,
  Lock,
  Key,
  Languages,
  Palette,
  ChevronRight,
  FileText,
  Lightbulb
} from 'lucide-react-native';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    icon: User,
    color: '#60a5fa',
    items: [
      { label: 'Profile Information', icon: User },
      { label: 'Language', icon: Languages },
      { label: 'Notifications', icon: Bell },
    ]
  },
  {
    title: 'Preferences',
    icon: Palette,
    color: '#f59e0b',
    items: [
      { label: 'Appearance', icon: Moon },
      { label: 'Region', icon: Globe },
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    color: '#ef4444',
    items: [
      { label: 'Password', icon: Key },
      { label: 'Privacy', icon: Lock },
    ]
  },
  {
    title: 'Support',
    icon: FileText,
    color: '#22c55e',
    items: [
      { label: 'Terms of Service', icon: FileText },
      { label: 'Feature Request', icon: Lightbulb },
    ]
  }
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleNavigation = (label: string) => {
    switch (label) {
      case 'Profile Information':
        router.push('/settings/profile');
        break;
      case 'Terms of Service':
        // Implement terms of service navigation
        break;
      case 'Feature Request':
        // Implement feature request navigation
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Settings" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {SETTINGS_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: `${section.color}20` }]}>
                  <section.icon size={20} color={section.color} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {section.title}
                </Text>
              </View>
              <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => handleNavigation(item.label)}
                    style={[
                      styles.settingItem,
                      index !== section.items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}>
                    <View style={styles.settingItemLeft}>
                      <item.icon size={20} color={colors.textSecondary} />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
});