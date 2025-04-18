import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { Tag, Plus, X, Music } from 'lucide-react-native';
import { Switch } from '@/components/Switch';

interface FeaturedTag {
  id: string;
  name: string;
  posts: number;
}

interface PostAndProductProps {
  onAddTags: () => void;
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
  onInputFocus?: (position: number) => void;
}

export function PostAndProduct({ onAddTags, selectedTags, onRemoveTag, onInputFocus }: PostAndProductProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [featuredTags, setFeaturedTags] = useState<FeaturedTag[]>([]);
  const [allowAudioDownload, setAllowAudioDownload] = useState(false);

  // Update featured tags when selectedTags changes
  useEffect(() => {
    const newFeaturedTags = selectedTags.map((tag, index) => ({
      id: `${index + 1}`,
      name: tag,
      posts: Math.floor(Math.random() * 20) + 1,
    }));
    setFeaturedTags(newFeaturedTags);
  }, [selectedTags]);

  const handleRemoveTag = (tagId: string) => {
    const tagToRemove = featuredTags.find(tag => tag.id === tagId);
    if (tagToRemove) {
      onRemoveTag(tagToRemove.name);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: fontSize.xl,
                includeFontPadding: false,
                marginBottom: 16,
              }
            ]}>
              Content Settings
            </Text>
        {/* Audio Settings Section */}
        <View style={[styles.audioSection, { backgroundColor: colors.surface }]}>
          <View style={styles.audioHeader}>
            <View style={styles.audioTitleContainer}>
              <Text style={[
                styles.audioTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Audio Settings
              </Text>
            </View>
            <Switch
              value={allowAudioDownload}
              onValueChange={setAllowAudioDownload}
            />
          </View>
          <Text style={[
            styles.audioDescription,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            Allow members to download audio files from posts and products
          </Text>
        </View>

        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: fontSize.xl,
                includeFontPadding: false
              }
            ]}>
              Featured Tags
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={onAddTags}>
              <Plus size={20} color={colors.buttonText} />
              <Text style={[
                styles.addButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Add Tags
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[
          styles.description,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            includeFontPadding: false
          }
        ]}>
          Highlight important tags to help visitors discover your content
        </Text>

        {featuredTags.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Tag size={24} color={colors.textSecondary} />
            <Text style={[
              styles.emptyStateTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.lg,
                includeFontPadding: false
              }
            ]}>
              No tags available
            </Text>
            <Text style={[
              styles.emptyStateDescription,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              Add tags to help organize and categorize your content
            </Text>
          </View>
        ) : (
          <View style={styles.tagGrid}>
            {featuredTags.map(tag => (
              <View
                key={tag.id}
                style={[
                  styles.tagCard,
                  { backgroundColor: colors.surface }
                ]}>
                <View style={styles.tagContent}>
                  <Tag size={20} color={colors.primary} />
                  <View style={styles.tagInfo}>
                    <Text style={[
                      styles.tagName,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      {tag.name}
                    </Text>
                    <Text style={[
                      styles.tagPosts,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      {tag.posts} {tag.posts === 1 ? 'post' : 'posts'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveTag(tag.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Add padding to account for the save button
  },
  audioSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 12,
  },
  audioIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 18,
  },
  audioDescription: {
    lineHeight: 20,
    marginVertical: 6,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
  },
  description: {
    marginBottom: 24,
    marginTop: 6,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateTitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  emptyStateDescription: {
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  tagGrid: {
    gap: 12,
  },
  tagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagInfo: {
    gap: 4,
  },
  tagName: {
    fontSize: 16,
  },
  tagPosts: {
    fontSize: 14,
  },
});