import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Switch, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Bell, Check, X } from 'lucide-react-native';
import { Button } from './Button';
import { useState } from 'react';
import { SubscriptionStatus, NotificationTypes } from '@/lib/enums';

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

interface SubscriptionDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  subscriber: Subscriber;
  onUnfollow?: () => void;
  onCancelSubscription?: () => void;
}

export function SubscriptionDetailsModal({
  visible,
  onClose,
  subscriber,
  onUnfollow,
  onCancelSubscription,
}: SubscriptionDetailsModalProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [notificationSettings, setNotificationSettings] = useState({
    [NotificationTypes.NEW_POSTS]: true,
    [NotificationTypes.COMMENTS]: true,
    [NotificationTypes.LIVE_STREAMS]: true,
    [NotificationTypes.CREATOR_UPDATES]: true,
  });

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[
            styles.headerTitle, 
            { 
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
            }
          ]}>
            {subscriber.status === SubscriptionStatus.SUBSCRIBED ? 'Subscription Details' : 'Following Details'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.creatorInfo}>
            <Image source={{ uri: subscriber.avatar }} style={styles.avatar} />
            <View style={styles.creatorText}>
              <Text style={[
                styles.creatorName, 
                { 
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.lg,
                }
              ]}>
                {subscriber.name}
              </Text>
              <Text style={[
                styles.creatorTitle, 
                { 
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                }
              ]}>
                {subscriber.title}
              </Text>
            </View>
          </View>

          <View style={[styles.membershipCard, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.membershipTitle, 
              { 
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.xl,
              }
            ]}>
              {subscriber.status === SubscriptionStatus.SUBSCRIBED ? 'Premium' : 'Free Membership'}
            </Text>
            <View style={styles.membershipDetails}>
              {subscriber.status === SubscriptionStatus.SUBSCRIBED && (
                <View style={styles.priceRow}>
                  <Text style={[
                    styles.price, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fonts.bold,
                      fontSize: fontSize['2xl'],
                    }
                  ]}>
                    $9.99/month
                  </Text>
                  <View style={styles.nextPaymentWrapper}>
                    <Text style={[
                      styles.nextPaymentLabel, 
                      { 
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.xs,
                      }
                    ]}>
                      Next payment
                    </Text>
                    <Text style={[
                      styles.nextPaymentDate, 
                      { 
                        color: colors.primary,
                        fontFamily: fonts.medium,
                        fontSize: fontSize.sm,
                      }
                    ]}>
                      {subscriber.nextPayment}
                    </Text>
                  </View>
                </View>
              )}
              <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
                <Check size={16} color={colors.success} />
                <Text style={[
                  styles.statusText, 
                  { 
                    color: colors.success,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                  }
                ]}>
                  {subscriber.status === SubscriptionStatus.SUBSCRIBED 
                    ? 'Your subscription is active'
                    : "You're following this creator"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.notificationSection}>
            <View style={styles.notificationHeader}>
              <Bell size={20} color={colors.textPrimary} />
              <Text style={[
                styles.notificationTitle, 
                { 
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.lg,
                }
              ]}>
                Notification Preferences
              </Text>
            </View>

            <View style={[styles.notificationList, { backgroundColor: colors.surface }]}>
              {Object.entries(notificationSettings).map(([key, value], index, array) => (
                <View 
                  key={key}
                  style={[
                    styles.notificationItem,
                    index !== array.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                  ]}>
                  <View style={styles.notificationItemContent}>
                    <Text style={[
                      styles.notificationItemTitle, 
                      { 
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                      }
                    ]}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                    <Text style={[
                      styles.notificationItemDescription, 
                      { 
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                      }
                    ]}>
                      {getNotificationDescription(key as NotificationTypes)}
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={() => handleNotificationToggle(key as keyof typeof notificationSettings)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={value ? colors.buttonText : colors.surface}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: `${colors.error}15` }]}
            onPress={subscriber.status === SubscriptionStatus.SUBSCRIBED ? onCancelSubscription : onUnfollow}>
            <Text style={[
              styles.cancelButtonText, 
              { 
                color: colors.error,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
              }
            ]}>
              {subscriber.status === SubscriptionStatus.SUBSCRIBED ? 'Cancel Subscription' : 'Unfollow'}
            </Text>
          </TouchableOpacity>
          <View style={styles.closeButton}>
            <Button label="Close" onPress={onClose} variant="primary" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getNotificationDescription(key: NotificationTypes): string {
  switch (key) {
    case NotificationTypes.NEW_POSTS:
      return 'Get notified when new content is posted';
    case NotificationTypes.COMMENTS:
      return 'Get notified about new comments';
    case NotificationTypes.LIVE_STREAMS:
      return 'Get notified when creator goes live';
    case NotificationTypes.CREATOR_UPDATES:
      return 'Get notified about creator announcements';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  creatorText: {
    flex: 1,
  },
  creatorName: {
    marginBottom: 4,
  },
  creatorTitle: {
    lineHeight: 20,
  },
  membershipCard: {
    padding: 20,
    borderRadius: 16,
  },
  membershipTitle: {
    marginBottom: 16,
  },
  membershipDetails: {
    gap: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  price: {
    letterSpacing: -0.5,
  },
  nextPaymentWrapper: {
    alignItems: 'flex-end',
  },
  nextPaymentLabel: {
    marginBottom: 4,
  },
  nextPaymentDate: {
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    letterSpacing: -0.3,
  },
  notificationSection: {
    gap: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationTitle: {
    letterSpacing: -0.3,
  },
  notificationList: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  notificationItemContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationItemTitle: {
    marginBottom: 4,
  },
  notificationItemDescription: {
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 100, // Fixed width for the close button
  },
});