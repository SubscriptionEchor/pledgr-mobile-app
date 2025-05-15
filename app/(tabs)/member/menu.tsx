import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { ChevronLeft, Wifi, Fingerprint, PlayCircle, Circle, Flag, MessageCircle, HelpCircle, Shield, ChevronDown, ChevronUp, FileText, Lock, Info, Users, CreditCard, Crown, Gift, UserX, Settings, LogOut, User, Globe } from 'lucide-react-native';
import { useState } from 'react';

const SETTINGS_ITEMS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'memberships', icon: Crown, label: 'Memberships' },
  { id: 'preferences', icon: Globe, label: 'Preferences' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'referral', icon: Gift, label: 'Referral' },
  { id: 'blocked', icon: UserX, label: 'Blocked users' },
  { id: 'help', icon: HelpCircle, label: 'Help' },
];

const TERMS_ITEMS = [
  { id: 'terms', label: 'Terms of Service', icon: FileText },
  { id: 'privacy', label: 'Privacy Policy', icon: Lock },
  { id: 'manage-privacy', label: 'Manage account privacy', icon: Users },
];

export default function SettingsScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const [termsOpen, setTermsOpen] = useState(true);

  const handleBack = () => router.back();

  const handleSettingPress = (id: string) => {
    switch (id) {
      case 'security':
        router.push('/screens/member/security');
        break;
      case 'profile':
        router.push('/screens/member/profile');
        break;
      case 'memberships':
        router.push('/screens/member/subscription');
        break;
      case 'preferences':
        router.push('/screens/member/preferences');
        break;
      case 'referral':
        router.push('/screens/member/referral');
        break;
      case 'blocked':
        router.push('/screens/member/blocked-users');
        break;
      case 'help':
        router.push('/screens/member/help');
        break;
      default:
        break;
    }
  };

  const handleTermsPress = (id: string) => {
    // TODO: Implement navigation for each terms/privacy item
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.xl }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Settings List */}
        <View style={styles.section}>
          {SETTINGS_ITEMS.map((item, idx) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.row} onPress={() => handleSettingPress(item.id)}>
                <item.icon size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.lg, flex: 1 }}>{item.label}</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          ))}
        </View>
        {/* Terms and Privacy Collapsible */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={() => setTermsOpen(!termsOpen)}>
            <Shield size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.lg, flex: 1 }}>Terms and Privacy</Text>
            {termsOpen ? <ChevronUp size={22} color={colors.textSecondary} /> : <ChevronDown size={22} color={colors.textSecondary} />}
          </TouchableOpacity>
          {termsOpen && (
            <View style={styles.termsSection}>
              {TERMS_ITEMS.map((item, idx) => (
                <TouchableOpacity key={item.id} style={styles.termsRow} onPress={() => handleTermsPress(item.id)}>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutRow} onPress={() => { /* TODO: Implement sign out */ }}>
          <LogOut size={22} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.error, fontFamily: fonts.bold, fontSize: fontSize.md }}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 62,
  },
  termsSection: {
    marginLeft: 62,
    backgroundColor: 'transparent',
  },
  termsRow: {
    paddingVertical: 12,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
});