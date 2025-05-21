import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { UserPlus, Settings, FileText, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import React, { useState, useMemo } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) {
      return RECENT_ACTIVITIES;
    }
    
    const query = searchQuery.toLowerCase();
    return RECENT_ACTIVITIES.filter(activity => 
      activity.user.name.toLowerCase().includes(query) || 
      activity.action.toLowerCase().includes(query) ||
      activity.timestamp.toLowerCase().includes(query)
    );
  }, [searchQuery, RECENT_ACTIVITIES]);

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
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBarComponent />
      <SubHeader title="Recent Activity" />
      
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { 
            color: colors.textPrimary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
          }]}
          placeholder="Search activities..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{ color: colors.primary, fontFamily: fonts.medium }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredActivities.length > 0 ? (
          <View style={styles.activitiesList}>
            {filteredActivities.map(renderActivity)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { 
              color: colors.textSecondary,
              fontFamily: fonts.medium,
              fontSize: fontSize.lg,
            }]}>
              No activities found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 12,
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    textAlign: 'center',
  },
});