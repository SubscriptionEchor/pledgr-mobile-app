import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Filter, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  user?: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  type: 'like' | 'membership_cancel' | 'new_member' | 'comment' | 'system' | 'weekly_summary' | 'creator_request';
  content: string;
  timestamp: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    user: {
      name: 'Aditya Dalmia12',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
      verified: true
    },
    type: 'like',
    content: 'liked your post: Abcd',
    timestamp: '19h'
  },
  {
    id: '2',
    user: {
      name: 'Lakshmi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    type: 'membership_cancel',
    content: 'cancelled their membership.',
    timestamp: '1w'
  },
  {
    id: '3',
    user: {
      name: 'Gyan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    type: 'new_member',
    content: 'joined as a free member.',
    timestamp: '2w'
  },
  {
    id: '4',
    type: 'system',
    content: 'Your video took longer than usual to process: jxdvk.',
    timestamp: '2w'
  },
  {
    id: '5',
    user: {
      name: 'Lakshmi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    type: 'like',
    content: 'liked your post: mcv ..nv ,xm',
    timestamp: '3w'
  },
  {
    id: '6',
    user: {
      name: 'Lakshmi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    type: 'comment',
    content: 'commented on: Title 1',
    timestamp: '3w'
  },
  {
    id: '7',
    type: 'weekly_summary',
    content: 'Weekly summary: 1 new welcome survey response.',
    timestamp: '3w'
  },
  {
    id: '8',
    user: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
      verified: false
    },
    type: 'creator_request',
    content: 'requested to become a creator.',
    timestamp: '1d'
  }
];

export default function NotificationsScreen() {
  const { colors, fonts, fontSize } = useTheme();

  const renderNotification = (notification: Notification) => (
    <View
      key={notification.id}
      style={[styles.notificationItem, { borderBottomColor: colors.border }]}
    >
      {notification.user ? (
        <Image
          source={{ uri: notification.user.avatar }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.systemIcon, { backgroundColor: `${colors.primary}15` }]}> 
          <Info size={20} color={colors.primary} />
        </View>
      )}

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          {notification.user && (
            <View style={styles.userInfo}>
              <Text style={[
                styles.userName,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                {notification.user.name}
              </Text>
              {notification.user.verified && (
                <Text style={{ color: colors.success, marginLeft: 4, fontFamily: fonts.medium, fontSize: fontSize.xs, includeFontPadding: false }}>
                  Verified
                </Text>
              )}
            </View>
          )}
          <Text style={[
            styles.timestamp,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            {notification.timestamp}
          </Text>
        </View>

        <Text style={[
          styles.notificationText,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
            includeFontPadding: false
          }
        ]}>
          {notification.content}
          {notification.type === 'creator_request' && (
            <Text style={[
              styles.linkText,
              {
                color: colors.primary,
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              {' '}Review request
            </Text>
          )}
          {notification.type === 'system' && (
            <Text style={[
              styles.linkText,
              {
                color: colors.primary,
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              {' '}See details
            </Text>
          )}
        </Text>
        {notification.type === 'creator_request' && (
          <View style={styles.requestActions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => { /* handle accept */ }}>
              <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={() => { /* handle reject */ }}>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.headerContainer}>
        <SubHeader title="Notifications" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATIONS.map(renderNotification)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    minHeight: 56,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  systemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 14,
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 22,
  },
  linkText: {
    fontSize: 15,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
  }
}); 