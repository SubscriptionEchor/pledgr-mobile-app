import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Crown, Clock, Calendar } from 'lucide-react-native';
import { useState } from 'react';
import { SubscriptionDetailsModal } from '@/components/SubscriptionDetailsModal';
import { showToast } from '@/components/Toast';
import { SubscriptionStatus } from '@/lib/enums';

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
    const { colors, fonts, fontSize } = useTheme();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
    const [showModal, setShowModal] = useState(false);

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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Subscriptions" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.content, { paddingHorizontal: CONTENT_PADDING }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[
                        styles.headerTitle,
                        {
                            color: colors.textPrimary,
                            fontFamily: fonts.bold,
                            fontSize: fontSize['2xl'],
                            includeFontPadding: false
                        }
                    ]}>
                        Your Subscriptions
                    </Text>
                    <Text style={[
                        styles.headerSubtitle,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                        }
                    ]}>
                        Manage your subscriptions and following list
                    </Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {FILTER_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.filterOption,
                                {
                                    backgroundColor: activeFilter === option.value
                                        ? `${colors.primary}15`
                                        : 'transparent',
                                    borderColor: activeFilter === option.value
                                        ? colors.primary
                                        : colors.border,
                                }
                            ]}
                            onPress={() => setActiveFilter(option.value)}
                        >
                            <Text style={[
                                styles.filterText,
                                {
                                    color: activeFilter === option.value
                                        ? colors.primary
                                        : colors.textSecondary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.list}>
                    {filteredSubscribers.map(renderSubscriber)}
                </View>
            </ScrollView>

            {selectedSubscriber && (
                <SubscriptionDetailsModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    subscriber={selectedSubscriber}
                    onUnfollow={handleUnfollow}
                    onCancelSubscription={handleCancelSubscription}
                />
            )}
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
        paddingTop: 20,
        paddingBottom: 32,
        gap: 24,
    },
    header: {
        gap: 4,
        marginBottom: 4,
    },
    headerTitle: {
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        lineHeight: 20,
    },
    filterScrollContent: {
        paddingVertical: 4,
        gap: 8,
    },
    filterOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
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
});