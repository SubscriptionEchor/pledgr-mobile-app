import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Switch,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Upload, Plus, Tag, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateCollectionScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSellable, setIsSellable] = useState(false);
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Parse selected posts and tags from URL params if available
  useEffect(() => {
    if (params.selectedPosts) {
      try {
        const parsedPosts = JSON.parse(params.selectedPosts as string);
        if (Array.isArray(parsedPosts)) {
          setSelectedPosts(parsedPosts);
        }
      } catch (error) {
        console.error('Failed to parse selected posts:', error);
      }
    }

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
  }, [params.selectedPosts, params.selectedTags]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCreateCollection = () => {
    // Here you would handle the actual creation of the collection
    // Then navigate back or to a success screen
    router.back();
  };

  const handlePricingOptions = () => {
    // Navigate to the Pricing Options screen
    router.push('/pricing-options' as any);
  };

  const handleAddPosts = () => {
    // If there are already selected tags, pass them to maintain state
    if (selectedTags.length > 0) {
      router.push({
        pathname: '/screens/creator/SelectPostsScreen',
        params: { selectedTags: JSON.stringify(selectedTags) }
      });
    } else {
      // Navigate to the Select Posts screen
      router.push('/screens/creator/SelectPostsScreen');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagSelection = () => {
    router.push('/screens/creator/TagSelectionScreen');
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
          Create Collection
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Title Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Title
          </Text>
          <TextInput
            style={{ 
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              color: colors.textPrimary
            }}
            placeholder="Enter collection title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={30}
          />
          <Text style={{ 
            alignSelf: 'flex-end', 
            marginTop: 4,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            color: colors.textSecondary
          }}>
            {title.length}/30
          </Text>
        </View>

        {/* Description Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Description (Optional)
          </Text>
          <TextInput
            style={{ 
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
              height: 120,
              textAlignVertical: 'top',
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              color: colors.textPrimary
            }}
            placeholder="Enter collection description"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={description}
            onChangeText={setDescription}
            maxLength={1000}
          />
          <Text style={{ 
            alignSelf: 'flex-end', 
            marginTop: 4,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            color: colors.textSecondary
          }}>
            {description.length}/1000
          </Text>
        </View>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8
            }}>
              <Text style={{ 
                fontFamily: fonts.medium, 
                fontSize: fontSize.md,
                color: colors.textPrimary,
              }}>
                Tags
              </Text>
              <TouchableOpacity 
                style={{ 
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: 'transparent',
                }}
                onPress={handleTagSelection}
              >
                <Text style={{ 
                  fontFamily: fonts.medium, 
                  fontSize: fontSize.sm,
                  color: colors.primary,
                }}>
                  Edit Tags
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
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
          </View>
        )}

        {/* Sellable Toggle */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary
          }}>
            Sell this collection
          </Text>
          <Switch
            value={isSellable}
            onValueChange={setIsSellable}
            trackColor={{ false: '#e5e7eb', true: colors.primary }}
            thumbColor={'#ffffff'}
          />
        </View>

        {/* Price Input - Only shown when isSellable is true */}
        {isSellable && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
              marginBottom: 8
            }}>
              Price (USD)
            </Text>
            <View style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
            }}>
              <Text style={{ 
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                color: colors.textPrimary,
                marginRight: 8
              }}>
                $
              </Text>
              <TextInput
                style={{ 
                  flex: 1,
                  padding: 12,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.md,
                  color: colors.textPrimary
                }}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        )}

        {/* Pricing Options Button - Only shown when isSellable is true */}
        {isSellable && (
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity 
              style={{ 
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 8,
                padding: 12,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent'
              }}
              onPress={handlePricingOptions}
            >
              <Text style={{ 
                fontFamily: fonts.medium, 
                fontSize: fontSize.md,
                color: colors.primary
              }}>
                Pricing Options
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Preview Image */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Preview Image
          </Text>
          <TouchableOpacity 
            style={{ 
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
              overflow: 'hidden'
            }}
            onPress={pickImage}
          >
            {previewImage ? (
              <Image 
                source={{ uri: previewImage }} 
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Upload size={40} color="#9ca3af" />
                <Text style={{ 
                  fontFamily: fonts.medium, 
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                  marginTop: 8
                }}>
                  Upload JPG, PNG, JPEG
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Posts Section */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8
          }}>
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
            }}>
              Posts
            </Text>
            {selectedPosts.length > 0 && (
              <Text style={{ 
                fontFamily: fonts.regular, 
                fontSize: fontSize.sm,
                color: colors.textSecondary,
              }}>
                {selectedPosts.length} posts selected
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={{ 
              borderWidth: 1,
              borderColor: colors.primary,
              borderRadius: 8,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent'
            }}
            onPress={handleAddPosts}
          >
            <Plus size={20} color={colors.primary} />
            <Text style={{ 
              marginLeft: 8,
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.primary
            }}>
              {selectedPosts.length > 0 ? 'Edit Posts' : 'Add Posts'}
            </Text>
          </TouchableOpacity>
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
            backgroundColor: title.length > 0 ? colors.primary : '#9ca3af',
            borderRadius: 8,
            padding: 16,
            marginLeft: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleCreateCollection}
          disabled={title.length === 0}
        >
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.buttonText
          }}>
            Create Collection
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 