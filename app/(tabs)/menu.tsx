import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Download, History, Heart, Bell, Wallet, Settings, CircleHelp as HelpCircle, UserX } from 'lucide-react-native';

const MENU_ITEMS = [
  {
    icon: Download,
    label: 'Downloads',
    description: 'Access your offline content',
    color: '#60a5fa',
  },
  {
    icon: History,
    label: 'History',
    description: 'View your activity history',
    color: '#f59e0b',
  },
  {
    icon: Heart,
    label: 'Liked',
    description: 'Your favorite content',
    color: '#ef4444',
  },
  {
    icon: Bell,
    label: 'Notifications',
    description: 'Manage your alerts',
    color: '#22c55e',
  },
  {
    icon: Wallet,
    label: 'Wallet',
    description: 'Manage your payments',
    color: '#9333ea',
  },
  {
    icon: UserX,
    label: 'Blocked Users',
    description: 'Manage blocked accounts',
    color: '#dc2626',
  },
  {
    icon: Settings,
    label: 'Settings',
    description: 'Customize your experience',
    color: '#64748b',
  },
  {
    icon: HelpCircle,
    label: 'Help & Support',
    description: 'Get assistance',
    color: '#0ea5e9',
  },
];

export default function MenuScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleItemPress = (label: string) => {
    if (label === 'Settings') {
      router.push('/(tabs)/settings');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.grid}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => handleItemPress(item.label)}
                style={[
                  styles.card,
                  { backgroundColor: colors.surface },
                ]}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                  <item.icon size={24} color={item.color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.menuItemLabel, { color: colors.textPrimary }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  },
  grid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: 160,
    maxWidth: '48%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardContent: {
    gap: 4,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});