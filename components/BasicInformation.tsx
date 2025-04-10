import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { Upload, ChevronDown, Check, X } from 'lucide-react-native';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';
import { BasicInformationAdvanced } from './BasicInformationAdvanced';
import { useUserContext } from '@/lib/context/UserContext';
import { showToast } from '@/components/Toast';
import { uploadImage } from '@/lib/utils/uploadImage';

const PRESET_COLORS = [
  { name: 'Blue', hex: '#1E88E5' },
  { name: 'Red', hex: '#E53935' },
  { name: 'Green', hex: '#43A047' },
  { name: 'Orange', hex: '#FB8C00' },
  { name: 'Cyan', hex: '#00ACC1' },
  { name: 'Purple', hex: '#8E24AA' },
  { name: 'Pink', hex: '#D81B60' },
  { name: 'Gray', hex: '#546E7A' },
];

export function BasicInformation() {
  const { colors, fonts, fontSize } = useTheme();
  const { creatorSettings, isLoading } = useCreatorSettings();
  const { topics = [], fetchTopics } = useUserContext();
  
  const [pageName, setPageName] = useState(creatorSettings?.campaign_details.campaign_settings.page_name || '');
  const [headline, setHeadline] = useState(creatorSettings?.campaign_details.campaign_settings.headline || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    creatorSettings?.campaign_details.campaign_settings.page_categories || []
  );
  const [profilePhoto, setProfilePhoto] = useState(
    creatorSettings?.campaign_details.campaign_settings.profile_photo?.media_id || ''
  );
  const [coverPhoto, setCoverPhoto] = useState(
    creatorSettings?.campaign_details.campaign_settings.cover_photo?.media_id || ''
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [brandColor, setBrandColor] = useState(
    creatorSettings?.campaign_details.campaign_settings.brand_color?.hex_code || colors.primary
  );
  const [colorInput, setColorInput] = useState(
    creatorSettings?.campaign_details.campaign_settings.brand_color?.hex_code || colors.primary
  );
  const [colorError, setColorError] = useState('');

  useEffect(() => {
    if (creatorSettings) {
      const settings = creatorSettings.campaign_details.campaign_settings;
      setPageName(settings.page_name || '');
      setHeadline(settings.headline || '');
      setSelectedCategories(settings.page_categories || []);
      setProfilePhoto(settings.profile_photo?.media_id || '');
      setCoverPhoto(settings.cover_photo?.media_id || '');
      setBrandColor(settings.brand_color?.hex_code || colors.primary);
      setColorInput(settings.brand_color?.hex_code || colors.primary);
    }
  }, [creatorSettings]);

  useEffect(() => {
    if (topics.length === 0) {
      fetchTopics();
    }
  }, [topics.length, fetchTopics]);

  const generatePageUrl = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const pageUrl = generatePageUrl(pageName);

  const handlePageNameChange = (text: string) => {
    setPageName(text);
  };

  const handleHeadlineChange = (text: string) => {
    if (text.length <= 100) {
      setHeadline(text);
    }
  };

  const handlePhotoUpload = async (type: 'profile' | 'cover') => {
    const options = {
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [4, 1],
      quality: 0.8,
    };
    
    const imageUri = await uploadImage(options);
    
    if (!imageUri) return;
    
    if (type === 'profile') {
      setProfilePhoto(imageUri);
    } else {
      setCoverPhoto(imageUri);
    }
  };

  const handleCategorySelect = (topicId: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
      return newCategories;
    });
  };

  const validateColor = (color: string) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  };

  const handleColorChange = (text: string) => {
    setColorInput(text);
    setColorError('');

    // Add # if user starts typing without it
    if (text && !text.startsWith('#')) {
      text = `#${text}`;
    }

    if (text && !validateColor(text)) {
      setColorError('Please enter a valid hex color (e.g., #1E88E5)');
    } else if (text) {
      setBrandColor(text);
    }
  };

  const handleColorSelect = (color: string) => {
    setBrandColor(color);
    setColorInput(color);
    setColorError('');
  };

  const handleResetColor = () => {
    let defaultColor = PRESET_COLORS[0].hex;
    setBrandColor(defaultColor);
    setColorInput(defaultColor);
    setColorError('');
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[
          styles.loadingText,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
            includeFontPadding: false,
            marginTop: 12
          }
        ]}>
          Loading profile settings...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Name of Page
          </Text>
          <Text style={[
            styles.sectionDescription,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            This is how your page will appear to visitors
          </Text>
          <TextInput
            value={pageName}
            onChangeText={handlePageNameChange}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}
            placeholder="Enter page name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Page URL Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Page URL
          </Text>
          <View style={[
            styles.urlContainer,
            {
              backgroundColor: colors.surface,
              opacity: 0.8
            }
          ]}>
            <Text style={[
              styles.urlPrefix,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              pledgr.com/
            </Text>
            <Text style={[
              styles.urlText,
              {
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              {pageUrl}
            </Text>
          </View>
          <Text style={[
            styles.urlHint,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.xs,
              includeFontPadding: false
            }
          ]}>
            Your page URL is automatically generated from your page name
          </Text>
        </View>

        {/* Headline Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Headline
          </Text>
          <Text style={[
            styles.sectionDescription,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            A short description that appears under your page name
          </Text>
          <TextInput
            value={headline}
            onChangeText={handleHeadlineChange}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}
            placeholder="Enter a catchy headline (max 100 characters)"
            placeholderTextColor={colors.textSecondary}
            maxLength={100}
          />
          <Text style={[
            styles.characterCount,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.xs,
              includeFontPadding: false
            }
          ]}>
            {headline.length}/100 characters
          </Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            What are you creating?
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              { backgroundColor: colors.surface }
            ]}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Text style={[
              styles.dropdownButtonText,
              {
                color: selectedCategories.length > 0 ? colors.textPrimary : colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              {selectedCategories?.length > 0
                ? topics
                    .filter(topic => selectedCategories.includes(topic.id))
                    .map(topic => topic.name)
                    .join(', ')
                : 'Select categories...'}
            </Text>
            <ChevronDown
              size={20}
              color={colors.textSecondary}
              style={{ transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={[
              styles.dropdownContainer,
              { backgroundColor: colors.surface }
            ]}>
              <ScrollView
                style={styles.categoriesList}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {topics.map(topic => (
                  <TouchableOpacity
                    key={topic.id}
                    style={[
                      styles.categoryItem,
                      selectedCategories.includes(topic.id) && {
                        backgroundColor: `${colors.primary}15`,
                      }
                    ]}
                    onPress={() => handleCategorySelect(topic.id)}>
                    <Text style={[
                      styles.categoryText,
                      {
                        color: selectedCategories.includes(topic.id) ? colors.primary : colors.textPrimary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      {topic.name}
                    </Text>
                    {selectedCategories.includes(topic.id) && (
                      <Check size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Profile and Cover Photos */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Profile Photo
          </Text>
          <Text style={[
            styles.sectionDescription,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            This will appear on your page as your main avatar.
          </Text>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: profilePhoto || 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400' }}
              style={styles.profilePhoto}
            />
            <TouchableOpacity
              onPress={() => handlePhotoUpload('profile')}
              style={[
                styles.uploadButton,
                { backgroundColor: colors.primary }
              ]}>
              <Upload size={20} color={colors.buttonText} />
              <Text style={[
                styles.uploadButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Upload new photo
              </Text>
            </TouchableOpacity>
            <Text style={[
              styles.photoHint,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.xs,
                includeFontPadding: false
              }
            ]}>
              Recommended: Square image, 1024px by 1024px
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Cover Photo
          </Text>
          <Text style={[
            styles.sectionDescription,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            This will be displayed at the top of your page.
          </Text>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: coverPhoto || 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800' }}
              style={styles.coverPhoto}
            />
            <TouchableOpacity
              onPress={() => handlePhotoUpload('cover')}
              style={[
                styles.uploadButton,
                { backgroundColor: colors.primary }
              ]}>
              <Upload size={20} color={colors.buttonText} />
              <Text style={[
                styles.uploadButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Upload new photo
              </Text>
            </TouchableOpacity>
            <Text style={[
              styles.photoHint,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.xs,
                includeFontPadding: false
              }
            ]}>
              Recommended: 1600px wide and 400px tall
            </Text>
          </View>
        </View>

        {/* Brand Color Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Custom Brand Color
          </Text>
          <Text style={[
            styles.sectionDescription,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            This color will be used for buttons, links, and accents throughout your page
          </Text>
          
          <View style={[styles.colorPreview, { backgroundColor: brandColor }]} />
          
          <View style={styles.colorSection}>
            <View style={styles.colorInputContainer}>
              <TextInput
                value={colorInput}
                onChangeText={handleColorChange}
                placeholder="#1E88E5"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.colorInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                    fontFamily: fonts.regular,
                    borderColor: colorError ? colors.error : colors.border,
                  }
                ]}
                maxLength={7}
              />
              {colorError ? (
                <Text style={[
                  styles.colorError,
                  {
                    color: colors.error,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.xs,
                  }
                ]}>
                  {colorError}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={handleResetColor}
              style={styles.resetButton}>
              <Text style={[
                styles.resetText,
                {
                  color: colors.primary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Reset to default
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.presetColors}>
            <Text style={[
              styles.presetTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
                includeFontPadding: false,
                marginBottom: 12
              }
            ]}>
              Suggested Colors
            </Text>
            <View style={styles.colorGrid}>
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.hex}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color.hex }
                  ]}
                  onPress={() => handleColorSelect(color.hex)}>
                  {brandColor === color.hex && (
                    <Check size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Advanced Settings Component */}
        <BasicInformationAdvanced />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 8,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    marginBottom: 4,
    fontSize: 14,
  },
  sectionDescription: {
    marginBottom: 8,
    fontSize: 12,
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  characterCount: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  urlPrefix: {
    opacity: 0.5,
    fontSize: 14,
  },
  urlText: {
    flex: 1,
    fontSize: 14,
  },
  urlHint: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownButtonText: {
    fontSize: 14,
    width: "90%"
  },
  dropdownContainer: {
    marginTop: 4,
    borderRadius: 12,
    maxHeight: 200,
  },
  categoriesList: {
    padding: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  photoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  coverPhoto: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 13,
  },
  photoHint: {
    textAlign: 'center',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
  colorPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  colorInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  colorInput: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
  },
  colorError: {
    marginTop: 4,
    marginLeft: 4,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resetText: {
    fontSize: 14,
  },
  presetColors: {
    marginTop: 8,
  },
  presetTitle: {
    marginLeft: 4,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});