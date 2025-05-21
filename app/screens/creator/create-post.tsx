import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, TextInput, StatusBar, Platform, TouchableWithoutFeedback, Image, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, Video, Paperclip, Tag, Eye, ChevronDown, FilePlus, FileText, Music, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CONTENT_TYPES = ['Text', 'Audio', 'Image', 'Link', 'Poll', 'Livestream'];

export default function CreatePostScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [contentType, setContentType] = useState('Text');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState('Public');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [attachments, setAttachments] = useState([
    { id: '1', name: 'document.pdf', type: 'document' },
    { id: '2', name: 'music-track.mp3', type: 'audio' },
    { id: '3', name: 'presentation.pptx', type: 'document' }
  ]);
  const [selectedCollection, setSelectedCollection] = useState('Main Collection');
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSellable, setIsSellable] = useState(false);
  const [price, setPrice] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [notifyMembers, setNotifyMembers] = useState(true);
  
  // Define custom colors
  const customColors = {
    postBackground: '#fafaf9'
  };

  const handleClearAll = () => {
    setTitle('');
    setDescription('');
    setAttachments([]);
    setContentType('Text');
  };

  const handleAddAttachment = () => {
    // In a real app, this would show a file picker
    console.log('Add attachment');
    
    // Example of adding a new attachment
    const newAttachment = { 
      id: Date.now().toString(), 
      name: 'new-file.jpg', 
      type: 'image' 
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

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - publish the post
      console.log('Post published');
      router.back();
    }
  };

  const handleImagePicker = () => {
    // In a real app, this would use something like expo-image-picker
    console.log('Opening image picker...');
    
    // Simulating image selection with a sample image
    // In a real app, you would get this URI from the image picker
    const sampleImageUri = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600';
    setPreviewImage(sampleImageUri);
  };

  const handleAccessChange = (access: string) => {
    setSelectedAccess(access);
    setShowAccessDropdown(false);
  };

  const handleCollectionChange = (collection: string) => {
    setSelectedCollection(collection);
    setShowCollectionDropdown(false);
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

  const handlePricingOptions = () => {
    // Navigate to the Pricing Options screen
    router.push('/pricing-options' as any);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Add a title"
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
              placeholder="Type something description here"
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
            
            {/* Attachments Section */}
            <View style={styles.attachmentsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Attachments
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
                style={[styles.addButton, { borderColor: colors.border }]}
                onPress={handleAddAttachment}
              >
                <FilePlus size={18} color={colors.primary} />
                <Text style={[styles.addText, { color: colors.primary, fontFamily: fonts.medium }]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              Preview Settings
            </Text>
            
            <View style={styles.spacer} />
            
            {/* Preview Section */}
            <View style={styles.optionsSection}>
              <View style={[styles.previewContainer, { borderColor: colors.border }]}>
                {/* Image Placeholder/Upload */}
                <TouchableOpacity 
                  style={[styles.imagePreview, { backgroundColor: colors.surfaceHover }]}
                  onPress={handleImagePicker}
                >
                  {previewImage ? (
                    <Image 
                      source={{ uri: previewImage }} 
                      style={styles.uploadedImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <ImageIcon size={28} color={colors.textSecondary} />
                      <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                        Tap to upload image
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                
                {/* Title Preview */}
                <View style={styles.titlePreview}>
                  <Text style={[styles.previewTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                    {title || "Untitled Post"}
                  </Text>
                </View>
                
                {/* Preview Text Input */}
                <View style={styles.previewTextSection}>
                  <Text style={[styles.previewInputLabel, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                    Preview Text
                  </Text>
                  <TextInput
                    placeholder="Enter a short preview of your post..."
                    placeholderTextColor={colors.textSecondary}
                    value={previewText}
                    onChangeText={(text) => {
                      if (text.length <= 140) {
                        setPreviewText(text);
                      }
                    }}
                    multiline
                    style={[styles.previewTextInput, { 
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      borderColor: colors.border,
                    }]}
                  />
                  <Text style={[styles.charCount, { 
                    color: previewText.length > 120 ? colors.error || '#ff4747' : colors.textSecondary,
                    fontFamily: fonts.regular
                  }]}>
                    {previewText.length}/140
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Post Access */}
            <View style={styles.optionsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Post Access
              </Text>
              
              <TouchableOpacity 
                style={[styles.accessDropdown, { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }]}
                onPress={() => setShowAccessDropdown(!showAccessDropdown)}
              >
                <View style={styles.selectedAccess}>
                  <Text style={[styles.accessText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    {selectedAccess}
                  </Text>
                  <Text style={[styles.accessDesc, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                    {selectedAccess === 'Public' && 'Anyone can view this post'}
                    {selectedAccess === 'All Members' && 'Only members can view this post'}
                    {selectedAccess === 'Paid Members Only' && 'Only paid members can view this post'}
                    {selectedAccess === 'Free Members' && 'Only free members can view this post'}
                    {selectedAccess === 'Select Tiers' && 'Choose specific membership tiers'}
                    {selectedAccess === 'For Purchase Only' && 'Users must purchase to view this post'}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              {showAccessDropdown && (
                <View style={[styles.accessOptions, { 
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.border
                }]}>
                  <TouchableOpacity 
                    style={[styles.accessOption, selectedAccess === 'Public' && { backgroundColor: colors.surfaceHover + '20' }]}
                    onPress={() => handleAccessChange('Public')}
                  >
                    <Text style={[
                      styles.optionLabel, 
                      { 
                        color: selectedAccess === 'Public' ? colors.primary : colors.textPrimary, 
                        fontFamily: selectedAccess === 'Public' ? fonts.medium : fonts.regular 
                      }
                    ]}>
                      Public
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Anyone can view this post
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.accessOption, selectedAccess === 'All Members' && { backgroundColor: colors.surfaceHover + '20' }]}
                    onPress={() => handleAccessChange('All Members')}
                  >
                    <Text style={[
                      styles.optionLabel, 
                      { 
                        color: selectedAccess === 'All Members' ? colors.primary : colors.textPrimary, 
                        fontFamily: selectedAccess === 'All Members' ? fonts.medium : fonts.regular
                      }
                    ]}>
                      All Members
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Only members can view this post
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.accessOption, selectedAccess === 'Paid Members Only' && { backgroundColor: colors.surfaceHover + '20' }]}
                    onPress={() => handleAccessChange('Paid Members Only')}
                  >
                    <Text style={[
                      styles.optionLabel, 
                      { 
                        color: selectedAccess === 'Paid Members Only' ? colors.primary : colors.textPrimary, 
                        fontFamily: selectedAccess === 'Paid Members Only' ? fonts.medium : fonts.regular
                      }
                    ]}>
                      Paid Members Only
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Only paid members can view this post
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.accessOption, selectedAccess === 'Free Members' && { backgroundColor: colors.surfaceHover + '20' }]}
                    onPress={() => handleAccessChange('Free Members')}
                  >
                    <Text style={[
                      styles.optionLabel, 
                      { 
                        color: selectedAccess === 'Free Members' ? colors.primary : colors.textPrimary, 
                        fontFamily: selectedAccess === 'Free Members' ? fonts.medium : fonts.regular
                      }
                    ]}>
                      Free Members
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Only free members can view this post
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.accessOption, selectedAccess === 'Select Tiers' && { backgroundColor: colors.surfaceHover + '20' }]}
                    onPress={() => handleAccessChange('Select Tiers')}
                  >
                    <Text style={[
                      styles.optionLabel, 
                      { 
                        color: selectedAccess === 'Select Tiers' ? colors.primary : colors.textPrimary, 
                        fontFamily: selectedAccess === 'Select Tiers' ? fonts.medium : fonts.regular
                      }
                    ]}>
                      Select Tiers
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Choose specific membership tiers
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.accessOption, selectedAccess === 'For Purchase Only' && { backgroundColor: colors.surfaceHover + '20' }]}
                    onPress={() => handleAccessChange('For Purchase Only')}
                  >
                    <Text style={[
                      styles.optionLabel, 
                      { 
                        color: selectedAccess === 'For Purchase Only' ? colors.primary : colors.textPrimary, 
                        fontFamily: selectedAccess === 'For Purchase Only' ? fonts.medium : fonts.regular
                      }
                    ]}>
                      For Purchase Only
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Users must purchase to view this post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              Collections & Tags
            </Text>
            
            <View style={styles.spacer} />
            
            {/* Collection Section */}
            <View style={styles.optionsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Add to Collection
              </Text>
              
              <TouchableOpacity 
                style={[styles.accessDropdown, { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }]}
                onPress={() => setShowCollectionDropdown(!showCollectionDropdown)}
              >
                <View style={styles.selectedAccess}>
                  <Text style={[styles.accessText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    {selectedCollection}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              {showCollectionDropdown && (
                <View style={[styles.accessOptions, { 
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.border
                }]}>
                  {['Main Collection', 'Travel Stories', 'Photography', 'Recipes', 'Tech Reviews'].map((collection) => (
                    <TouchableOpacity 
                      key={collection}
                      style={[
                        styles.accessOption, 
                        selectedCollection === collection && { backgroundColor: colors.surfaceHover + '20' }
                      ]}
                      onPress={() => handleCollectionChange(collection)}
                    >
                      <Text style={[
                        styles.optionLabel, 
                        { 
                          color: selectedCollection === collection ? colors.primary : colors.textPrimary, 
                          fontFamily: selectedCollection === collection ? fonts.medium : fonts.regular 
                        }
                      ]}>
                        {collection}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />
            
            {/* Tags Section */}
            <View style={styles.optionsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Add Tags
              </Text>
              
              <View style={[styles.tagInputContainer, { borderColor: colors.border }]}>
                <TextInput
                  placeholder="Enter tag"
                  placeholderTextColor={colors.textSecondary}
                  value={tagInput}
                  onChangeText={setTagInput}
                  style={[styles.tagInput, { 
                    color: colors.textPrimary,
                    fontFamily: fonts.regular,
                  }]}
                  onSubmitEditing={handleAddTag}
                />
                
                <TouchableOpacity 
                  style={[styles.addTagButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddTag}
                >
                  <Text style={[styles.addTagText, { color: '#FFFFFF', fontFamily: fonts.medium }]}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
              
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <View 
                      key={tag} 
                      style={[styles.tagBadge, { backgroundColor: colors.surfaceHover, borderColor: colors.border }]}
                    >
                      <Text style={[styles.tagBadgeText, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                        {tag}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeTagButton}
                        onPress={() => handleRemoveTag(tag)}
                      >
                        <X size={14} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />
            
            {/* Monetization Section */}
            <View style={styles.optionsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Monetization
              </Text>
              
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  Sell this post
                </Text>
                <Switch
                  value={isSellable}
                  onValueChange={setIsSellable}
                  trackColor={{ false: '#e5e7eb', true: colors.primary }}
                  thumbColor={'#ffffff'}
                />
              </View>
              
              {isSellable && (
                <>
                  {/* Price Input */}
                  <View style={styles.priceContainer}>
                    <Text style={[styles.priceLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      Price (USD)
                    </Text>
                    <View style={[styles.priceInputContainer, { borderColor: colors.border }]}>
                      <Text style={[styles.currencySymbol, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                        $
                      </Text>
                      <TextInput
                        style={[styles.priceInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                        placeholder="0.00"
                        placeholderTextColor={colors.textSecondary}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                  
                  {/* Pricing Options Button */}
                  <TouchableOpacity 
                    style={[styles.optionButton, { borderColor: colors.primary }]}
                    onPress={handlePricingOptions}
                  >
                    <Text style={[styles.optionButtonText, { color: colors.primary, fontFamily: fonts.medium }]}>
                      Pricing Options
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />
            
            {/* Fan Activity Section */}
            <View style={styles.optionsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                Fan Activity
              </Text>
              
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  Allow comments on this post
                </Text>
                <Switch
                  value={allowComments}
                  onValueChange={setAllowComments}
                  trackColor={{ false: '#e5e7eb', true: colors.primary }}
                  thumbColor={'#ffffff'}
                />
              </View>
              
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  Notify members when published
                </Text>
                <Switch
                  value={notifyMembers}
                  onValueChange={setNotifyMembers}
                  trackColor={{ false: '#e5e7eb', true: colors.primary }}
                  thumbColor={'#ffffff'}
                />
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (currentStep === 3) {
      return "Publish";
    }
    return "Continue";
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {showTypeDropdown && (
        <TouchableWithoutFeedback onPress={() => setShowTypeDropdown(false)}>
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
            Create Post {currentStep > 1 ? `(${currentStep}/3)` : ''}
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

        {currentStep === 1 && (
          <View style={[styles.contentTypeContainer, { borderBottomColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.typeSelector, { backgroundColor: colors.surfaceHover + '20', borderColor: colors.border }]}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <Text style={[styles.contentTypeText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                {contentType}
              </Text>
              <ChevronDown size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            
            {showTypeDropdown && (
              <View style={[
                styles.dropdown, 
                { 
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.border 
                }
              ]}>
                {CONTENT_TYPES.map((type) => (
                  <TouchableOpacity 
                    key={type}
                    style={[
                      styles.dropdownItem,
                      contentType === type && { backgroundColor: colors.surfaceHover + '20' }
                    ]}
                    onPress={() => {
                      setContentType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text 
                      style={[
                        styles.dropdownItemText, 
                        { 
                          color: contentType === type ? colors.primary : colors.textPrimary,
                          fontFamily: contentType === type ? fonts.medium : fonts.regular
                        }
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

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
            onPress={() => console.log('Preview post')}
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
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 25,
  },
  contentInput: {
    fontSize: 16,
    padding: 12,
    minHeight: 250,
    textAlignVertical: 'top',
  },
  attachmentsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
  },
  supportText: {
    fontSize: 12,
  },
  previewSettings: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 14,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingValue: {
    fontSize: 14,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  tagText: {
    flex: 1,
    fontSize: 14,
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
  previewText: {
    fontSize: 14,
  },
  contentTypeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    position: 'relative',
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  contentTypeText: {
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  attachmentsSection: {
    marginTop: 30,
  },
  attachmentsList: {
    marginBottom: 12,
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
    marginLeft: 10,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 8,
  },
  addText: {
    fontSize: 14,
  },
  stepTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  optionsSection: {
    marginBottom: 24,
  },
  optionCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
  },
  optionDivider: {
    height: 1,
    width: '100%',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  toggleButton: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  previewCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  previewTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  previewDesc: {
    fontSize: 16,
    marginBottom: 16,
  },
  previewAttachments: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachmentsHeader: {
    fontSize: 14,
    marginBottom: 8,
  },
  previewFileList: {
    gap: 8,
  },
  previewFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewFileName: {
    fontSize: 14,
  },
  moreFiles: {
    fontSize: 14,
    marginTop: 4,
  },
  publishInfo: {
    marginTop: 24,
  },
  publishNote: {
    fontSize: 14,
    textAlign: 'center',
  },
  accessDropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedAccess: {
    flex: 1,
  },
  accessText: {
    fontSize: 16,
    marginBottom: 2,
  },
  accessDesc: {
    fontSize: 14,
  },
  accessOptions: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accessOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  previewContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    aspectRatio: 4/3, // 4:3 aspect ratio
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  titlePreview: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  previewTextSection: {
    padding: 16,
  },
  previewInputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  previewTextInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tagInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  addTagButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 6,
    borderWidth: 1,
  },
  tagBadgeText: {
    fontSize: 14,
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
  },
  priceContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  optionButtonText: {
    fontSize: 16,
  },
}); 