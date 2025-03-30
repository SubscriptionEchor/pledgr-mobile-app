import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Upload, Link as LinkIcon, Check, ChevronDown } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';

const CATEGORIES = [
  'Art',
  'Writing',
  'Music',
  'Photography',
  'Design',
  'Fashion',
  'Food',
  'Travel',
  'Tech',
  'Gaming',
];

const SUGGESTED_COLORS = [
  '#1E88E5',
  '#E53935',
  '#43A047',
  '#FB8C00',
  '#039BE5',
  '#8E24AA',
  '#E91E63',
  '#616161',
];

export function BasicInformation() {
  const { colors, fonts, fontSize, updateBrandColor } = useTheme();
  const [pageName, setPageName] = useState('Solo Levelling');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Art', 'Writing', 'Music']);
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400');
  const [coverPhoto, setCoverPhoto] = useState('https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800');
  const [brandColor, setBrandColor] = useState(colors.primary);
  const [about, setAbout] = useState('Only I Level Up is a South Korean portal fantasy web novel');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setBrandColor(colors.primary);
  }, [colors.primary]);

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

  const handleColorSelect = (color: string) => {
    setBrandColor(color);
    updateBrandColor(color);
  };

  const handlePhotoUpload = (type: 'profile' | 'cover') => {
    // Implement photo upload logic
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      return newCategories;
    });
  };

  const handleScroll = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
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
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}
            placeholder="Enter page name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
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
            onPress={toggleDropdown}>
            <Text style={[
              styles.dropdownButtonText,
              {
                color: selectedCategories.length > 0 ? colors.textPrimary : colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              {selectedCategories.length > 0
                ? selectedCategories.join(', ')
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
                {CATEGORIES.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryItem,
                      selectedCategories.includes(category) && {
                        backgroundColor: `${colors.primary}15`,
                      }
                    ]}
                    onPress={() => handleCategorySelect(category)}>
                    <Text style={[
                      styles.categoryText,
                      {
                        color: selectedCategories.includes(category) ? colors.primary : colors.textPrimary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      {category}
                    </Text>
                    {selectedCategories.includes(category) && (
                      <Check size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
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
              source={{ uri: profilePhoto }}
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

        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
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
              source={{ uri: coverPhoto }}
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

        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
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
                fontSize: fontSize.md,
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
                fontSize: fontSize.md,
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

        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
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
            This color will be used for buttons, links, and accents throughout your page. Choose a color that reflects your brand and ensures good contrast.
          </Text>
          <View style={[
            styles.colorPreview,
            { backgroundColor: brandColor }
          ]} />
          <View style={styles.colorSection}>
            <Text style={[
              styles.colorCode,
              {
                color: colors.textPrimary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              {brandColor.toUpperCase()}
            </Text>
            <TouchableOpacity
              onPress={() => handleColorSelect('#1E88E5')}
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
          <View style={styles.colorPreviewButtons}>
            <TouchableOpacity
              style={[
                styles.previewButton,
                { backgroundColor: brandColor }
              ]}>
              <Text style={[
                styles.previewButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Button Preview
              </Text>
            </TouchableOpacity>
            <Text style={[
              styles.previewLink,
              {
                color: brandColor,
                fontFamily: fonts.semibold,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              Link Preview
            </Text>
          </View>
          <View style={styles.suggestedColors}>
            <Text style={[
              styles.suggestedTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              Suggested Colors
            </Text>
            <View style={styles.colorGrid}>
              {SUGGESTED_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => handleColorSelect(color)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color }
                  ]}>
                  {color === brandColor && (
                    <Check size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
              includeFontPadding: false
            }
          ]}>
            About Your Page
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
            Let visitors know what your page is about. You can style your text below.
          </Text>
          <View style={[
            styles.editorToolbar,
            { backgroundColor: colors.surface }
          ]}>
            <TouchableOpacity style={styles.toolbarButton}>
              <Text style={[
                styles.toolbarButtonText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Normal
              </Text>
            </TouchableOpacity>
            <View style={[styles.toolbarDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.toolbarButton}>
              <Text style={[
                styles.toolbarButtonText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.bold,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                B
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton}>
              <Text style={[
                styles.toolbarButtonText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  fontStyle: 'italic',
                  includeFontPadding: false
                }
              ]}>
                I
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton}>
              <Text style={[
                styles.toolbarButtonText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  textDecorationLine: 'underline',
                  includeFontPadding: false
                }
              ]}>
                U
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton}>
              <LinkIcon size={16} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <TextInput
            value={about}
            onChangeText={setAbout}
            multiline
            style={[
              styles.aboutInput,
              {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}
            placeholder="Write about your page..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    opacity: 0.6,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  dropdownButton: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    flex: 1,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    borderRadius: 12,
    zIndex: 1000,
    maxHeight: 260,
    overflow: 'hidden'
  },
  categoriesList: {
    maxHeight: 260,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    fontSize: 14,
  },
  photoHint: {
    textAlign: 'center',
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
  },
  urlText: {
    flex: 1,
    paddingVertical: 12,
  },
  urlHint: {
    marginTop: 8,
    marginLeft: 4,
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  colorPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  colorCode: {
    flex: 1,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resetText: {
    fontSize: 14,
  },
  colorPreviewButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  previewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  previewButtonText: {
    fontSize: 14,
  },
  previewLink: {
    fontSize: 14,
  },
  suggestedColors: {
    gap: 12,
  },
  suggestedTitle: {
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editorToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 8,
    marginBottom: -1,
  },
  toolbarButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarButtonText: {
    fontSize: 14,
  },
  toolbarDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 8,
  },
  aboutInput: {
    height: 120,
    borderRadius: 8,
    padding: 16,
    textAlignVertical: 'top',
  },
});