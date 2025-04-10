import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Megaphone, Users, ChartLine as LineChart, Bell, Settings, CircleHelp as HelpCircle, Download, History, Heart, Wallet, UserX, Shield, Activity } from 'lucide-react-native';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { useMemberSettings } from '@/hooks/useMemberSettings';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
}

const MENU_ITEMS = [
    {
        id: 'promotions',
        icon: Megaphone,
        label: 'Promotions',
        description: 'Manage your promotional campaigns',
    },
    {
        id: 'audience',
        icon: Users,
        label: 'Audience',
        description: 'View audience insights',
    },
    {
        id: 'insights',
        icon: LineChart,
        label: 'Insights',
        description: 'Analytics and performance',
    },
    {
        id: 'notifications',
        icon: Bell,
        label: 'Notifications',
        description: 'Manage your alerts',
    },
    {
        id: 'moderation',
        icon: Shield,
        label: 'Moderation Hub',
        description: 'Manage content and user reports',
    },
    {
        id: 'activity',
        icon: Activity,
        label: 'Activity',
        description: 'View recent activities and events',
    },
    {
        id: 'help',
        icon: HelpCircle,
        label: 'Help & Support',
        description: 'Get assistance',
    },
];

const CREATOR_ONLY_ITEMS = [
    {
        id: 'settings',
        icon: Settings,
        label: 'Settings',
        description: 'Customize your experience',
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

    const isCreatorAssociate = user?.role === UserRole.CREATOR_ASSOCIATE;

    const menuItems = isCreatorAssociate ? MENU_ITEMS : [...MENU_ITEMS, ...CREATOR_ONLY_ITEMS];

    const handleItemPress = (id: string) => {
        if (id === 'settings') {
            router.push('/screens/creator/settings');
        }
        if (id === 'activity') {
            router.push('/screens/creator/activity');
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
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                    <item.icon size={24} color={colors.textPrimary} />
                </View>
                <View style={styles.cardContent}>
                    <Text
                        style={[
                            styles.menuItemLabel,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
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
                                includeFontPadding: false
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
                data={menuItems}
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