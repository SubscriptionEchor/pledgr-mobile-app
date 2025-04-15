import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Check, Palette } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys, PRESET_COLORS } from '@/lib/enums';
import { showToast } from '@/components/Toast';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  initialColor?: string;
  onColorChange?: (color: string) => void;
}

export function ColorPickerModal({
  visible,
  onClose,
  initialColor,
  onColorChange
}: ColorPickerModalProps) {
  const { colors, fonts, fontSize, updateBrandColor } = useTheme();
  const { creatorSettings, updateGeneralSettings, isLoading, fetchCreatorSettings } = useCreatorSettings();
  
  const [selectedColor, setSelectedColor] = useState('');
  const [originalColor, setOriginalColor] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [colorError, setColorError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const initialRender = useRef(true);

  // Fetch creator settings if not available
  useEffect(() => {
    if (visible && !creatorSettings) {
      fetchCreatorSettings();
    }
  }, [visible, creatorSettings, fetchCreatorSettings]);

  // Initialize colors when modal becomes visible
  useEffect(() => {
    if (visible) {
      let colorToUse;
      
      if (creatorSettings) {
        // Get color from creator settings if available
        colorToUse = creatorSettings.campaign_details.campaign_settings.brand_color?.hex_code;
      }
      
      // Fallback to initialColor or default
      colorToUse = colorToUse || initialColor || PRESET_COLORS[0].hex;
      
      setSelectedColor(colorToUse);
      setOriginalColor(colorToUse);
      setColorInput(colorToUse);
      setColorError('');
      setHasChanges(false);
      
      // Reset theme to original color when modal opens
      updateBrandColor(colorToUse);
      
      initialRender.current = true;
    } else if (!visible && !initialRender.current) {
      // Reset to original color when closing without applying
      updateBrandColor(originalColor);
    }
  }, [visible, creatorSettings, initialColor, updateBrandColor]);

  // Check for changes
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    setHasChanges(selectedColor !== originalColor);
  }, [selectedColor, originalColor]);

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
      setColorInput(text);
    }

    if (text && !validateColor(text)) {
      setColorError('Please enter a valid hex color (e.g., #1E88E5)');
    } else if (text) {
      setSelectedColor(text);
      // Update theme context immediately for instant feedback
      updateBrandColor(text);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setColorInput(color);
    setColorError('');
    // Update theme context immediately for instant feedback
    updateBrandColor(color);
  };

  const handleResetColor = () => {
    const defaultColor = PRESET_COLORS[0].hex;
    setSelectedColor(defaultColor);
    setColorInput(defaultColor);
    setColorError('');
    // Update theme context immediately for instant feedback
    updateBrandColor(defaultColor);
  };

  const handleApplyColor = async () => {
    if (!validateColor(selectedColor) || !creatorSettings) {
      setColorError('Please enter a valid hex color');
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare the payload with the same structure as updateGeneralSettings expects
      const payload = {
        page_name: creatorSettings.campaign_details.campaign_settings.page_name,
        headline: creatorSettings.campaign_details.campaign_settings.headline,
        intro_video_url: creatorSettings.campaign_details.campaign_settings.intro_video_url || '',
        page_categories: creatorSettings.campaign_details.campaign_settings.page_categories || [],
        profile_photo: {
          media_id: creatorSettings.campaign_details.campaign_settings.profile_photo?.media_id || ''
        },
        cover_photo: {
          media_id: creatorSettings.campaign_details.campaign_settings.cover_photo?.media_id || ''
        },
        brand_color: {
          hex_code: selectedColor
        },
        visibility_settings: {
          earnings_visibility: creatorSettings.campaign_details.campaign_settings.visibility_settings.earnings_visibility,
          membership_details_visibility: creatorSettings.campaign_details.campaign_settings.visibility_settings.membership_details_visibility,
          membership_options: creatorSettings.campaign_details.campaign_settings.visibility_settings.membership_options,
          comment_access: creatorSettings.campaign_details.campaign_settings.visibility_settings.comment_access,
          adult_content: creatorSettings.campaign_details.campaign_settings.visibility_settings.adult_content
        },
        legal_info: {
          first_name: creatorSettings.campaign_details.campaign_settings.legal_info.first_name,
          surname: creatorSettings.campaign_details.campaign_settings.legal_info.surname,
          country_of_residence: creatorSettings.campaign_details.campaign_settings.legal_info.country_of_residence
        },
        featured_tags: {
          tags: creatorSettings.campaign_details.campaign_settings.featured_tags?.tags.map(tag => ({ name: tag })) || []
        },
        page_url: creatorSettings.campaign_details.page_url
      };
      
      // Call the API to update the settings
      await updateGeneralSettings(payload);
      
      // Store brand color in local storage and update theme context
      await AsyncStorage.setItem(StorageKeys.BRAND_COLOR, selectedColor);
      updateBrandColor(selectedColor);
      
      if (onColorChange) {
        onColorChange(selectedColor);
      }
      
      // Update original color after successful save
      setOriginalColor(selectedColor);
      setHasChanges(false);
      
      showToast.success('Color updated', 'Your brand color has been updated');
      onClose();
    } catch (error) {
      console.error('Error saving color:', error);
      showToast.error('Failed to update color', 'Please try again');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset to original color when closing without applying
    updateBrandColor(originalColor);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Palette size={24} color={colors.primary} />
              <Text style={[
                styles.title,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.bold,
                  fontSize: fontSize.xl,
                  includeFontPadding: false
                }
              ]}>
                Brand Color
              </Text>
            </View>
          </View>

          {(isSaving || isLoading) && (
            <View style={styles.loadingOverlay}>
              <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[
                  styles.loadingText,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false,
                    marginLeft: 8
                  }
                ]}>
                  Updating...
                </Text>
              </View>
            </View>
          )}

          <View style={styles.content}>
            <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
            
            <View style={styles.colorInputRow}>
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
                      borderColor: colorError ? colors.error : colors.border,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md
                    }
                  ]}
                  maxLength={7}
                  editable={!isSaving && !isLoading}
                />
              </View>
              
              <TouchableOpacity
                onPress={handleResetColor}
                style={styles.resetButton}
                disabled={isSaving || isLoading}>
                <Text style={[
                  styles.resetText,
                  {
                    color: colors.primary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false,
                    textAlign: 'right'
                  }
                ]}>
                  Reset to default
                </Text>
              </TouchableOpacity>
            </View>

            {colorError ? (
              <Text style={[
                styles.colorError,
                {
                  color: colors.error,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.xs,
                  marginTop: 4,
                  marginLeft: 4
                }
              ]}>
                {colorError}
              </Text>
            ) : null}

            <Text style={[
              styles.presetTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
                includeFontPadding: false,
                marginTop: 16,
                marginBottom: 8
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
                  onPress={() => handleColorSelect(color.hex)}
                  disabled={isSaving || isLoading}>
                  {selectedColor === color.hex && (
                    <Check size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.previewSection}>
              <Text style={[
                styles.previewTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  includeFontPadding: false,
                  marginTop: 16,
                  marginBottom: 8
                }
              ]}>
                Preview
              </Text>
              
              <View style={styles.previewRow}>
                <TouchableOpacity
                  style={[
                    styles.buttonPreview,
                    { backgroundColor: selectedColor }
                  ]}
                  disabled={true}
                >
                  <Text style={[
                    styles.buttonPreviewText,
                    {
                      color: '#FFFFFF',
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    Button Preview
                  </Text>
                </TouchableOpacity>
                
                <Text style={[
                  styles.linkPreview,
                  {
                    color: selectedColor,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Link Preview
                </Text>
                
                <View style={[
                  styles.badgePreview,
                  { backgroundColor: `${selectedColor}15` }
                ]}>
                  <Text style={[
                    styles.badgePreviewText,
                    {
                      color: selectedColor,
                      fontFamily: fonts.medium,
                      fontSize: fontSize.xs,
                      includeFontPadding: false
                    }
                  ]}>
                    Badge Preview
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.cancelButton, 
                { 
                  backgroundColor: colors.surface,
                  opacity: (isSaving || isLoading) ? 0.5 : 1
                }
              ]}
              onPress={handleClose}
              disabled={isSaving || isLoading}>
              <Text style={[
                styles.cancelButtonText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyButton, 
                { 
                  backgroundColor: selectedColor,
                  opacity: (!!colorError || isSaving || isLoading || !hasChanges) ? 0.5 : 1
                }
              ]}
              onPress={handleApplyColor}
              disabled={!!colorError || isSaving || isLoading || !hasChanges}>
              {isSaving || isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={[
                  styles.applyButtonText,
                  {
                    color: '#FFFFFF',
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  Apply Color
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingText: {
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  colorPreview: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },
  colorInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  colorInputContainer: {
    flex: 1,
  },
  colorInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontSize: 14,
  },
  colorError: {
    fontSize: 12,
  },
  resetButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resetText: {
    fontSize: 14,
  },
  presetTitle: {
    fontSize: 14,
    marginLeft: 4,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewSection: {
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 14,
    marginLeft: 4,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  buttonPreview: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonPreviewText: {
    fontSize: 14,
  },
  linkPreview: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  badgePreview: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgePreviewText: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
  },
  applyButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
  },
});