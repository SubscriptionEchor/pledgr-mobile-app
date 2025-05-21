import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Users, Shield, Activity, Settings, HelpCircle, ChevronLeft } from 'lucide-react-native';
import { StatusBarComponent } from '@/components/StatusBarComponent';

const MENU_ITEMS = [
  { id: 'audience', icon: Users, label: 'Audience', description: 'View and manage your audience' },
  { id: 'moderation', icon: Shield, label: 'Moderation Hub', description: 'Manage content and user reports' },
  { id: 'activity', icon: Activity, label: 'Activity', description: 'View recent activities and events' },
  { id: 'settings', icon: Settings, label: 'Settings', description: 'Customize your experience' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', description: 'Get assistance and support' },
];

export default function MenuScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();

  const handleBack = () => router.back();

  const handleItemPress = (id: string) => {
    // Navigate to the appropriate screen based on ID
    if (id === 'moderation') {
      // Use direct navigation to the moderation screen
      router.push('/screens/creator/moderation' as any);
    } else if (id === 'activity') {
      router.push('/screens/creator/activity' as any);
    } else if (id === 'settings') {
      router.push('/screens/creator/settings' as any);
    } else if (id === 'help') {
      router.push('/screens/creator/help' as any);
    } else if (id === 'audience') {
      router.push('/screens/creator/audience' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBarComponent />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.xl }]}>
          Menu
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Menu List */}
        <View style={styles.section}>
          {MENU_ITEMS.map((item, idx) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.row} onPress={() => handleItemPress(item.id)}>
                <item.icon size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
                <View style={styles.itemContent}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: fontSize.lg }}>
                    {item.label}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
              {idx < MENU_ITEMS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  itemContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginLeft: 62,
  },
});