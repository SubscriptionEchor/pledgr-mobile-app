import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { FolderOpen, Tag, Plus } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TabType = 'collections' | 'tags';

export default function CollectionScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('collections');

  const handleCreateCollection = () => {
    // Button action removed as requested
  };

  const handleCreateTagCollection = () => {
    // Button action removed as requested
  };

  const renderCollectionsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.headerWithAction}>
        <FolderOpen size={24} color={colors.textPrimary} />
        <Text style={[
          styles.headerTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.bold,
            fontSize: fontSize.xl,
            includeFontPadding: false
          }
        ]}>
          Collections
        </Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateCollection}
        >
          <Plus size={20} color={colors.buttonText} />
          <Text style={[
            styles.createButtonText,
            {
              color: colors.buttonText,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Create Collection
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.emptyStateContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.emptyIconContainer, { backgroundColor: colors.background }]}>
          <FolderOpen size={32} color={colors.textSecondary} />
        </View>
        <Text style={[
          styles.emptyTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
            includeFontPadding: false
          }
        ]}>
          No collections yet
        </Text>
        <Text style={[
          styles.emptyDescription,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
            includeFontPadding: false
          }
        ]}>
          Create collections to organize your content and make it easier for your audience to discover.
        </Text>
      </View>
    </View>
  );

  const renderTagsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.headerWithAction}>
        <Tag size={24} color={colors.textPrimary} />
        <Text style={[
          styles.headerTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.bold,
            fontSize: fontSize.xl,
            includeFontPadding: false
          }
        ]}>
          Tags
        </Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateTagCollection}
        >
          <Plus size={20} color={colors.buttonText} />
          <Text style={[
            styles.createButtonText,
            {
              color: colors.buttonText,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Create collection with tags
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.emptyStateContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.emptyIconContainer, { backgroundColor: colors.background }]}>
          <Tag size={32} color={colors.textSecondary} />
        </View>
        <Text style={[
          styles.emptyTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
            includeFontPadding: false
          }
        ]}>
          No tag collections yet
        </Text>
        <Text style={[
          styles.emptyDescription,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
            includeFontPadding: false
          }
        ]}>
          Create collections with tags to better organize your content.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Collections" />
      
      <View style={styles.tabsContainer}>
        <View style={[styles.tabs, { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'collections' && styles.activeTab
            ]}
            onPress={() => setActiveTab('collections')}
          >
            <FolderOpen size={18} color={activeTab === 'collections' ? colors.primary : '#666'} style={styles.tabIcon} />
            <Text style={[
              styles.tabText,
              {
                color: activeTab === 'collections' ? colors.primary : '#666',
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Collections
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'tags' && styles.activeTab
            ]}
            onPress={() => setActiveTab('tags')}
          >
            <Tag size={18} color={activeTab === 'tags' ? colors.primary : '#666'} style={styles.tabIcon} />
            <Text style={[
              styles.tabText,
              {
                color: activeTab === 'tags' ? colors.primary : '#666',
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Tags
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'collections' ? renderCollectionsTab() : renderTagsTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tabIcon: {
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#1e88e5',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 24,
  },
  headerWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    marginLeft: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
  },
  emptyStateContainer: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 24,
  },
});