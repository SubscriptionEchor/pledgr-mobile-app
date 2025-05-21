import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Switch, StatusBar, Platform, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, DollarSign, Tag, Info, ChevronDown, FilePlus, FileText, X, Eye, Video, Music, Image as ImageIcon, File, Upload } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

// Simple dropdown component
interface ProductTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  colors: any;
  fonts: any;
}

const ProductTypeDropdown = ({ 
  value, 
  onChange, 
  options,
  colors,
  fonts
}: ProductTypeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[{ fontSize: 16, marginBottom: 12 }, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
        Product Type (Current: {value})
      </Text>
      
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 14,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: colors.surface, 
          borderColor: colors.border,
        }}
        activeOpacity={0.7}
        onPress={() => {
          console.log('Toggle dropdown');
          setIsOpen(!isOpen);
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {value === 'Video' && <Video size={20} color={colors.primary} />}
          {value === 'Audio' && <Music size={20} color={colors.primary} />}
          {value === 'Images' && <ImageIcon size={20} color={colors.primary} />}
          {value === 'Other files' && <FileText size={20} color={colors.primary} />}
          <Text style={{ fontSize: 16, color: colors.textPrimary, fontFamily: fonts.medium, marginLeft: 8 }}>
            {value}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={{
          position: 'absolute',
          top: 76,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          zIndex: 9999,
          elevation: 5,
        }}>
          {options.map((option) => (
            <TouchableOpacity 
              key={option}
              style={{
                padding: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#F0F0F0',
                backgroundColor: value === option ? colors.surfaceHover + '60' : 'white',
              }}
              onPress={() => {
                console.log('Selected:', option);
                onChange(option);
                setIsOpen(false);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {option === 'Video' && <Video size={20} color={value === option ? colors.primary : colors.textSecondary} />}
                {option === 'Audio' && <Music size={20} color={value === option ? colors.primary : colors.textSecondary} />}
                {option === 'Images' && <ImageIcon size={20} color={value === option ? colors.primary : colors.textSecondary} />}
                {option === 'Other files' && <FileText size={20} color={value === option ? colors.primary : colors.textSecondary} />}
                <Text style={{ 
                  fontSize: 16, 
                  marginLeft: 8,
                  color: value === option ? colors.primary : colors.textPrimary,
                  fontFamily: value === option ? fonts.medium : fonts.regular,
                }}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

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

// Definition of the renderFileUploadSection function
const renderFileUploadSection = (
  productType: string, 
  videoUrl: string, 
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>, 
  videoPreviewUrl: string, 
  setVideoPreviewUrl: React.Dispatch<React.SetStateAction<string>>, 
  audioFile: string | null, 
  setAudioFile: React.Dispatch<React.SetStateAction<string | null>>, 
  audioPreview: string | null, 
  setAudioPreview: React.Dispatch<React.SetStateAction<string | null>>, 
  imagesToUpload: string[], 
  setImagesToUpload: React.Dispatch<React.SetStateAction<string[]>>, 
  filesToUpload: string[], 
  setFilesToUpload: React.Dispatch<React.SetStateAction<string[]>>, 
  pickAudio: (setter: React.Dispatch<React.SetStateAction<string | null>>) => void, 
  pickImages: () => void, 
  pickDocuments: (setter: React.Dispatch<React.SetStateAction<string[]>>) => void, 
  removeFile: (uri: string, fileList: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => void,
  colors: any,
  fonts: any,
  fontSize: any
) => {
  if (!productType) return null;

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
      
      {productType === 'Video' && (
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
      
      {productType === 'Audio' && (
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
                <Music size={24} color="#9ca3af" />
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
                <Music size={24} color="#9ca3af" />
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
      
      {productType === 'Images' && (
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
          
          {imagesToUpload.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {imagesToUpload.map((uri, index) => (
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
                    onPress={() => removeFile(uri, imagesToUpload, setImagesToUpload)}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      
      {productType === 'Other files' && (
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
            onPress={() => pickDocuments(setFilesToUpload)}
          >
            <View style={{ alignItems: 'center' }}>
              <FilePlus size={24} color="#9ca3af" />
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
          
          {filesToUpload.length > 0 && (
            <View style={{ gap: 8 }}>
              {filesToUpload.map((uri, index) => (
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
                  <TouchableOpacity onPress={() => removeFile(uri, filesToUpload, setFilesToUpload)}>
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

export default function CreateProductScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isDigital, setIsDigital] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSellable, setIsSellable] = useState(true);
  const [advancedPricing, setAdvancedPricing] = useState(false);
  const [productType, setProductType] = useState('Video');
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [imagesToUpload, setImagesToUpload] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<{id: string, name: string, type: string}[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const categories = ['General', 'Clothing', 'Electronics', 'Books', 'Art', 'Digital Products'];
  const productTypes = ['Video', 'Audio', 'Images', 'Other files'];

  // Debug state changes
  useEffect(() => {
    console.log('Product Type changed to:', productType);
  }, [productType]);

  const handleClearAll = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setIsDigital(false);
    setTags([]);
    setVideoUrl('');
    setVideoPreviewUrl('');
    setAudioFile(null);
    setAudioPreview(null);
    setImagesToUpload([]);
    setFilesToUpload([]);
    setAttachments([]);
    setPreviewImage(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleProductTypeChange = (type: string) => {
    console.log('Selecting product type:', type);
    // Force update with a new reference to ensure React detects the change
    setProductType(prevType => {
      if (prevType === type) return type; // Even if same, return to trigger update
      return type;
    });
    setShowProductTypeDropdown(false);
  };

  const handleUploadAudio = () => {
    // In a real app, this would use file picker
    console.log('Uploading audio file...');
    setAudioFile('sample-audio.mp3');
  };

  const handleUploadAudioPreview = () => {
    // In a real app, this would use file picker
    console.log('Uploading audio preview file...');
    setAudioPreview('sample-preview.mp3');
  };

  const handleUploadImage = () => {
    // In a real app, this would use image picker
    console.log('Uploading image file...');
    const newImage = `image-${Date.now()}.jpg`;
    setImagesToUpload([...imagesToUpload, newImage]);
  };

  const handleRemoveImage = (image: string) => {
    setImagesToUpload(imagesToUpload.filter(img => img !== image));
  };

  const handleUploadFile = () => {
    // In a real app, this would use document picker
    console.log('Uploading file...');
    const newFile = `file-${Date.now()}.pdf`;
    setFilesToUpload([...filesToUpload, newFile]);
  };

  const handleRemoveFile = (file: string) => {
    setFilesToUpload(filesToUpload.filter(f => f !== file));
  };

  const handleAddAttachment = async () => {
    try {
      // Use image picker to select files
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newAttachments = result.assets.map(asset => ({
          id: Date.now().toString() + Math.random().toString(),
          name: asset.uri.split('/').pop() || 'Unknown file',
          type: 'document',
          uri: asset.uri
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.error("Error picking documents:", error);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'image':
        return <ImageIcon size={16} color={colors.primary} />;
      case 'audio':
        return <Music size={16} color={colors.primary} />;
      case 'video':
        return <Video size={16} color={colors.primary} />;
      default:
        return <FileText size={16} color={colors.primary} />;
    }
  };

  const handlePricingOptions = () => {
    // Navigate to the Pricing Options screen
    router.push('/pricing-options' as any);
  };

  const handleContinue = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - publish the product
      console.log('Product published');
      router.back();
    }
  };

  const handlePreviewImageUpload = () => {
    // In a real app, this would use image picker
    console.log('Uploading preview image...');
    setPreviewImage('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Product Name"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              style={[styles.titleInput, { 
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                borderColor: 'transparent',
                backgroundColor: 'transparent'
              }]}
            />
            
            <View style={styles.spacer} />
            
            <TextInput
              placeholder="Product description..."
              placeholderTextColor={colors.textSecondary}
              multiline
              value={description}
              onChangeText={setDescription}
              style={[styles.contentInput, { 
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                borderColor: 'transparent',
                backgroundColor: 'transparent' 
              }]}
            />
            
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />
            
            {/* Price Section */}
            <View style={styles.priceSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Pricing
              </Text>
              <View style={[styles.priceInputContainer, { borderColor: colors.border }]}>
                <Text style={[styles.currencySymbol, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  $
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                  style={[styles.priceInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                />
              </View>
            </View>
            
            {/* Pricing Options Button */}
            <TouchableOpacity 
              style={[styles.optionButton, { borderColor: colors.primary }]}
              onPress={() => router.push('/pricing-options' as any)}
            >
              <Text style={[styles.optionButtonText, { color: colors.primary, fontFamily: fonts.medium }]}>
                Pricing Options
              </Text>
            </TouchableOpacity>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              Product Details
            </Text>
            
            <View style={styles.spacer} />
            
            {/* Product Type Dropdown */}
            <ProductTypeDropdown
              value={productType}
              onChange={setProductType}
              options={productTypes}
              colors={colors}
              fonts={fonts}
            />
            
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />
            
            {/* Content based on selected product type */}
            <View key={`content-${productType}`} style={{ marginBottom: 24 }}>
              {productType === 'Video' && (
                <View style={styles.optionsSection}>
                  <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    Video Details ({productType})
                  </Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      Video URL
                    </Text>
                    <TextInput
                      placeholder="Enter video URL"
                      placeholderTextColor={colors.textSecondary}
                      value={videoUrl}
                      onChangeText={setVideoUrl}
                      style={[styles.standardInput, { 
                        color: colors.textPrimary,
                        fontFamily: fonts.regular,
                        borderColor: colors.border
                      }]}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      Video Preview URL
                    </Text>
                    <TextInput
                      placeholder="Enter preview URL (optional)"
                      placeholderTextColor={colors.textSecondary}
                      value={videoPreviewUrl}
                      onChangeText={setVideoPreviewUrl}
                      style={[styles.standardInput, { 
                        color: colors.textPrimary,
                        fontFamily: fonts.regular,
                        borderColor: colors.border
                      }]}
                    />
                  </View>
                </View>
              )}
              
              {productType === 'Audio' && (
                <View style={styles.optionsSection}>
                  <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    Audio Details ({productType})
                  </Text>
                  
                  <View style={styles.fileUploadContainer}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      Audio File
                    </Text>
                    
                    {audioFile ? (
                      <View style={[styles.fileItem, { borderColor: colors.border + '40' }]}>
                        <Music size={18} color={colors.primary} />
                        <Text style={[styles.fileName, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                          {audioFile}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => setAudioFile(null)}
                        >
                          <X size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.uploadButton, { borderColor: colors.border }]}
                        onPress={handleUploadAudio}
                      >
                        <Music size={18} color={colors.primary} />
                        <Text style={[styles.uploadText, { color: colors.primary, fontFamily: fonts.medium }]}>
                          Upload Audio File
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <View style={styles.fileUploadContainer}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      Audio Preview (optional)
                    </Text>
                    
                    {audioPreview ? (
                      <View style={[styles.fileItem, { borderColor: colors.border + '40' }]}>
                        <Music size={18} color={colors.primary} />
                        <Text style={[styles.fileName, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                          {audioPreview}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => setAudioPreview(null)}
                        >
                          <X size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.uploadButton, { borderColor: colors.border }]}
                        onPress={handleUploadAudioPreview}
                      >
                        <Music size={18} color={colors.primary} />
                        <Text style={[styles.uploadText, { color: colors.primary, fontFamily: fonts.medium }]}>
                          Upload Preview
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              
              {productType === 'Images' && (
                <View style={styles.optionsSection}>
                  <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    Images ({productType})
                  </Text>
                  
                  <View style={styles.imagesGrid}>
                    {imagesToUpload.map((image, index) => (
                      <View key={index} style={styles.imageWrapper}>
                        <View style={[styles.imagePreview, { backgroundColor: colors.surfaceHover }]}>
                          <ImageIcon size={24} color={colors.primary} />
                        </View>
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => handleRemoveImage(image)}
                        >
                          <X size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                    <TouchableOpacity 
                      style={[styles.addImageButton, { borderColor: colors.border }]}
                      onPress={handleUploadImage}
                    >
                      <ImageIcon size={24} color={colors.primary} />
                      <Text style={[styles.addImageText, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                        Add Image
                      </Text>
                      <Text style={[styles.fileTypeText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                        JPG, PNG, JPEG
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              {productType === 'Other files' && (
                <View style={styles.optionsSection}>
                  <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    Files ({productType})
                  </Text>
                  
                  <View style={styles.filesList}>
                    {filesToUpload.map((file, index) => (
                      <View key={index} style={[styles.fileItem, { borderColor: colors.border + '40' }]}>
                        <File size={18} color={colors.primary} />
                        <Text style={[styles.fileName, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                          {file}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveFile(file)}
                        >
                          <X size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                    <TouchableOpacity 
                      style={[styles.uploadButton, { borderColor: colors.border }]}
                      onPress={handleUploadFile}
                    >
                      <File size={18} color={colors.primary} />
                      <Text style={[styles.uploadText, { color: colors.primary, fontFamily: fonts.medium }]}>
                        Upload File
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />
            
            {/* Attachments Section */}
            <View style={styles.optionsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Additional Attachments
              </Text>
              
              {/* File List */}
              {attachments.length > 0 && (
                <View style={styles.attachmentsList}>
                  {attachments.map((file) => (
                    <View 
                      key={file.id} 
                      style={[styles.fileItem, { borderColor: colors.border + '40' }]}
                    >
                      {getFileIcon(file.type)}
                      <Text 
                        style={[styles.fileName, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                        numberOfLines={1}
                      >
                        {file.name}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveAttachment(file.id)}
                      >
                        <X size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              {/* Add Button */}
              <TouchableOpacity 
                style={[styles.uploadButton, { borderColor: colors.border }]}
                onPress={handleAddAttachment}
              >
                <FilePlus size={18} color={colors.primary} />
                <Text style={[styles.uploadText, { color: colors.primary, fontFamily: fonts.medium }]}>
                  Add Attachment
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />
            
            {/* Preview Section */}
            <View style={styles.optionsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Product Preview
              </Text>
              
              <View style={[styles.previewCard, { backgroundColor: colors.surfaceHover + '30', borderColor: colors.border }]}>
                {/* Preview Image */}
                <View style={styles.previewImageContainer}>
                  {previewImage ? (
                    <View style={styles.uploadedPreviewImageContainer}>
                      <Image 
                        source={{ uri: previewImage }} 
                        style={styles.uploadedPreviewImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.changePreviewImageButton}
                        onPress={handlePreviewImageUpload}
                      >
                        <Text style={[styles.changePreviewImageText, { color: '#FFFFFF', fontFamily: fonts.medium }]}>
                          Change
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.previewImagePlaceholder, { borderColor: colors.border + '80' }]}
                      onPress={handlePreviewImageUpload}
                    >
                      <ImageIcon size={24} color={colors.primary} />
                      <Text style={[styles.previewImageText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                        Add Preview Image
                      </Text>
                      <Text style={[styles.previewImageSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                        This will be displayed to users
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <Text style={[styles.previewNote, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                Upload a cover image for your product
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (currentStep === 2) {
      return "Publish";
    }
    return "Continue";
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCreateProduct = () => {
    // Here you would handle the actual creation of the product
    // Then navigate back or to a success screen
    router.back();
  };

  const toggleDropdown = () => {
    setShowProductTypeDropdown(!showProductTypeDropdown);
  };

  const selectFileType = (fileType: string) => {
    setProductType(fileType);
    setShowProductTypeDropdown(false);
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
      setImagesToUpload([...imagesToUpload, ...newImageUris]);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={{ 
            alignSelf: 'flex-end', 
            marginTop: 4,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            color: colors.textSecondary
          }}>
            {title.length}/100
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
              color: productType ? colors.textPrimary : colors.textSecondary
            }}>
              {productType ? productTypes.find(option => option === productType)?.toUpperCase() : 'Select file type'}
            </Text>
            <ChevronDown size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {showProductTypeDropdown && (
            <View style={{ 
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              marginTop: 4,
              backgroundColor: colors.background,
            }}>
              {productTypes.map(option => (
                <TouchableOpacity 
                  key={option}
                  style={{ 
                    padding: 14,
                  }}
                  onPress={() => selectFileType(option)}
                >
                  <Text style={{ 
                    fontFamily: fonts.regular, 
                    fontSize: fontSize.md,
                    color: colors.textPrimary
                  }}>
                    {option.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* File Upload Section */}
        {renderFileUploadSection(
          productType, 
          videoUrl, 
          setVideoUrl, 
          videoPreviewUrl, 
          setVideoPreviewUrl, 
          audioFile, 
          setAudioFile, 
          audioPreview, 
          setAudioPreview, 
          imagesToUpload, 
          setImagesToUpload, 
          filesToUpload, 
          setFilesToUpload, 
          pickAudio, 
          pickImages, 
          pickDocuments, 
          removeFile, 
          colors, 
          fonts, 
          fontSize
        )}
        
        {/* Attachments Section */}
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
            onPress={handleAddAttachment}
          >
            <View style={{ alignItems: 'center' }}>
              <FilePlus size={24} color="#9ca3af" />
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
              {attachments.map((file) => (
                <View key={file.id} style={{ 
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
                    {file.name}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveAttachment(file.id)}>
                    <X size={18} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
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
                <FilePlus size={40} color="#9ca3af" />
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
              backgroundColor: title.length > 0 ? colors.primary : '#9ca3af',
              borderRadius: 8,
              padding: 14,
              marginLeft: 8,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={handleCreateProduct}
            disabled={title.length === 0}
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
  },
  backButton: {
    padding: 8,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 14,
  },
  container: {
    padding: 16,
    paddingBottom: 50,
  },
  formContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 24,
    padding: 12,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
  contentInput: {
    fontSize: 16,
    padding: 12,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 25,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  priceSection: {
    marginBottom: 20,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
  },
  optionsSection: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
  },
  dropdownOptionsContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  standardInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  fileUploadContainer: {
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  removeButton: {
    padding: 4,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 14,
    marginTop: 8,
  },
  fileTypeText: {
    fontSize: 10,
    marginTop: 4,
  },
  filesList: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  optionButtonText: {
    fontSize: 14,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.01)', // Nearly transparent but enough to capture touches
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 100,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
  },
  publishButton: {
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 100,
  },
  publishText: {
    fontSize: 14,
    textAlign: 'center',
  },
  attachmentsList: {
    marginBottom: 12,
  },
  previewCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  previewPlaceholder: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  previewPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  previewPriceLabel: {
    fontSize: 14,
  },
  previewPriceValue: {
    fontSize: 16,
  },
  previewNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  previewImageContainer: {
    marginBottom: 16,
  },
  previewImagePlaceholder: {
    height: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  previewImageText: {
    fontSize: 16,
    marginTop: 12,
  },
  previewImageSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  uploadedPreviewImageContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadedPreviewImage: {
    width: '100%',
    height: '100%',
  },
  changePreviewImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
  },
  changePreviewImageText: {
    fontSize: 12,
  },
}); 