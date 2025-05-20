import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for tags - in a real app, this would come from your API
const mockPosts = [
  { tags: ['dance', 'performance', 'live'] },
  { tags: ['tutorial', 'dance'] },
  { tags: ['behindthescenes', 'rehearsal', 'dance'] },
  { tags: ['workshop', 'community', 'learning'] },
  { tags: ['performance', 'contemporary'] },
  { tags: ['React', 'Mobile'] },
  { tags: ['TypeScript', 'Development'] },
  { tags: ['Design', 'UI/UX'] },
  { tags: ['Architecture', 'Mobile'] },
  { tags: ['React', 'State Management'] },
  { tags: ['Poll', 'Community'] },
  { tags: ['Podcast', 'Web'] },
  { tags: ['Live', 'Coding'] },
];

const generateTagOptions = () => {
  const tagCounts: Record<string, number> = {};
  mockPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  return Object.entries(tagCounts).map(([tag, count]) => ({
    tag,
    count
  }));
};

export default function TagSelectionScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const tagOptions = generateTagOptions();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleContinue = () => {
    // Navigate to SelectPostsScreen with the selected tags
    router.push({
      pathname: '/screens/creator/SelectPostsScreen',
      params: { selectedTags: JSON.stringify(selectedTags) }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Screen options={{ 
        headerShown: false,
      }} />

      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
      }}>
        <TouchableOpacity onPress={handleCancel}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ 
          marginLeft: 16, 
          fontFamily: fonts.bold, 
          fontSize: fontSize.xl,
          color: colors.textPrimary
        }}>
          Select Tags
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ 
          fontFamily: fonts.medium,
          fontSize: fontSize.md,
          color: colors.textSecondary,
          marginBottom: 16,
        }}>
          Select tags to filter posts for your collection
        </Text>

        {/* Tags List */}
        <View style={{ marginBottom: 20 }}>
          {tagOptions.map((tagOption) => (
            <TouchableOpacity 
              key={tagOption.tag}
              style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
              onPress={() => handleToggleTag(tagOption.tag)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ 
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  color: colors.textPrimary,
                }}>
                  {tagOption.tag}
                </Text>
                <View style={{
                  backgroundColor: '#E5E7EB',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginLeft: 8,
                }}>
                  <Text style={{ 
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    color: colors.textSecondary,
                  }}>
                    {tagOption.count} posts
                  </Text>
                </View>
              </View>
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: selectedTags.includes(tagOption.tag) ? colors.primary : colors.border,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: selectedTags.includes(tagOption.tag) ? colors.primary : 'transparent',
              }}>
                {selectedTags.includes(tagOption.tag) && <Check size={16} color={colors.buttonText} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={{ 
        flexDirection: 'row', 
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border
      }}>
        <TouchableOpacity 
          style={{ 
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 16,
            marginRight: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleCancel}
        >
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary
          }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ 
            flex: 1,
            backgroundColor: selectedTags.length > 0 ? colors.primary : '#9ca3af',
            borderRadius: 8,
            padding: 16,
            marginLeft: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleContinue}
          disabled={selectedTags.length === 0}
        >
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.buttonText
          }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 