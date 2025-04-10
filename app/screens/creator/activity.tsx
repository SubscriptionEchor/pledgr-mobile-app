import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { UserPlus, Settings, FileText } from 'lucide-react-native';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  timestamp: string;
  icon: any;
}

const RECENT_ACTIVITIES: Activity[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Anderson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    action: 'Added as a team member',
    timestamp: 'Mar 21, 4:00 PM',
    icon: UserPlus,
  },
  {
    id: '2',
    user: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    action: 'Permissions updated to Editor',
    timestamp: 'Mar 21, 2:45 PM',
    icon: Settings,
  },
  {
    id: '3',
    user: {
      name: 'Sarah Anderson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    action: 'Created a new video post',
    timestamp: 'Mar 20, 9:15 PM',
    icon: FileText,
  },
];

export default function ActivityScreen() {
  const { colors, fonts, fontSize } = useTheme();

  const renderActivity = (activity: Activity) => (
    <View 
      key={activity.id}
      style={[styles.activityItem, { backgroundColor: colors.surface }]}
    >
      <View style={styles.activityContent}>
        <Image 
          source={{ uri: activity.user.avatar }}
          style={styles.avatar}
        />
        <View style={styles.activityDetails}>
          <View style={styles.activityHeader}>
            <Text style={[
              styles.userName,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              {activity.user.name}
            </Text>
            <Text style={[
              styles.timestamp,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              • {activity.timestamp}
            </Text>
          </View>
          <Text style={[
            styles.action,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            {activity.action}
          </Text>
        </View>
      </View>
      <View style={[
        styles.iconContainer,
        { backgroundColor: `${colors.primary}15` }
      ]}>
        <activity.icon size={20} color={colors.primary} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Recent Activity" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.activitiesList}>
          {RECENT_ACTIVITIES.map(renderActivity)}
        </View>
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
  content: {
    padding: 20,
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  activityDetails: {
    flex: 1,
    gap: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 14,
  },
  action: {
    fontSize: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});