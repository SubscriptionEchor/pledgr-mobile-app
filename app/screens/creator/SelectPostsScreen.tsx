import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Image, 
  ScrollView, 
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Check, ChevronDown, Search, X } from 'lucide-react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for available posts - replace with actual API data
const mockPosts = [
  { 
    id: '1', 
    title: 'Getting Started with React Native', 
    image: 'https://picsum.photos/200/300', 
    type: 'Text',
    tags: ['React', 'Mobile'],
    publishedAt: '2023-05-15' 
  },
  { 
    id: '2', 
    title: 'Advanced TypeScript Tips', 
    image: 'https://picsum.photos/200/301', 
    type: 'Video',
    tags: ['TypeScript', 'Development'],
    publishedAt: '2023-06-22' 
  },
  { 
    id: '3', 
    title: 'UI Design Fundamentals', 
    image: 'https://picsum.photos/200/302', 
    type: 'Image',
    tags: ['Design', 'UI/UX'],
    publishedAt: '2023-07-10' 
  },
  { 
    id: '4', 
    title: 'Mobile App Architecture', 
    image: 'https://picsum.photos/200/303', 
    type: 'Text',
    tags: ['Architecture', 'Mobile'],
    publishedAt: '2023-08-05' 
  },
  { 
    id: '5', 
    title: 'State Management in React', 
    image: 'https://picsum.photos/200/304', 
    type: 'Link',
    tags: ['React', 'State Management'],
    publishedAt: '2023-09-18' 
  },
  { 
    id: '6', 
    title: 'Community Poll: Best Framework', 
    image: 'https://picsum.photos/200/305', 
    type: 'Poll',
    tags: ['Poll', 'Community'],
    publishedAt: '2023-10-05' 
  },
  { 
    id: '7', 
    title: 'Podcast: Future of Web Development', 
    image: 'https://picsum.photos/200/306', 
    type: 'Audio',
    tags: ['Podcast', 'Web'],
    publishedAt: '2023-11-12' 
  },
  { 
    id: '8', 
    title: 'Live Coding Session', 
    image: 'https://picsum.photos/200/307', 
    type: 'Livestream',
    tags: ['Live', 'Coding'],
    publishedAt: '2023-12-01' 
  },
];

// Updated media types
const mediaTypes = ['All types', 'Text', 'Livestream', 'Image', 'Link', 'Poll', 'Audio'];

// Generate tag options with counts
const generateTagOptions = () => {
  const tagCounts: Record<string, number> = {};
  mockPosts.forEach(post => {
    post.tags.forEach(tag => {
      if (tagCounts[tag]) {
        tagCounts[tag]++;
      } else {
        tagCounts[tag] = 1;
      }
    });
  });
  
  // Convert to array of objects with tag and count
  return Object.entries(tagCounts).map(([tag, count]) => ({
    tag,
    count
  }));
};

const tagOptions = generateTagOptions();

export default function SelectPostsScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('All types');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [mediaTypeDropdownOpen, setMediaTypeDropdownOpen] = useState(false);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);

  // Parse selected tags from URL params if available
  useEffect(() => {
    if (params.selectedTags) {
      try {
        const parsedTags = JSON.parse(params.selectedTags as string);
        if (Array.isArray(parsedTags)) {
          setSelectedTags(parsedTags);
        }
      } catch (error) {
        console.error('Failed to parse selected tags:', error);
      }
    }
  }, [params.selectedTags]);

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTogglePost = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAddToCollection = () => {
    // Navigate to CreateCollectionScreen with selected posts
    router.push({
      pathname: '/screens/creator/CreateCollectionScreen',
      params: { 
        selectedPosts: JSON.stringify(selectedPosts),
        selectedTags: JSON.stringify(selectedTags)
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filter posts based on search query, filters, and selected tags
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedMediaType === 'All types' || post.type === selectedMediaType;
    
    // Check if post contains ANY of the selected tags (OR condition)
    const matchesTags = selectedTags.length === 0 || 
      post.tags.some(tag => selectedTags.includes(tag));
    
    return matchesSearch && matchesType && matchesTags;
  });

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setMediaTypeDropdownOpen(false);
    setTagsDropdownOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Screen options={{ 
        headerShown: false,
      }} />

      {/* Backdrop to close dropdowns when clicking outside */}
      {(mediaTypeDropdownOpen || tagsDropdownOpen) && (
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            zIndex: 1,
          }} />
        </TouchableWithoutFeedback>
      )}

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
          Add Posts
        </Text>
      </View>

      <View style={{ padding: 16, zIndex: 3 }}>
        {/* Search Bar */}
        <View style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          marginBottom: 16,
        }}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={{ 
              flex: 1,
              padding: 12,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              color: colors.textPrimary
            }}
            placeholder="Search posts"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Selected Tags Badges */}
        {selectedTags.length > 0 && (
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            marginBottom: 12,
            gap: 8,
          }}>
            {selectedTags.map(tag => (
              <View
                key={tag}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.primary + '20', // 20% opacity
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ 
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  color: colors.primary,
                  marginRight: 4,
                }}>
                  {tag}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <X size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Filters Row */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginBottom: 16,
          zIndex: 2,
        }}>
          {/* Media Type Dropdown */}
          <View style={{ width: '48%', zIndex: mediaTypeDropdownOpen ? 20 : 2 }}>
            <Text style={{ 
              fontFamily: fonts.medium,
              fontSize: fontSize.sm,
              color: colors.textSecondary,
              marginBottom: 8,
            }}>
              Media Type
            </Text>
            
            {/* Media Type Dropdown Button */}
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.background,
              }}
              onPress={() => {
                setMediaTypeDropdownOpen(!mediaTypeDropdownOpen);
                setTagsDropdownOpen(false);
              }}
            >
              <Text style={{ 
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                color: colors.textPrimary,
              }}>
                {selectedMediaType}
              </Text>
              <ChevronDown size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            
            {/* Media Type Dropdown Menu */}
            {mediaTypeDropdownOpen && (
              <View style={{ 
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 4,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                backgroundColor: colors.background,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                zIndex: 20,
              }}>
                {mediaTypes.map((type) => (
                  <TouchableOpacity 
                    key={type}
                    style={{ 
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                    }}
                    onPress={() => {
                      setSelectedMediaType(type);
                      setMediaTypeDropdownOpen(false);
                    }}
                  >
                    <Text style={{ 
                      fontFamily: fonts.medium,
                      fontSize: fontSize.md,
                      color: type === selectedMediaType ? colors.primary : colors.textPrimary,
                    }}>
                      {type}
                    </Text>
                    {type === selectedMediaType && <Check size={18} color={colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Tags Dropdown */}
          <View style={{ width: '48%', zIndex: tagsDropdownOpen ? 20 : 2 }}>
            <Text style={{ 
              fontFamily: fonts.medium,
              fontSize: fontSize.sm,
              color: colors.textSecondary,
              marginBottom: 8,
            }}>
              Tags
            </Text>
            
            {/* Tags Dropdown Button */}
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.background,
              }}
              onPress={() => {
                setTagsDropdownOpen(!tagsDropdownOpen);
                setMediaTypeDropdownOpen(false);
              }}
            >
              <Text style={{ 
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                color: colors.textPrimary,
              }}>
                {selectedTags.length > 0 ? `${selectedTags.length} selected` : 'All tags'}
              </Text>
              <ChevronDown size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            
            {/* Tags Dropdown Menu */}
            {tagsDropdownOpen && (
              <View style={{ 
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 4,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                backgroundColor: colors.background,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                maxHeight: 200,
                zIndex: 20,
              }}>
                <ScrollView>
                  <TouchableOpacity 
                    style={{ 
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                    }}
                    onPress={() => {
                      setSelectedTags([]);
                      setTagsDropdownOpen(false);
                    }}
                  >
                    <Text style={{ 
                      fontFamily: fonts.medium,
                      fontSize: fontSize.md,
                      color: selectedTags.length === 0 ? colors.primary : colors.textPrimary,
                    }}>
                      All tags
                    </Text>
                    {selectedTags.length === 0 && <Check size={18} color={colors.primary} />}
                  </TouchableOpacity>
                  
                  {tagOptions.map((tagOption) => (
                    <TouchableOpacity 
                      key={tagOption.tag}
                      style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 16,
                      }}
                      onPress={() => {
                        if (selectedTags.includes(tagOption.tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tagOption.tag));
                        } else {
                          setSelectedTags([...selectedTags, tagOption.tag]);
                        }
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ 
                          fontFamily: fonts.medium,
                          fontSize: fontSize.md,
                          color: selectedTags.includes(tagOption.tag) ? colors.primary : colors.textPrimary,
                        }}>
                          {tagOption.tag}
                        </Text>
                        <Text style={{ 
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          color: colors.textSecondary,
                          marginLeft: 8,
                        }}>
                          ({tagOption.count})
                        </Text>
                      </View>
                      {selectedTags.includes(tagOption.tag) && <Check size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Posts List */}
      <FlatList
        style={{ flex: 1, paddingHorizontal: 16 }}
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ 
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              marginBottom: 12,
              overflow: 'hidden',
            }}
            onPress={() => handleTogglePost(item.id)}
          >
            {/* Post Image */}
            <Image 
              source={{ uri: item.image }} 
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
            
            {/* Post Details */}
            <View style={{ 
              flex: 1, 
              padding: 12,
              justifyContent: 'space-between',
            }}>
              <View>
                <Text style={{ 
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  color: colors.textPrimary,
                  marginBottom: 4,
                }} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={{ 
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                  marginBottom: 4,
                }}>
                  {item.type}
                </Text>
                <Text style={{ 
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                }}>
                  Published: {formatDate(item.publishedAt)}
                </Text>
              </View>
            </View>

            {/* Checkbox */}
            <View style={{ 
              padding: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: selectedPosts.includes(item.id) ? colors.primary : colors.border,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: selectedPosts.includes(item.id) ? colors.primary : 'transparent',
              }}>
                {selectedPosts.includes(item.id) && <Check size={16} color={colors.buttonText} />}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

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
            backgroundColor: selectedPosts.length > 0 ? colors.primary : '#9ca3af',
            borderRadius: 8,
            padding: 16,
            marginLeft: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleAddToCollection}
          disabled={selectedPosts.length === 0}
        >
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.buttonText
          }}>
            Add to Collection
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 