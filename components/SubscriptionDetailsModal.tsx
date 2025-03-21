import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Bell, Check } from 'lucide-react-native';
import { Button } from './Button';
import { useState } from 'react';

interface Subscriber {
  id: string;
  name: string;
  avatar: string;
  title: string;
  isPremium: boolean;
  followingSince: string;
  nextPayment?: string;
  status: 'subscribed' | 'following';
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
  const { colors } = useTheme();
  const [notificationSettings, setNotificationSettings] = useState({
    newPosts: true,
    comments: true,
    liveStreams: true,
    creatorUpdates: true,
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
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {subscriber.status === 'subscribed' ? 'Subscription Details' : 'Following Details'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.creatorInfo}>
            <Image source={{ uri: subscriber.avatar }} style={styles.avatar} />
            <View style={styles.creatorText}>
              <Text style={[styles.creatorName, { color: colors.textPrimary }]}>
                {subscriber.name}
              </Text>
              <Text style={[styles.creatorTitle, { color: colors.textSecondary }]}>
                {subscriber.title}
              </Text>
            </View>
          </View>

          <View style={[styles.membershipCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.membershipTitle, { color: colors.textPrimary }]}>
              {subscriber.status === 'subscribed' ? 'Premium' : 'Free Membership'}
            </Text>
            <View style={styles.membershipDetails}>
              {subscriber.status === 'subscribed' && (
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.textPrimary }]}>$9.99/month</Text>
                  <View style={styles.nextPaymentWrapper}>
                    <Text style={[styles.nextPaymentLabel, { color: colors.textSecondary }]}>
                      Next payment
                    </Text>
                    <Text style={[styles.nextPaymentDate, { color: colors.primary }]}>
                      {subscriber.nextPayment}
                    </Text>
                  </View>
                </View>
              )}
              <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
                <Check size={16} color={colors.success} />
                <Text style={[styles.statusText, { color: colors.success }]}>
                  {subscriber.status === 'subscribed' 
                    ? 'Your subscription is active'
                    : "You're following this creator"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.notificationSection}>
            <View style={styles.notificationHeader}>
              <Bell size={20} color={colors.textPrimary} />
              <Text style={[styles.notificationTitle, { color: colors.textPrimary }]}>
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
                    <Text style={[styles.notificationItemTitle, { color: colors.textPrimary }]}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                    <Text style={[styles.notificationItemDescription, { color: colors.textSecondary }]}>
                      {getNotificationDescription(key)}
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
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: `${colors.error}15` }]}
            onPress={subscriber.status === 'subscribed' ? onCancelSubscription : onUnfollow}>
            <Text style={[styles.cancelButtonText, { color: colors.error }]}>
              {subscriber.status === 'subscribed' ? 'Cancel Subscription' : 'Unfollow'}
            </Text>
          </TouchableOpacity>
          <Button label="Close" onPress={onClose} variant="primary" />
        </View>
      </View>
    </Modal>
  );
}

function getNotificationDescription(key: string): string {
  switch (key) {
    case 'newPosts':
      return 'Get notified when new content is posted';
    case 'comments':
      return 'Get notified about new comments';
    case 'liveStreams':
      return 'Get notified when creator goes live';
    case 'creatorUpdates':
      return 'Get notified about creator announcements';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  creatorTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  membershipCard: {
    padding: 16,
    borderRadius: 16,
  },
  membershipTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  membershipDetails: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  nextPaymentWrapper: {
    alignItems: 'flex-start',
  },
  nextPaymentLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  nextPaymentDate: {
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationItemDescription: {
    fontSize: 14,
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
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export { SubscriptionDetailsModal }