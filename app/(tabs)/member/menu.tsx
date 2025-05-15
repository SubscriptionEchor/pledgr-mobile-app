import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Bell, Settings, CircleHelp as HelpCircle, Download, History, Heart, Wallet, UserX, ChevronRight, MapPin, Gift, Info, HelpCircle as HelpCircleIcon, LogOut, Facebook, Instagram, X as XIcon, Home as HomeIcon, CreditCard, FileText, Crown } from 'lucide-react-native';

const MENU_ITEMS = [
    {
        id: 'settings',
        icon: Settings,
        label: 'Settings',
        description: '',
    },
    {
        id: 'memberships',
        icon: Crown,
        label: 'Memberships',
        description: '',
    },
    {
        id: 'referral',
        icon: Gift,
        label: 'Referral',
        description: '',
    },
    {
        id: 'blocked',
        icon: UserX,
        label: 'Blocked users',
        description: '',
    },
];

const SECONDARY_LINKS = [
    { id: 'help-faq', label: 'Help & FAQ', icon: HelpCircle },
    { id: 'feature-request', label: 'Feature Request', icon: Info },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Info },
    { id: 'terms', label: 'Terms of Service', icon: Info },
];

const POINTS = 506;
const MEMBER_STATUS = 'MEMBER';
const MEMBER_YEAR = '2025-2026 STATUS';
const USER_NAME = 'ALEX!';
const USER_EMAIL = 'alex@email.com';
const USER_AVATAR = 'https://randomuser.me/api/portraits/men/22.jpg';
const APP_QUOTE = 'Welcome to Pledgr! Empowering your giving journey.';

export default function MenuScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();

    // Navigation handlers for menu items
    const handleMenuPress = (id: string) => {
        switch (id) {
            case 'settings':
                router.push('/screens/member/settings');
                break;
            case 'memberships':
                router.push('/(tabs)/member/membership');
                break;
            case 'referral':
                router.push('/screens/member/referral');
                break;
            case 'blocked':
                router.push('/screens/member/blocked-users');
                break;
            default:
                break;
        }
    };

    const handleSecondaryLinkPress = (id: string) => {
        switch (id) {
            case 'help-faq':
                // TODO: Create help & faq screen
                router.push('/screens/member/placeholder');
                break;
            case 'feature-request':
                router.push('/screens/member/feature-request');
                break;
            case 'privacy-policy':
                router.push('/screens/common/privacy');
                break;
            case 'terms':
                router.push('/screens/common/terms');
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            {/* Top Section */}
            <View style={[styles.topSection, { backgroundColor: colors.primary }]}> 
                <Text style={{ color: colors.buttonText, fontFamily: fonts.regular, fontSize: fontSize.md, marginTop: 8, marginBottom: 8, textAlign: 'center' }}>{APP_QUOTE}</Text>
                <View style={[styles.profileCard, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, shadowColor: colors.textPrimary }]}> 
                    <Image source={{ uri: USER_AVATAR }} style={styles.profileAvatar} />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.lg }}>{USER_NAME}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                            <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{USER_EMAIL}</Text>
                            <TouchableOpacity style={styles.editBtn}>
                                <Text style={{ color: colors.primaryDark, fontFamily: fonts.bold, fontSize: fontSize.md, marginLeft: 8 }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Menu List */}
            <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                {MENU_ITEMS.map((item, idx) => (
                    <TouchableOpacity key={item.id} style={[styles.menuItemRow, idx === MENU_ITEMS.length - 1 ? { borderBottomWidth: 0 } : {}]} onPress={() => handleMenuPress(item.id)}>
                        <item.icon size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
                        <Text style={{ color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.lg, flex: 1 }}>{item.label}</Text>
                        <ChevronRight size={22} color={colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Secondary Links */}
            <View style={styles.secondaryLinksPlain}>
                {SECONDARY_LINKS.map((link, idx) => (
                    <TouchableOpacity
                        key={link.id}
                        style={[styles.secondaryLinkPlain, idx !== SECONDARY_LINKS.length - 1 && { marginBottom: 10 }]}
                        onPress={() => handleSecondaryLinkPress(link.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md, textDecorationLine: 'underline' }}>{link.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity style={[styles.logoutRow, { marginTop: 32 }]}>
                <LogOut size={22} color={colors.error} style={{ marginRight: 8 }} />
                <Text style={{ color: colors.error, fontFamily: fonts.bold, fontSize: fontSize.md }}>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        paddingTop: 24,
        paddingBottom: 24,
        paddingHorizontal: 0,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 16,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
        padding: 18,
        marginTop: 4,
        width: '90%',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 2,
    },
    profileAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#eee',
    },
    editBtn: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    menuCard: {
        marginTop: 18,
        marginHorizontal: 16,
        borderRadius: 18,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 18,
    },
    menuItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: 'transparent',
    },
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    secondaryLinksPlain: {
        marginHorizontal: 24,
        marginBottom: 18,
        marginTop: 8,
    },
    secondaryLinkPlain: {
        paddingVertical: 2,
    },
});