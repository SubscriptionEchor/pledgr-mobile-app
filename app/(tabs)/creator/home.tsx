import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { useRouter } from 'expo-router';
import { Library, MessageCircle, Store, Crown, Pencil, Share2, MoreVertical, Palette, Settings, Compass, FileText, Info, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_PADDING = 20;
const CARD_GAP = 8;

interface ActionButton {
    id: string;
    label: string;
    icon: any;
    route: string;
    size?: 'small' | 'medium' | 'large';
}

const ACTION_BUTTONS: ActionButton[] = [
    // Row 1 - 3 equal cards
    {
        id: 'post',
        label: 'Post',
        icon: FileText,
        route: '/screens/creator/recent-posts',
        size: 'small'
    },
    {
        id: 'collection',
        label: 'Collection',
        icon: Library,
        route: '/screens/creator/collection',
        size: 'small'
    },
    {
        id: 'chat',
        label: 'Chat',
        icon: MessageCircle,
        route: '/screens/creator/chat',
        size: 'small'
    },
    // Row 2 - 70/30 split
    {
        id: 'membership',
        label: 'Membership',
        icon: Crown,
        route: '/screens/creator/members',
        size: 'medium'
    },
    {
        id: 'shop',
        label: 'Shop',
        icon: Store,
        route: '/screens/creator/shop',
        size: 'small'
    },
    // Row 3 - 2 equal cards
    {
        id: 'about',
        label: 'About',
        icon: Info,
        route: '/screens/creator/about',
        size: 'small'
    },
    {
        id: 'recommendation',
        label: 'Recommendations',
        icon: Sparkles,
        route: '/screens/creator/recommendation',
        size: 'medium'
    }
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
            style={[
                styles.actionButton,
                styles[`${button.size}Button`],
                { backgroundColor: colors.surface }
            ]}
            onPress={() => router.push(button.route)}>
            <View style={styles.buttonContent}>
                <button.icon size={24} color={colors.textPrimary} />
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
            </View>
        </TouchableOpacity>
    );

    const renderBentoGrid = () => {
        const row1 = ACTION_BUTTONS.slice(0, 3);
        const row2 = ACTION_BUTTONS.slice(3, 5);
        const row3 = ACTION_BUTTONS.slice(5, 7);

        return (
            <View style={styles.bentoGrid}>
                <View style={styles.bentoRow}>
                    {row1.map(renderActionButton)}
                </View>
                <View style={styles.bentoRow}>
                    {row2.map(renderActionButton)}
                </View>
                <View style={styles.bentoRow}>
                    {row3.map(renderActionButton)}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <View style={[styles.coverSection, { height: SCREEN_HEIGHT * 0.4 }]}>
                    <LinearGradient
                        colors={['#4338ca', '#6366f1']}
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

                {renderBentoGrid()}
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
    scrollContent: {
        gap: 0,
    },
    coverSection: {
        position: 'relative',
    },
    coverGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        bottom: 20,
        left: 20,
        right: 20,
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
    bentoGrid: {
        padding: CONTENT_PADDING,
        gap: CARD_GAP,
        flex: 1,
    },
    bentoRow: {
        flexDirection: 'row',
        gap: CARD_GAP,
        marginBottom: CARD_GAP,
        width: '100%',
        height: 100, // Fixed height for all rows
    },
    actionButton: {
        borderRadius: 16,
        overflow: 'hidden',
        height: '100%', // Take full height of parent row
    },
    smallButton: {
        flex: 1,
    },
    mediumButton: {
        flex: 2,
    },
    buttonContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
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