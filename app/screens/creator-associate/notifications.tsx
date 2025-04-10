import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Filter, Info, MessageCircle, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Notification {
  id: string;
  user?: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  type: 'like' | 'membership_cancel' | 'new_member' | 'comment' | 'system' | 'weekly_summary';
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
  }
];

export default function NotificationsScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();

  const handleNavigateToChat = () => {
    router.push('/screens/creator-associate/chat');
  };

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
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                  <Text style={[
                    styles.verifiedText,
                    {
                      color: colors.buttonText,
                      fontFamily: fonts.medium,
                      fontSize: fontSize.xs,
                      includeFontPadding: false
                    }
                  ]}>
                    Verified
                  </Text>
                </View>
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
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <SubHeader title="Notifications" />
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.surface }]}
          >
            <Filter size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATIONS.map(renderNotification)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
  },
  headerActions: {
    position: 'absolute',
    top: 54,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
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
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
});