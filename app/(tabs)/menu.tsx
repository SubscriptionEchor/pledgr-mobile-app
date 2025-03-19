import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Download, History, Heart, Bell, Wallet, Settings, CircleHelp as HelpCircle, UserX } from 'lucide-react-native';

const MENU_ITEMS = [
  {
    id: 'downloads',
    icon: Download,
    label: 'Downloads',
    description: 'Access your offline content',
    color: '#60a5fa',
  },
  {
    id: 'history',
    icon: History,
    label: 'History',
    description: 'View your activity history',
    color: '#f59e0b',
  },
  {
    id: 'liked',
    icon: Heart,
    label: 'Liked',
    description: 'Your favorite content',
    color: '#ef4444',
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Notifications',
    description: 'Manage your alerts',
    color: '#22c55e',
  },
  {
    id: 'wallet',
    icon: Wallet,
    label: 'Wallet',
    description: 'Manage your payments',
    color: '#9333ea',
  },
  {
    id: 'blocked',
    icon: UserX,
    label: 'Blocked Users',
    description: 'Manage blocked accounts',
    color: '#dc2626',
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    description: 'Customize your experience',
    color: '#64748b',
  },
  {
    id: 'help',
    icon: HelpCircle,
    label: 'Help & Support',
    description: 'Get assistance',
    color: '#0ea5e9',
  },
];

export default function MenuScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const numColumns = 2;
  const screenWidth = Dimensions.get('window').width;
  const padding = 20;
  const gap = 12;
  const itemWidth = (screenWidth - (padding * 2) - (gap * (numColumns - 1))) / numColumns;

  const handleItemPress = (id: string) => {
    if (id === 'settings') {
      router.push('/(tabs)/settings');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item.id)}
      style={[
        styles.card,
        { 
          backgroundColor: colors.surface,
          width: itemWidth,
        },
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
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <FlatList
        data={MENU_ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
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