import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, TextInput, Switch, StatusBar, Platform, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { ArrowLeft, DollarSign, Tag, Info, ChevronDown, FilePlus, FileText, X, Eye, Video, Music, Image as ImageIcon, File } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const handleAddAttachment = () => {
    // In a real app, this would use document picker
    console.log('Adding attachment...');
    const newAttachment = { 
      id: Date.now().toString(), 
      name: `attachment-${Date.now()}.pdf`, 
      type: 'document' 
    };
    setAttachments([...attachments, newAttachment]);
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {showProductTypeDropdown && (
        <TouchableWithoutFeedback onPress={() => setShowProductTypeDropdown(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
          <TouchableOpacity 
            onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
            Create Product {currentStep > 1 ? `(${currentStep}/2)` : ''}
          </Text>
          <TouchableOpacity 
            style={[styles.clearButton, { borderColor: colors.border }]}
            onPress={handleClearAll}
          >
            <Text style={[styles.clearText, { color: colors.error || '#ff4747', fontFamily: fonts.medium }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={[styles.container, { paddingBottom: 80 }]}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Fixed Footer */}
        <View style={[
          styles.footer, 
          { 
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16 
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.iconButton, 
              { 
                borderColor: colors.border,
                backgroundColor: colors.surfaceHover
              }
            ]}
            onPress={() => console.log('Preview product')}
          >
            <Eye size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.rightButtons}>
            <TouchableOpacity 
              style={[styles.footerButton, { borderColor: colors.border, height: 44 }]}
              onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
            >
              <Text style={[styles.cancelText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                {currentStep > 1 ? 'Back' : 'Cancel'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.publishButton, { backgroundColor: colors.primary, height: 44 }]}
              onPress={handleContinue}
            >
              <Text style={[styles.publishText, { color: '#FFFFFF', fontFamily: fonts.medium }]}>
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
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