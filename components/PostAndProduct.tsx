import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { Tag, Plus, X } from 'lucide-react-native';

interface FeaturedTag {
  id: string;
  name: string;
  posts: number;
}

interface PostAndProductProps {
  onAddTags: () => void;
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
}

export function PostAndProduct({ onAddTags, selectedTags, onRemoveTag }: PostAndProductProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [featuredTags, setFeaturedTags] = useState<FeaturedTag[]>([]);

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
      >
        <View style={styles.header}>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.bold,
              fontSize: fontSize['2xl'],
            }
          ]}>
            Featured Tags
          </Text>
        </View>

        <Text style={[
          styles.description,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
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
              }
            ]}>
              No tags available
            </Text>
            <Text style={[
              styles.emptyStateDescription,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
              }
            ]}>
              Add tags to help organize and categorize your content
            </Text>
            <TouchableOpacity
              style={[styles.addTagButton, { backgroundColor: colors.primary }]}
              onPress={onAddTags}>
              <Plus size={20} color={colors.buttonText} />
              <Text style={[
                styles.addTagButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                }
              ]}>
                Add Tags
              </Text>
            </TouchableOpacity>
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

      {featuredTags.length > 0 && (
        <TouchableOpacity
          style={[
            styles.floatingButton,
            { backgroundColor: colors.primary }
          ]}
          onPress={onAddTags}>
          <Plus size={24} color={colors.buttonText} />
        </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'web' ? 100 : 80, // Extra padding for FAB
  },
  header: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 24,
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
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  addTagButtonText: {
    fontSize: 16,
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
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});