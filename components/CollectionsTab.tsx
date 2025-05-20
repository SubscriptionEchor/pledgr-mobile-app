import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Folder } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const CollectionsTab: React.FC = () => {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const priceBadgeBg = '#F1F5F9';

  const collections = [
    {
      id: 'col1',
      name: 'You have an upcoming session.',
      description: 'Make Your Own Emoji',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      price: '9.99',
      postCount: 12,
    },
    {
      id: 'col2',
      name: 'Choreography Workshop',
      description: 'Hip-Hop Basics',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      price: '14.99',
      postCount: 8,
    },
    {
      id: 'col3',
      name: 'Behind the Scenes',
      description: 'Exclusive rehearsal content',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      price: '7.99',
      postCount: 5,
    },
  ];

  // Split collections into rows of 2
  const rows = [];
  for (let i = 0; i < collections.length; i += 2) {
    rows.push(collections.slice(i, i + 2));
  }

  const mockPosts = [
    { tags: ['dance', 'performance', 'live'] },
    { tags: ['tutorial', 'dance'] },
    { tags: ['behindthescenes', 'rehearsal', 'dance'] },
    { tags: ['workshop', 'community', 'learning'] },
    { tags: ['performance', 'contemporary'] },
  ];

  // Calculate tag counts
  const tagCounts: Record<string, number> = {};
  mockPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  const tags = Object.entries(tagCounts) as [string, number][];

  const navigateToCreateCollection = () => {
    router.push('/screens/creator/CreateCollectionScreen');
  };

  const navigateToTagSelection = () => {
    router.push('/screens/creator/TagSelectionScreen');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Collections Section */}
        <View style={{ marginTop: 0, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={navigateToCreateCollection}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Create</Text>
          </TouchableOpacity>
        </View>
        
        {/* Vertically stacked collection cards */}
        <View style={{ marginBottom: 24 }}>
          {collections.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>No collections yet.</Text>
          ) : (
            <>
              {rows.map((row, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                  {row.map(col => (
                    <View
                      key={col.id}
                      style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        padding: 0,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Image with badges */}
                      <View style={{ width: '100%', aspectRatio: 1.2, position: 'relative', backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' }}>
                        <Image
                          source={{ uri: col.image }}
                          style={{ width: '100%', height: '100%', borderRadius: 10 }}
                          resizeMode="cover"
                        />
                        {/* Title and description */}
                        <View>
                          {/* Post count badge above title */}
                          <View style={{
                            alignSelf: 'flex-start',
                            marginTop: 8,
                            marginBottom: 4,
                            backgroundColor: priceBadgeBg,
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <Folder size={15} color="#B0B3B8" style={{ marginRight: 3 }} />
                            <Text style={{
                              color: colors.textPrimary,
                              fontFamily: fonts.bold,
                              fontSize: 13,
                              marginRight: 2,
                            }}>{col.postCount}</Text>
                            <Text style={{
                              color: colors.textSecondary,
                              fontFamily: fonts.medium,
                              fontSize: 12,
                            }}>posts</Text>
                          </View>
                        </View>
                      </View>
                      {/* Title and description */}
                      <View>
                        <Text
                          style={{
                            color: colors.textPrimary,
                            fontFamily: fonts.medium,
                            fontSize: 16,
                            marginBottom: 2,
                            marginTop: 8,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {col.name}
                        </Text>
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontFamily: fonts.medium,
                            fontSize: 14,
                          }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {col.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {/* If row has only one item, add a spacer to keep grid alignment */}
                  {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
              ))}
            </>
          )}
        </View>
        
        {/* Divider */}
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 20, width: '100%' }} />
        
        {/* Tags Section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 16 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>
            Tags
          </Text>
          <TouchableOpacity
            style={{
              borderColor: colors.primary,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 14,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={navigateToTagSelection}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.primary, fontFamily: fonts.medium, fontSize: 16 }}>Create with Tags</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tags List */}
        {tags.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>No tags yet.</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 6, rowGap: 6 }}>
            {tags.map(([tag, count]) => (
              <View
                key={tag}
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  minWidth: 60,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#181919', fontWeight: '600', marginRight: 6 }}>{tag}</Text>
                <View style={{
                  backgroundColor: '#E5E7EB',
                  borderRadius: 8,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                  minWidth: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: '#64748B', fontWeight: '500', fontSize: 13 }}>{count}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}; 