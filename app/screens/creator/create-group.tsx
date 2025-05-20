import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, StatusBar } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Camera, Users, UserCheck, CreditCard, Check, Square, CheckSquare } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// Mock tier data
const mockTiers = [
  { id: '1', name: 'Basic', price: 5.99 },
  { id: '2', name: 'Premium', price: 9.99 },
  { id: '3', name: 'Gold', price: 14.99 },
  { id: '4', name: 'Platinum', price: 24.99 },
];

export default function CreateGroupScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  
  // Form state
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [access, setAccess] = useState<'all' | 'paid' | 'select'>('all');
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  // Character counts
  const nameCharLimit = 30;
  const descriptionCharLimit = 200;

  // Handle image selection
  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.canceled) {
      setGroupImage(pickerResult.assets[0].uri);
    }
  };

  // Toggle tier selection
  const toggleTierSelection = (tierId: string) => {
    if (selectedTiers.includes(tierId)) {
      setSelectedTiers(selectedTiers.filter(id => id !== tierId));
    } else {
      setSelectedTiers([...selectedTiers, tierId]);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (!description.trim()) {
      alert('Please enter a group description');
      return;
    }

    if (!groupImage) {
      alert('Please select a group image');
      return;
    }

    // Check if tiers are selected when access is set to 'select'
    if (access === 'select' && selectedTiers.length === 0) {
      alert('Please select at least one tier');
      return;
    }

    // Here you would handle the API call to create the group
    console.log({
      groupImage,
      name,
      description,
      access,
      selectedTiers: access === 'select' ? selectedTiers : []
    });
    
    // Navigate back on success
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Screen options={{ 
        headerShown: false,
      }} />

      {/* Header */}
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
          Create Group
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Group Image */}
        <View style={{ 
          marginBottom: 20,
          alignItems: 'center'
        }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8,
            alignSelf: 'center'
          }}>
            Group Image
          </Text>
          
          <TouchableOpacity 
            style={{ 
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 60,
              height: 120,
              width: 120,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.surface,
              overflow: 'hidden'
            }} 
            onPress={handleImagePicker}
          >
            {groupImage ? (
              <Image source={{ uri: groupImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                padding: 10
              }}>
                <Camera size={32} color={colors.textSecondary} />
                <Text style={{ 
                  fontFamily: fonts.medium, 
                  fontSize: fontSize.xs,
                  color: colors.textSecondary,
                  marginTop: 4,
                  textAlign: 'center'
                }}>
                  Tap to add
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Group Name */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Group Name
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
            value={name}
            onChangeText={(text) => setName(text.slice(0, nameCharLimit))}
            placeholder="Enter group name..."
            placeholderTextColor={colors.textSecondary}
            maxLength={nameCharLimit}
          />
          
          <Text style={{ 
            alignSelf: 'flex-end', 
            marginTop: 4,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            color: name.length > nameCharLimit * 0.8 ? 
              (name.length > nameCharLimit ? colors.error : colors.warning) : 
              colors.textSecondary
          }}>
            {name.length}/{nameCharLimit}
          </Text>
        </View>

        {/* Description */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Description
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
            value={description}
            onChangeText={(text) => setDescription(text.slice(0, descriptionCharLimit))}
            placeholder="Enter group description..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={descriptionCharLimit}
          />
          
          <Text style={{ 
            alignSelf: 'flex-end', 
            marginTop: 4,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            color: description.length > descriptionCharLimit * 0.8 ? 
              (description.length > descriptionCharLimit ? colors.error : colors.warning) : 
              colors.textSecondary
          }}>
            {description.length}/{descriptionCharLimit}
          </Text>
        </View>

        {/* Access Options */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Who can access?
          </Text>
          
          {/* All Members Option */}
          <TouchableOpacity 
            style={{ 
              borderWidth: 1,
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: access === 'all' ? colors.primary : colors.border
            }} 
            onPress={() => setAccess('all')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: access === 'all' ? colors.primary + '20' : colors.surface,
                marginRight: 16 
              }}>
                <Users size={22} color={access === 'all' ? colors.primary : colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: fontSize.md, 
                  color: colors.textPrimary, 
                  fontFamily: fonts.medium,
                  marginBottom: 4 
                }}>
                  All members
                </Text>
                <Text style={{ 
                  fontSize: fontSize.sm, 
                  color: colors.textSecondary, 
                  fontFamily: fonts.regular 
                }}>
                  Anyone can join and participate
                </Text>
              </View>
            </View>
            {access === 'all' && (
              <View style={{ 
                width: 24, 
                height: 24, 
                borderRadius: 12, 
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center' 
              }}>
                <Check size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Paid Members Option */}
          <TouchableOpacity 
            style={{ 
              borderWidth: 1,
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: access === 'paid' ? colors.primary : colors.border
            }} 
            onPress={() => setAccess('paid')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: access === 'paid' ? colors.primary + '20' : colors.surface,
                marginRight: 16 
              }}>
                <CreditCard size={22} color={access === 'paid' ? colors.primary : colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: fontSize.md, 
                  color: colors.textPrimary, 
                  fontFamily: fonts.medium,
                  marginBottom: 4 
                }}>
                  Paid members only
                </Text>
                <Text style={{ 
                  fontSize: fontSize.sm, 
                  color: colors.textSecondary, 
                  fontFamily: fonts.regular 
                }}>
                  Only paying members can access
                </Text>
              </View>
            </View>
            {access === 'paid' && (
              <View style={{ 
                width: 24, 
                height: 24, 
                borderRadius: 12, 
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center' 
              }}>
                <Check size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Select Tiers Option */}
          <TouchableOpacity 
            style={{ 
              borderWidth: 1,
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: access === 'select' ? colors.primary : colors.border
            }} 
            onPress={() => setAccess('select')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: access === 'select' ? colors.primary + '20' : colors.surface,
                marginRight: 16 
              }}>
                <UserCheck size={22} color={access === 'select' ? colors.primary : colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: fontSize.md, 
                  color: colors.textPrimary, 
                  fontFamily: fonts.medium,
                  marginBottom: 4 
                }}>
                  Select tiers
                </Text>
                <Text style={{ 
                  fontSize: fontSize.sm, 
                  color: colors.textSecondary, 
                  fontFamily: fonts.regular 
                }}>
                  Choose specific membership tiers
                </Text>
              </View>
            </View>
            {access === 'select' && (
              <View style={{ 
                width: 24, 
                height: 24, 
                borderRadius: 12, 
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center' 
              }}>
                <Check size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Tier Selection UI - Only visible when "Select tiers" is chosen */}
          {access === 'select' && (
            <View style={{ 
              marginTop: 8,
              marginLeft: 16,
              marginBottom: 8
            }}>
              <Text style={{ 
                fontFamily: fonts.medium, 
                fontSize: fontSize.sm,
                color: colors.textPrimary,
                marginBottom: 12
              }}>
                Select the tiers that can access this group:
              </Text>
              
              {mockTiers.map((tier) => (
                <TouchableOpacity
                  key={tier.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}
                  onPress={() => toggleTierSelection(tier.id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {selectedTiers.includes(tier.id) ? (
                      <CheckSquare size={22} color={colors.primary} />
                    ) : (
                      <Square size={22} color={colors.textSecondary} />
                    )}
                    <Text style={{ 
                      marginLeft: 12,
                      fontFamily: fonts.medium,
                      fontSize: fontSize.md,
                      color: colors.textPrimary
                    }}>
                      {tier.name}
                    </Text>
                  </View>
                  <Text style={{ 
                    fontFamily: fonts.regular,
                    fontSize: fontSize.md,
                    color: colors.textSecondary
                  }}>
                    ${tier.price}/month
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 16,
            marginLeft: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleSubmit}
        >
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.buttonText
          }}>
            Create Group
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 