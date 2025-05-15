import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, StatusBar, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Crown, Clock, Calendar, ChevronLeft, X, Check, Shield, CheckCircle2, XCircle, AlertCircle, Globe } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { SubscriptionDetailsModal } from '@/components/SubscriptionDetailsModal';
import { showToast } from '@/components/Toast';
import { SubscriptionStatus } from '@/lib/enums';
import { useRouter } from 'expo-router';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Button } from '@/components/Button';

interface Subscriber {
    id: string;
    name: string;
    avatar: string;
    title: string;
    isPremium: boolean;
    followingSince: string;
    nextPayment?: string;
    status: SubscriptionStatus;
}

interface NotificationPreference {
    id: string;
    label: string;
    enabled: boolean;
}

const SUBSCRIBERS: Subscriber[] = [
    {
        id: '1',
        name: 'Sarah Anderson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        title: 'Digital artist and creative technologist',
        isPremium: true,
        followingSince: '3/15/2024',
        nextPayment: '4/15/2024',
        status: SubscriptionStatus.SUBSCRIBED,
    },
    {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        title: 'Web3 educator & community builder',
        isPremium: false,
        followingSince: '2/28/2024',
        status: SubscriptionStatus.FOLLOWING,
    },
    {
        id: '3',
        name: 'Emma Watson',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        title: 'Tech writer & blockchain enthusiast',
        isPremium: true,
        followingSince: '1/15/2024',
        nextPayment: '4/1/2024',
        status: SubscriptionStatus.SUBSCRIBED,
    }
];

type FilterType = 'all' | 'subscribed' | 'following';

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Subscribed', value: 'subscribed' },
    { label: 'Following', value: 'following' }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 16;
const CARD_MARGIN = SCREEN_WIDTH <= 375 ? 12 : 16;

export default function SubscriptionScreen() {
    const { colors, fonts, fontSize, isDark } = useTheme();
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
        { id: 'new_posts', label: 'New posts', enabled: true },
        { id: 'comments', label: 'Comments', enabled: true },
        { id: 'live_streams', label: 'Live streams', enabled: true },
        { id: 'creator_updates', label: 'Creator updates', enabled: true },
    ]);
    const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

    const filteredSubscribers = SUBSCRIBERS.filter(subscriber => {
        if (activeFilter === 'all') return true;
        return subscriber.status === activeFilter;
    });

    const handleCardPress = (subscriber: Subscriber) => {
        setSelectedSubscriber(subscriber);
        setShowModal(true);
    };

    const handleUnfollow = () => {
        if (selectedSubscriber) {
            showToast.success(
                'Unfollowed successfully',
                `You have unfollowed ${selectedSubscriber.name}`
            );
            setShowModal(false);
        }
    };

    const handleCancelSubscription = () => {
        if (selectedSubscriber) {
            showToast.success(
                'Subscription cancelled',
                `Your subscription to ${selectedSubscriber.name} has been cancelled`
            );
            setShowModal(false);
        }
    };

    const toggleNotification = (id: string) => {
        setNotificationPreferences(prev => 
            prev.map(pref => 
                pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
            )
        );
    };

    const renderPremiumBadge = () => (
        <View style={[styles.premiumBadge, { backgroundColor: `${colors.primary}15` }]}>
            <View style={[styles.premiumIconContainer, { backgroundColor: colors.primary }]}>
                <Crown size={12} color={colors.buttonText} style={{ transform: [{ translateY: -0.5 }] }} />
            </View>
            <Text style={[
                styles.premiumText,
                {
                    color: colors.primary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.xs,
                    includeFontPadding: false
                }
            ]}>
                PRO
            </Text>
        </View>
    );

    const renderSubscriber = (subscriber: Subscriber) => (
        <TouchableOpacity
            key={subscriber.id}
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => handleCardPress(subscriber)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                    <Image
                        source={{ uri: subscriber.avatar }}
                        style={styles.avatar}
                    />
                    <View style={styles.nameContainer}>
                        <View style={styles.nameRow}>
                            <View style={styles.nameWithIcon}>
                                <Text style={[
                                    styles.name,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.semibold,
                                        fontSize: fontSize.md,
                                        includeFontPadding: false
                                    }
                                ]}>
                                    {subscriber.name}
                                </Text>
                                {subscriber.isPremium && renderPremiumBadge()}
                            </View>
                        </View>
                        <Text style={[
                            styles.title,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.sm,
                                includeFontPadding: false
                            }
                        ]}>
                            {subscriber.title}
                        </Text>
                    </View>
                </View>

                <View style={[
                    styles.status,
                    {
                        backgroundColor: subscriber.status === SubscriptionStatus.SUBSCRIBED
                            ? `${colors.success}15`
                            : `${colors.primary}15`,
                        borderColor: subscriber.status === SubscriptionStatus.SUBSCRIBED
                            ? colors.success
                            : colors.primary
                    }
                ]}>
                    <Text style={[
                        styles.statusText,
                        {
                            color: subscriber.status === SubscriptionStatus.SUBSCRIBED
                                ? colors.success
                                : colors.primary,
                            fontFamily: fonts.medium,
                            fontSize: fontSize.xs,
                            includeFontPadding: false
                        }
                    ]}>
                        {subscriber.status === SubscriptionStatus.SUBSCRIBED ? 'Subscribed' : 'Following'}
                    </Text>
                </View>
            </View>

            <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                <View style={styles.metaInfo}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={[
                        styles.metaText,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.xs,
                            includeFontPadding: false
                        }
                    ]}>
                        Since {subscriber.followingSince}
                    </Text>
                </View>
                {subscriber.nextPayment && (
                    <View style={styles.metaInfo}>
                        <Calendar size={14} color={colors.primary} />
                        <Text style={[
                            styles.metaText,
                            {
                                color: colors.primary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.xs,
                                includeFontPadding: false
                            }
                        ]}>
                            Next: {subscriber.nextPayment}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <ChevronLeft size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text 
                            style={[
                                styles.headerTitle,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.bold,
                                    fontSize: fontSize['2xl']
                                }
                            ]}
                        >
                            Subscriptions
                        </Text>
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filters}
                >
                    {(['all', 'subscribed', 'following'] as FilterType[]).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterButton,
                                {
                                    backgroundColor: activeFilter === filter ? colors.primary : 'transparent',
                                    borderColor: activeFilter === filter ? colors.primary : colors.textSecondary + '20',
                                }
                            ]}
                            onPress={() => setActiveFilter(filter)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    {
                                        color: activeFilter === filter ? colors.background : colors.textSecondary,
                                        fontFamily: activeFilter === filter ? fonts.medium : fonts.regular,
                                        fontSize: fontSize.sm,
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.content, { paddingHorizontal: CONTENT_PADDING }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.list}>
                    {filteredSubscribers.map(renderSubscriber)}
                </View>
            </ScrollView>

            {selectedSubscriber && (
                <Modal
                    visible={showModal}
                    animationType="slide"
                    onRequestClose={() => setShowModal(false)}
                >
                    <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <TouchableOpacity 
                                style={styles.backButton}
                                onPress={() => setShowModal(false)}
                            >
                                <ChevronLeft size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                            <Text style={[
                                styles.modalTitle,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.xl,
                                    includeFontPadding: false
                                }
                            ]}>
                                Subscription Details
                            </Text>
                            <View style={styles.headerRight} />
                        </View>

                        <ScrollView
                            style={styles.modalScrollView}
                            contentContainerStyle={styles.modalScrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.creatorInfo}>
                                <Image source={{ uri: selectedSubscriber.avatar }} style={styles.avatar} />
                                <View style={styles.creatorText}>
                                    <Text style={[
                                        styles.creatorName,
                                        {
                                            color: colors.textPrimary,
                                            fontFamily: fonts.semibold,
                                            fontSize: fontSize.lg,
                                            includeFontPadding: false
                                        }
                                    ]}>
                                        {selectedSubscriber.name}
                                    </Text>
                                    <Text style={[
                                        styles.creatorTitle,
                                        {
                                            color: colors.textSecondary,
                                            fontFamily: fonts.regular,
                                            fontSize: fontSize.sm,
                                            includeFontPadding: false
                                        }
                                    ]}>
                                        {selectedSubscriber.title}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.premiumCard, { backgroundColor: colors.surface }]}>  
                                <View style={styles.premiumCardContent}>
                                    <View style={styles.premiumCardIconRow}>
                                        <Shield size={24} color={colors.primary} style={{ marginRight: 8 }} />
                                        <Text style={[
                                            styles.premiumCardHeadline,
                                            {
                                                color: colors.textPrimary,
                                                fontFamily: fonts.bold,
                                                fontSize: fontSize.lg,
                                                includeFontPadding: false
                                            }
                                        ]}>
                                            Premium Subscription
                                        </Text>
                                    </View>
                                    <Text style={[
                                        styles.premiumCardSubheadline,
                                        {
                                            color: colors.textSecondary,
                                            fontFamily: fonts.regular,
                                            fontSize: fontSize.md,
                                            marginTop: 4,
                                            includeFontPadding: false
                                        }
                                    ]}>
                                        $9.99/month · Next payment: {selectedSubscriber.nextPayment}
                                    </Text>
                                    <Text style={[
                                        styles.premiumCardStatus,
                                        {
                                            color: colors.success,
                                            fontFamily: fonts.medium,
                                            fontSize: fontSize.sm,
                                            marginTop: 8,
                                            includeFontPadding: false
                                        }
                                    ]}>
                                        Your subscription is active
                                    </Text>
                                    <TouchableOpacity style={[styles.premiumCardButton, { backgroundColor: colors.primary }]}>
                                        <Text style={[
                                            styles.premiumCardButtonText,
                                            {
                                                color: colors.buttonText,
                                                fontFamily: fonts.semibold,
                                                fontSize: fontSize.md,
                                                includeFontPadding: false
                                            }
                                        ]}>
                                            Manage Subscription
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.preferencesSection}>
                                {notificationPreferences.map((preference) => (
                                    <View
                                        key={preference.id}
                                        style={styles.preferenceCard}
                                    >
                                        <View style={styles.preferenceCardContent}>
                                            <Globe size={20} color={colors.primary} style={{ marginRight: 10 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={[
                                                    styles.preferenceCardTitle,
                                                    {
                                                        color: colors.textPrimary,
                                                        fontFamily: fonts.semibold,
                                                        fontSize: fontSize.md,
                                                        includeFontPadding: false,
                                                    },
                                                ]}>
                                                    {preference.label}
                                                </Text>
                                                <Text style={[
                                                    styles.preferenceCardDescription,
                                                    {
                                                        color: colors.textSecondary,
                                                        fontFamily: fonts.regular,
                                                        fontSize: fontSize.sm,
                                                        includeFontPadding: false,
                                                        marginTop: 2,
                                                    },
                                                ]}>
                                                    {getPreferenceDescription(preference.id)}
                                                </Text>
                                            </View>
                                            <Switch
                                                value={preference.enabled}
                                                onValueChange={() => toggleNotification(preference.id)}
                                                trackColor={{ false: colors.border, true: colors.primary }}
                                                thumbColor={preference.enabled ? colors.background : colors.background}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={[styles.modalFooterSingle, { borderTopColor: colors.border }]}> 
                            <TouchableOpacity
                                style={[
                                    styles.cancelSingleButtonOutline,
                                    { borderColor: colors.border, backgroundColor: 'transparent' }
                                ]}
                                onPress={() => setShowUnsubscribeConfirm(true)}
                            >
                                <Text style={[
                                    styles.cancelSingleButtonOutlineText,
                                    { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md }
                                ]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            )}

            {/* Unsubscribe Confirmation Modal */}
            <Modal
                visible={showUnsubscribeConfirm}
                animationType="fade"
                transparent
                onRequestClose={() => setShowUnsubscribeConfirm(false)}
            >
                <View style={styles.centeredModalOverlay}>
                    <View style={[styles.centeredModalBox, { backgroundColor: colors.surface }]}> 
                        <TouchableOpacity style={styles.centeredModalClose} onPress={() => setShowUnsubscribeConfirm(false)}>
                            <X size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <View style={styles.centeredModalIconRow}>
                            <AlertCircle size={48} color={colors.error} />
                        </View>
                        <Text style={[styles.centeredModalTitle, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.xl }]}>Unsubscribe?</Text>
                        <Text style={[styles.centeredModalMessage, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md }]}>Are you sure you want to unsubscribe? You will lose access to exclusive content and updates from this creator.</Text>
                        <TouchableOpacity
                            style={[styles.centeredModalPrimaryBtn, { backgroundColor: colors.error }]}
                            onPress={() => { handleCancelSubscription(); setShowUnsubscribeConfirm(false); setShowModal(false); }}
                        >
                            <Text style={[styles.centeredModalPrimaryBtnText, { color: '#fff', fontFamily: fonts.bold, fontSize: fontSize.md }]}>Unsubscribe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.centeredModalOutlineBtn,
                                { borderColor: colors.border, backgroundColor: 'transparent' }
                            ]}
                            onPress={() => setShowUnsubscribeConfirm(false)}
                        >
                            <Text style={[styles.centeredModalOutlineBtnText, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md }]}>No, keep subscription</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function getPreferenceDescription(id: string) {
    switch (id) {
        case 'new_posts':
            return 'Get notified when there are new posts.';
        case 'comments':
            return 'Get notified when someone comments.';
        case 'live_streams':
            return 'Get notified when a live stream starts.';
        case 'creator_updates':
            return 'Get notified about creator updates.';
        default:
            return '';
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 56,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
    },
    headerTitle: {
        marginBottom: 0,
    },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)',
        height: 56,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        minWidth: 100,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterText: {
        textTransform: 'capitalize',
        textAlign: 'center',
        includeFontPadding: false,
        lineHeight: 20,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingTop: 20,
        paddingBottom: 32,
        gap: 24,
    },
    list: {
        gap: CARD_MARGIN,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: CARD_MARGIN,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    cardHeaderLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: SCREEN_WIDTH <= 375 ? 40 : 48,
        height: SCREEN_WIDTH <= 375 ? 40 : 48,
        borderRadius: SCREEN_WIDTH <= 375 ? 20 : 24,
    },
    nameContainer: {
        flex: 1,
        gap: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    name: {
        marginBottom: 2,
    },
    title: {
        lineHeight: 18,
    },
    cardFooter: {
        padding: CARD_MARGIN,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        lineHeight: 16,
    },
    status: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        alignSelf: 'flex-end',
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
        paddingLeft: 4,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 6,
    },
    premiumIconContainer: {
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    sharingBannerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        marginBottom: 20,
        marginHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
    },
    premiumText: {
        // Text style for PRO badge, actual color/font set inline
    },
    statusText: {
        // Text style for status badge, actual color/font set inline
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        height: 56,
    },
    modalTitle: {
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    modalScrollView: {
        flex: 1,
    },
    modalScrollContent: {
        padding: 20,
        gap: 24,
    },
    modalFooterSingle: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
    },
    cancelSingleButtonOutline: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    cancelSingleButtonOutlineText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    creatorText: {
        flex: 1,
    },
    creatorName: {
        marginBottom: 4,
    },
    creatorTitle: {
        lineHeight: 18,
    },
    premiumCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
        overflow: 'visible',
    },
    premiumCardContent: {
        alignItems: 'flex-start',
    },
    premiumCardIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    premiumCardHeadline: {
        fontWeight: 'bold',
    },
    premiumCardSubheadline: {
        marginTop: 2,
    },
    premiumCardStatus: {
        marginTop: 8,
    },
    premiumCardButton: {
        marginTop: 16,
        width: '100%',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    premiumCardButtonText: {
        fontWeight: '600',
    },
    preferencesSection: {
        gap: 16,
        marginTop: 8,
    },
    preferenceCard: {
        borderRadius: 16,
        padding: 0,
        marginBottom: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    preferenceCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    preferenceCardTitle: {
        fontWeight: '600',
    },
    preferenceCardDescription: {
        marginTop: 2,
    },
    centeredModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredModalBox: {
        width: '90%',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },
    centeredModalClose: {
        position: 'absolute',
        left: 16,
        top: 16,
        zIndex: 2,
        padding: 4,
    },
    centeredModalIconRow: {
        marginTop: 12,
        marginBottom: 18,
    },
    centeredModalTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    centeredModalMessage: {
        textAlign: 'center',
        marginBottom: 28,
    },
    centeredModalPrimaryBtn: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 0,
    },
    centeredModalPrimaryBtnText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    centeredModalOutlineBtn: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        marginTop: 16,
    },
    centeredModalOutlineBtnText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});