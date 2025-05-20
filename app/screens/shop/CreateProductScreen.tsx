import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Upload, Eye, ChevronDown, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define document asset type
interface DocumentAsset {
  uri: string;
  name?: string;
  mimeType?: string;
  size?: number;
}

const fileTypeOptions = [
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
  { label: 'Images', value: 'images' },
  { label: 'Other files', value: 'other' },
];

export default function CreateProductScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  
  const [otherFiles, setOtherFiles] = useState<string[]>([]);
  
  const [attachments, setAttachments] = useState<string[]>([]);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleCancel = () => {
    router.back();
  };

  const handleCreateProduct = () => {
    // Here you would handle the actual creation of the product
    // Then navigate back or to a success screen
    router.back();
  };

  const handlePricingOptions = () => {
    // Navigate to the Pricing Options screen
    router.push('/pricing-options' as any);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFileType = (fileType: string) => {
    setSelectedFileType(fileType);
    setIsDropdownOpen(false);
  };

  const pickImage = async (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const pickAudio = async (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
      // For audio files, we'll use the image picker but only allow audio files
      // Note: On many devices this may not work perfectly due to limitations
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!result.canceled) {
        setter(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking audio file:", error);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImageUris = result.assets.map(asset => asset.uri);
      setImageFiles([...imageFiles, ...newImageUris]);
    }
  };

  const pickDocuments = async (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    try {
      // For documents, we'll use the image picker with all media types
      // This is a limitation but will work for the UI demo
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newFileUris = result.assets.map(asset => asset.uri);
        setter(prevFiles => [...prevFiles, ...newFileUris]);
      }
    } catch (error) {
      console.error("Error picking documents:", error);
    }
  };

  const removeFile = (uri: string, fileList: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(fileList.filter(fileUri => fileUri !== uri));
  };

  const renderFileTypeSelection = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        fontFamily: fonts.medium, 
        fontSize: fontSize.md,
        color: colors.textPrimary,
        marginBottom: 8
      }}>
        Product file type
      </Text>
      <TouchableOpacity 
        style={{ 
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 14,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={toggleDropdown}
      >
        <Text style={{ 
          fontFamily: fonts.regular, 
          fontSize: fontSize.md,
          color: selectedFileType ? colors.textPrimary : colors.textSecondary
        }}>
          {selectedFileType ? fileTypeOptions.find(option => option.value === selectedFileType)?.label : 'Select file type'}
        </Text>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      {isDropdownOpen && (
        <View style={{ 
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          marginTop: 4,
          backgroundColor: colors.background,
        }}>
          {fileTypeOptions.map(option => (
            <TouchableOpacity 
              key={option.value}
              style={{ 
                padding: 14,
              }}
              onPress={() => selectFileType(option.value)}
            >
              <Text style={{ 
                fontFamily: fonts.regular, 
                fontSize: fontSize.md,
                color: colors.textPrimary
              }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderFileUploadSection = () => {
    if (!selectedFileType) return null;

    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ 
          fontFamily: fonts.medium, 
          fontSize: fontSize.md,
          color: colors.textPrimary,
          marginBottom: 8
        }}>
          Add the file you want to sell. You can sell videos, audio, images or other digital files, like PDFs.
        </Text>
        
        {selectedFileType === 'video' && (
          <View>
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
              marginBottom: 8,
              marginTop: 16
            }}>
              Video URL
            </Text>
            <TextInput
              style={{ 
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                color: colors.textPrimary,
                marginBottom: 16
              }}
              placeholder="Enter video URL"
              placeholderTextColor={colors.textSecondary}
              value={videoUrl}
              onChangeText={setVideoUrl}
            />
            
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
              marginBottom: 8
            }}>
              Video preview URL
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
              placeholder="Enter video preview URL"
              placeholderTextColor={colors.textSecondary}
              value={videoPreviewUrl}
              onChangeText={setVideoPreviewUrl}
            />
          </View>
        )}
        
        {selectedFileType === 'audio' && (
          <View>
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
              marginBottom: 8,
              marginTop: 16
            }}>
              Upload audio file
            </Text>
            <TouchableOpacity 
              style={{ 
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
                backgroundColor: audioFile ? colors.primary + '10' : '#f9fafb',
                height: 80
              }}
              onPress={() => pickAudio(setAudioFile)}
            >
              {audioFile ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ 
                    fontFamily: fonts.medium, 
                    fontSize: fontSize.md,
                    color: colors.primary
                  }} numberOfLines={1} ellipsizeMode="middle">
                    Audio file selected
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Upload size={24} color="#9ca3af" />
                  <Text style={{ 
                    fontFamily: fonts.medium, 
                    fontSize: fontSize.sm,
                    color: colors.textSecondary,
                    marginTop: 8
                  }}>
                    Upload audio file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
              marginBottom: 8
            }}>
              Audio preview
            </Text>
            <TouchableOpacity 
              style={{ 
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: audioPreview ? colors.primary + '10' : '#f9fafb',
                height: 80
              }}
              onPress={() => pickAudio(setAudioPreview)}
            >
              {audioPreview ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ 
                    fontFamily: fonts.medium, 
                    fontSize: fontSize.md,
                    color: colors.primary
                  }} numberOfLines={1} ellipsizeMode="middle">
                    Preview audio selected
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Upload size={24} color="#9ca3af" />
                  <Text style={{ 
                    fontFamily: fonts.medium, 
                    fontSize: fontSize.sm,
                    color: colors.textSecondary,
                    marginTop: 8
                  }}>
                    Upload audio preview
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {selectedFileType === 'images' && (
          <View>
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
              marginBottom: 8,
              marginTop: 16
            }}>
              Upload image files
            </Text>
            <TouchableOpacity 
              style={{ 
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                height: 80,
                marginBottom: 12
              }}
              onPress={pickImages}
            >
              <View style={{ alignItems: 'center' }}>
                <Upload size={24} color="#9ca3af" />
                <Text style={{ 
                  fontFamily: fonts.medium, 
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                  marginTop: 8
                }}>
                  Upload image files
                </Text>
              </View>
            </TouchableOpacity>
            
            {imageFiles.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {imageFiles.map((uri, index) => (
                  <View key={index} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden' }}>
                    <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        borderRadius: 12,
                        padding: 4
                      }}
                      onPress={() => removeFile(uri, imageFiles, setImageFiles)}
                    >
                      <X size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {selectedFileType === 'other' && (
          <View>
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.textPrimary,
              marginBottom: 8,
              marginTop: 16
            }}>
              Upload files
            </Text>
            <TouchableOpacity 
              style={{ 
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                height: 80,
                marginBottom: 12
              }}
              onPress={() => pickDocuments(setOtherFiles)}
            >
              <View style={{ alignItems: 'center' }}>
                <Upload size={24} color="#9ca3af" />
                <Text style={{ 
                  fontFamily: fonts.medium, 
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                  marginTop: 8
                }}>
                  Upload files
                </Text>
              </View>
            </TouchableOpacity>
            
            {otherFiles.length > 0 && (
              <View style={{ gap: 8 }}>
                {otherFiles.map((uri, index) => (
                  <View key={index} style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: colors.primary + '10',
                    padding: 12,
                    borderRadius: 8
                  }}>
                    <Text style={{ 
                      fontFamily: fonts.regular, 
                      fontSize: fontSize.sm,
                      color: colors.textPrimary,
                      flex: 1
                    }} numberOfLines={1} ellipsizeMode="middle">
                      {uri.split('/').pop()}
                    </Text>
                    <TouchableOpacity onPress={() => removeFile(uri, otherFiles, setOtherFiles)}>
                      <X size={18} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderAttachmentsSection = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ 
        fontFamily: fonts.medium, 
        fontSize: fontSize.md,
        color: colors.textPrimary,
        marginBottom: 8
      }}>
        Attachments
      </Text>
      <TouchableOpacity 
        style={{ 
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 14,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
          height: 80,
          marginBottom: 12
        }}
        onPress={() => pickDocuments(setAttachments)}
      >
        <View style={{ alignItems: 'center' }}>
          <Upload size={24} color="#9ca3af" />
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginTop: 8
          }}>
            Add attachments
          </Text>
        </View>
      </TouchableOpacity>
      
      {attachments.length > 0 && (
        <View style={{ gap: 8 }}>
          {attachments.map((uri, index) => (
            <View key={index} style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: colors.primary + '10',
              padding: 12,
              borderRadius: 8
            }}>
              <Text style={{ 
                fontFamily: fonts.regular, 
                fontSize: fontSize.sm,
                color: colors.textPrimary,
                flex: 1
              }} numberOfLines={1} ellipsizeMode="middle">
                {uri.split('/').pop()}
              </Text>
              <TouchableOpacity onPress={() => removeFile(uri, attachments, setAttachments)}>
                <X size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

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
          Add Product
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Product Name Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Product name
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
            placeholder="Enter product name"
            placeholderTextColor={colors.textSecondary}
            value={productName}
            onChangeText={setProductName}
            maxLength={100}
          />
          <Text style={{ 
            alignSelf: 'flex-end', 
            marginTop: 4,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            color: colors.textSecondary
          }}>
            {productName.length}/100
          </Text>
        </View>

        {/* Price Section */}
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

        {/* Pricing Options Button */}
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

        {/* Description Input */}
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
              height: 150,
              textAlignVertical: 'top',
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              color: colors.textPrimary
            }}
            placeholder="Enter product description"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={description}
            onChangeText={setDescription}
            maxLength={2000}
          />
          <Text style={{ 
            alignSelf: 'flex-end', 
            marginTop: 4,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            color: colors.textSecondary
          }}>
            {description.length}/2000
          </Text>
        </View>

        {/* Product File Section */}
        {renderFileTypeSelection()}
        {renderFileUploadSection()}
        
        {/* Attachments Section */}
        {renderAttachmentsSection()}
        
        {/* Preview Section */}
        <View style={{ marginBottom: 60 }}>
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary,
            marginBottom: 8
          }}>
            Preview
          </Text>
          <Text style={{ 
            fontFamily: fonts.regular, 
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginBottom: 12
          }}>
            Upload the main image for your product details page and in your shop. Recommended dimensions
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
            onPress={() => pickImage(setPreviewImage)}
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
                  Upload preview image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={{ 
        flexDirection: 'row', 
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
        justifyContent: 'space-between'
      }}>
        <TouchableOpacity 
          style={{ 
            width: 48,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8
          }}
        >
          <Eye size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 12 }}>
          <TouchableOpacity 
            style={{ 
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 14,
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
              backgroundColor: productName.length > 0 ? colors.primary : '#9ca3af',
              borderRadius: 8,
              padding: 14,
              marginLeft: 8,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={handleCreateProduct}
            disabled={productName.length === 0}
          >
            <Text style={{ 
              fontFamily: fonts.medium, 
              fontSize: fontSize.md,
              color: colors.buttonText
            }}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 