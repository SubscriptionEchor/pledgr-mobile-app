import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { Megaphone, Users, ChartLine as LineChart, Bell, Settings, CircleHelp as HelpCircle, Download, History, Heart, Wallet, UserX } from 'lucide-react-native';

const getMemberMenuItems = () => [
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

const getCreatorMenuItems = () => [
  {
    id: 'promotions',
    icon: Megaphone,
    label: 'Promotions',
    description: 'Manage your promotional campaigns',
    color: '#60a5fa',
  },
  {
    id: 'audience',
    icon: Users,
    label: 'Audience',
    description: 'View audience insights',
    color: '#f59e0b',
  },
  {
    id: 'insights',
    icon: LineChart,
    label: 'Insights',
    description: 'Analytics and performance',
    color: '#22c55e',
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Notifications',
    description: 'Manage your alerts',
    color: '#9333ea',
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 20;
const NUM_COLUMNS = 2;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (CONTENT_PADDING * 2) - CARD_GAP) / NUM_COLUMNS;
const CARD_HEIGHT = 150;

export default function MenuScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const isCreator = user?.role === UserRole.CREATOR;
  const MENU_ITEMS = isCreator ? getCreatorMenuItems() : getMemberMenuItems();

  const handleItemPress = (id: string) => {
    if (id === 'settings') {
      router.push('/(tabs)/settings');
    }
  };

  const renderItem = ({ item }: { item: typeof MENU_ITEMS[number] }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: colors.surface,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        },
      ]}
      onPress={() => handleItemPress(item.id)}>
      <View style={styles.cardInner}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <item.icon size={24} color={item.color} />
        </View>
        <View style={styles.cardContent}>
          <Text 
            style={[
              styles.menuItemLabel, 
              { 
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
              }
            ]}
            numberOfLines={1}>
            {item.label}
          </Text>
          <Text 
            style={[
              styles.menuItemDescription, 
              { 
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.xs,
              }
            ]}
            numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <FlatList
        data={MENU_ITEMS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: CONTENT_PADDING,
  },
  columnWrapper: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardInner: {
    flex: 1,
    height: '100%',
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
    flex: 1,
    justifyContent: 'flex-start',
    gap: 6,
  },
  menuItemLabel: {
    lineHeight: 22,
  },
  menuItemDescription: {
    lineHeight: 16,
  },
});