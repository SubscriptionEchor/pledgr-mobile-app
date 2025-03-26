import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { Settings, FileText, MessageSquare, Store } from 'lucide-react-native';
import { BasicInformation } from '@/components/BasicInformation';

type TabType = 'basics' | 'settings' | 'welcome' | 'content';

interface Tab {
  id: TabType;
  label: string;
  icon: any;
}

const TABS: Tab[] = [
  { id: 'basics', label: 'Basics', icon: FileText },
  { id: 'settings', label: 'Page Settings', icon: Settings },
  { id: 'welcome', label: 'Welcome Note', icon: MessageSquare },
  { id: 'content', label: 'Posts & Products', icon: Store },
];

export default function EditPageScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('basics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basics':
        return <BasicInformation />;
      case 'settings':
        return (
          <View style={styles.tabContent}>
            <Text style={[
              styles.tabTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.xl,
              }
            ]}>
              Page Settings
            </Text>
            <Text style={[
              styles.tabDescription,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
              }
            ]}>
              Configure your page settings, visibility, and preferences.
            </Text>
          </View>
        );
      case 'welcome':
        return (
          <View style={styles.tabContent}>
            <Text style={[
              styles.tabTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.xl,
              }
            ]}>
              Welcome Note
            </Text>
            <Text style={[
              styles.tabDescription,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
              }
            ]}>
              Create a personalized welcome message for your visitors.
            </Text>
          </View>
        );
      case 'content':
        return (
          <View style={styles.tabContent}>
            <Text style={[
              styles.tabTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.xl,
              }
            ]}>
              Posts & Products
            </Text>
            <Text style={[
              styles.tabDescription,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
              }
            ]}>
              Manage your content, posts, and product listings.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Edit Page" />
      
      <View style={[styles.pillContainer, { borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.pill,
                  { backgroundColor: isActive ? colors.primary : 'rgba(0, 0, 0, 0.03)' },
                  isActive && styles.activePill
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <tab.icon
                  size={18}
                  color={isActive ? colors.buttonText : colors.textSecondary}
                  style={styles.pillIcon}
                />
                <Text style={[
                  styles.pillLabel,
                  {
                    color: isActive ? colors.buttonText : colors.textSecondary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                  }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pillContainer: {
    paddingVertical: 12,
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
    borderBottomWidth: 1,
  },
  pillsScroll: {
    gap: 8,
    paddingRight: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    gap: 6,
  },
  activePill: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pillIcon: {
    marginRight: 2,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Platform.OS === 'web' ? 40 : 20,
  },
  tabContent: {
    gap: 8,
  },
  tabTitle: {
    marginBottom: 4,
  },
  tabDescription: {
    lineHeight: 24,
  },
});