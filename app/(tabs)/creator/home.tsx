import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { useRouter } from 'expo-router';
import { Library, MessageSquare, Store, Crown, CircleUser as UserCircle, Sparkles, Chrome as Home, Pencil, Share2, MoveVertical as MoreVertical, Palette, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 20;
const CARD_GAP = 16;
const ACTION_BUTTON_SIZE = (SCREEN_WIDTH - (CONTENT_PADDING * 2) - (CARD_GAP * 2)) / 3;

interface ActionButton {
    id: string;
    label: string;
    icon: any;
    route: string;
    color: string;
}

const ACTION_BUTTONS: ActionButton[] = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        route: '/screens/creator/recent-posts',
        color: '#1e88e5',
    },
    {
        id: 'library',
        label: 'Library',
        icon: Library,
        route: '/screens/creator/library',
        color: '#43a047',
    },
    {
        id: 'chat',
        label: 'Chat',
        icon: MessageSquare,
        route: '/screens/creator/chat',
        color: '#fb8c00',
    },
    {
        id: 'shop',
        label: 'Shop',
        icon: Store,
        route: '/screens/creator/shop',
        color: '#8e24aa',
    },
    {
        id: 'members',
        label: 'Members',
        icon: UserCircle,
        route: '/screens/creator/members',
        color: '#e91e63',
    },
    {
        id: 'tiers',
        label: 'Tiers',
        icon: Crown,
        route: '/screens/creator/tiers',
        color: '#039be5',
    },
];

export default function HomeScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();
    const [showOptions, setShowOptions] = useState(false);

    const handleShare = () => {
        router.push('/screens/creator/share');
    };

    const handleColorPicker = () => {
        // Handle color picker action
    };

    const handleEditPage = () => {
        setShowOptions(false);
        router.push('/screens/creator/edit-page');
    };

    const handleGoToLibrary = () => {
        setShowOptions(false);
        router.push('/screens/creator/library');
    };

    const handleEditTiers = () => {
        setShowOptions(false);
        router.push('/screens/creator/tiers');
    };

    const renderActionButton = (button: ActionButton) => (
        <TouchableOpacity
            key={button.id}
            style={[styles.actionButton, { backgroundColor: colors.surface }]}
            onPress={() => router.push(button.route)}>
            <View style={[styles.actionIcon, { backgroundColor: `${button.color}15` }]}>
                <button.icon size={24} color={button.color} />
            </View>
            <Text style={[
                styles.actionLabel,
                {
                    color: colors.textPrimary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                }
            ]}>
                {button.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header />
            {showOptions && (
                <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <View style={styles.coverSection}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800' }}
                        style={styles.coverImage}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.7)', 'transparent']}
                        style={styles.coverGradient}
                    />
                    <View style={styles.coverActions}>
                        <TouchableOpacity
                            style={[styles.actionIconButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                            onPress={handleColorPicker}>
                            <Palette size={16} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionIconButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                            onPress={handleShare}>
                            <Share2 size={16} color="#fff" />
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity
                                style={[styles.actionIconButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                                onPress={() => setShowOptions(!showOptions)}>
                                <MoreVertical size={16} color="#fff" />
                            </TouchableOpacity>
                            {showOptions && (
                                <View style={[styles.optionsMenu, { backgroundColor: colors.surface }]}>
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={handleEditPage}>
                                        <Pencil size={20} color={colors.textPrimary} />
                                        <Text style={[
                                            styles.optionText,
                                            {
                                                color: colors.textPrimary,
                                                fontFamily: fonts.medium,
                                                fontSize: fontSize.md,
                                                includeFontPadding: false
                                            }
                                        ]}>
                                            Edit page
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={handleGoToLibrary}>
                                        <Library size={20} color={colors.textPrimary} />
                                        <Text style={[
                                            styles.optionText,
                                            {
                                                color: colors.textPrimary,
                                                fontFamily: fonts.medium,
                                                fontSize: fontSize.md,
                                                includeFontPadding: false
                                            }
                                        ]}>
                                            Go to library
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={handleEditTiers}>
                                        <Settings size={20} color={colors.textPrimary} />
                                        <Text style={[
                                            styles.optionText,
                                            {
                                                color: colors.textPrimary,
                                                fontFamily: fonts.medium,
                                                fontSize: fontSize.md,
                                                includeFontPadding: false
                                            }
                                        ]}>
                                            Edit tiers
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={styles.coverContent}>
                        <View style={styles.coverProfile}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400' }}
                                style={styles.profileImage}
                            />
                            <View style={styles.profileInfo}>
                                <Text style={[
                                    styles.profileName,
                                    {
                                        color: '#fff',
                                        fontFamily: fonts.bold,
                                        fontSize: fontSize['2xl'],
                                        includeFontPadding: false
                                    }
                                ]}>
                                    Solo Levelling
                                </Text>
                                <Text style={[
                                    styles.profileDescription,
                                    {
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                        includeFontPadding: false
                                    }
                                ]}>
                                    Only I Level Up is a South Korean portal fantasy web novel
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    {ACTION_BUTTONS.map(renderActionButton)}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        gap: 24,
    },
    coverSection: {
        height: 400,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    coverGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    coverActions: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        gap: 8,
        zIndex: 2,
    },
    actionIconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        gap: 20,
    },
    coverProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileInfo: {
        flex: 1,
        gap: 8,
    },
    profileName: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    profileDescription: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: CARD_GAP,
        padding: CONTENT_PADDING,
    },
    actionButton: {
        width: ACTION_BUTTON_SIZE,
        height: ACTION_BUTTON_SIZE,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        textAlign: 'center',
    },
    optionsMenu: {
        position: 'absolute',
        top: 40,
        right: 0,
        borderRadius: 12,
        padding: 8,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
        borderRadius: 8,
    },
    optionText: {
        fontSize: 16,
    },
});