import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Upload, Link as LinkIcon, Check } from 'lucide-react-native';
import { useState } from 'react';

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

export function BasicInformation() {
  const { colors, fonts, fontSize } = useTheme();
  const [pageName, setPageName] = useState('Solo Levelling');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Art', 'Writing', 'Music']);
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400');
  const [coverPhoto, setCoverPhoto] = useState('https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800');
  const [brandColor, setBrandColor] = useState('#1E88E5');
  const [about, setAbout] = useState('Only I Level Up is a South Korean portal fantasy web novel');

  // Function to convert page name to URL-friendly format
  const generatePageUrl = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim(); // Remove leading/trailing spaces
  };

  // Get the page URL from the page name
  const pageUrl = generatePageUrl(pageName);

  // Handle page name change
  const handlePageNameChange = (text: string) => {
    setPageName(text);
  };

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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePhotoUpload = (type: 'profile' | 'cover') => {
    // Implement photo upload logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
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
            }
          ]}
          placeholder="Enter page name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
          }
        ]}>
          What are you creating?
        </Text>
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map(category => {
            const isSelected = selectedCategories.includes(category);
            return (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategoryToggle(category)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : 'transparent',
                  }
                ]}>
                <Text style={[
                  styles.categoryText,
                  {
                    color: isSelected ? colors.primary : colors.textPrimary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                  }
                ]}>
                  {category}
                </Text>
                {isSelected && (
                  <TouchableOpacity
                    onPress={() => handleCategoryToggle(category)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <X size={16} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
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
            fontSize: fontSize.lg,
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
            }
          ]}>
            Recommended: 1600px wide and 400px tall
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
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
          }
        ]}>
          Your page URL is automatically generated from your page name
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
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
          }
        ]}>
          This color will be used for buttons, links, and accents throughout your page. Choose a color that reflects your brand and ensures good contrast.
        </Text>
        <View style={styles.colorSection}>
          <View style={[
            styles.colorPreview,
            { backgroundColor: brandColor }
          ]} />
          <Text style={[
            styles.colorCode,
            {
              color: colors.textPrimary,
              fontFamily: fonts.medium,
              fontSize: fontSize.sm,
            }
          ]}>
            {brandColor.toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() => setBrandColor('#1E88E5')}
            style={styles.resetButton}>
            <Text style={[
              styles.resetText,
              {
                color: colors.primary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
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
            }
          ]}>
            Suggested Colors
          </Text>
          <View style={styles.colorGrid}>
            {SUGGESTED_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => setBrandColor(color)}
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

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
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
            }
          ]}
          placeholder="Write about your page..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  section: {
    gap: 12,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    gap: 8,
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
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
  urlInput: {
    flex: 1,
    height: '100%',
    marginLeft: 4,
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
    gap: 16,
    marginBottom: 16,
  },
  colorPreview: {
    width: 120,
    height: 48,
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