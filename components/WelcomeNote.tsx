import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect, useRef } from 'react';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

interface WelcomeNoteProps {
  onSave?: (note: string) => void;
  onInputFocus?: (position: number) => void;
}

export function WelcomeNote({ onSave, onInputFocus }: WelcomeNoteProps) {
  const { colors, fonts, fontSize } = useTheme();
  const { creatorSettings, isLoading, updateWelcomeNote } = useCreatorSettings();
  
  const [welcomeType, setWelcomeType] = useState<'same' | 'custom'>('same');
  const [welcomeNote, setWelcomeNote] = useState('Welcome to my page! Thank you for your support.');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    welcomeType: 'same' as 'same' | 'custom',
    welcomeNote: ''
  });

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Initialize from creatorSettings
  useEffect(() => {
    if (creatorSettings) {
      const welcomeNotes = creatorSettings.campaign_details.campaign_settings.welcome_notes;
      if (welcomeNotes) {
        const useUnified = welcomeNotes.use_unified_welcome;
        const message = welcomeNotes.default_welcome_message?.message || 'Welcome to my page! Thank you for your support.';
        
        setWelcomeType(useUnified ? 'same' : 'custom');
        setWelcomeNote(message);
        
        // Set initial values for change detection
        setInitialValues({
          welcomeType: useUnified ? 'same' : 'custom',
          welcomeNote: message
        });
      }
    }
  }, [creatorSettings]);

  // Check for changes
  useEffect(() => {
    const hasTypeChanged = welcomeType !== initialValues.welcomeType;
    const hasNoteChanged = welcomeNote !== initialValues.welcomeNote;
    
    setHasChanges(hasTypeChanged || hasNoteChanged);
  }, [welcomeType, welcomeNote, initialValues]);

  const handleSaveChanges = async () => {
    if (!hasChanges || isSaving || !creatorSettings) return;
    
    setIsSaving(true);
    
    try {
      // Prepare the payload for updateWelcomeNote
      const payload = {
        use_unified_welcome: welcomeType === 'same',
        default_welcome_message: {
          message: welcomeNote,
          intro_video_url: creatorSettings.campaign_details.campaign_settings.welcome_notes?.default_welcome_message?.intro_video_url || ''
        }
      };
      
      await updateWelcomeNote(payload);
      
      // Update initial values after successful save
      setInitialValues({
        welcomeType,
        welcomeNote
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving welcome note changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.bold,
              fontSize: fontSize['xl'],
              includeFontPadding: false
            }
          ]}>
            How do you want to welcome your members?
          </Text>

          <Text style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Customize the welcome message your members will receive when they join your page.
          </Text>

          <View style={styles.options}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: welcomeType === 'same' ? colors.primary : 'transparent',
                  borderWidth: welcomeType === 'same' ? 2 : 0,
                }
              ]}
              onPress={() => setWelcomeType('same')}>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  { borderColor: colors.primary }
                ]}>
                  {welcomeType === 'same' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Use the same welcome note for each tier
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    All members will receive the same welcome message when they join
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: welcomeType === 'custom' ? colors.primary : 'transparent',
                  borderWidth: welcomeType === 'custom' ? 2 : 0,
                }
              ]}
              onPress={() => setWelcomeType('custom')}>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  { borderColor: colors.primary }
                ]}>
                  {welcomeType === 'custom' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Customize welcome notes for each tier
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    Create unique welcome messages for different membership tiers
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.editorCard, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.editorTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.lg,
                includeFontPadding: false
              }
            ]}>
              Welcome Note
            </Text>

            <TextInput
              value={welcomeNote}
              onChangeText={setWelcomeNote}
              multiline
              style={[
                styles.editor,
                {
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}
              placeholder="Write your welcome message..."
              placeholderTextColor={colors.textSecondary}
              textAlignVertical="top"
              onFocus={() => onInputFocus?.(600)}
            />

            <Text style={[
              styles.hint,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              This message will be sent to all members when they join your page
            </Text>
          </View>
          
          {/* Add extra padding at the bottom to ensure content isn't hidden behind the save button */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>
      
      {/* Sticky Save Button - Hide when keyboard is visible */}
      {!isKeyboardVisible && (
        <View style={[
          styles.saveButtonContainer, 
          { 
            backgroundColor: colors.background,
            borderTopColor: colors.border
          }
        ]}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: colors.primary,
                opacity: (!hasChanges || isSaving) ? 0.5 : 1
              }
            ]}
            onPress={handleSaveChanges}
            disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={[
                styles.saveButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  title: {
    marginBottom: 0,
  },
  subtitle: {
    marginBottom: 0,
  },
  options: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    marginBottom: 4,
  },
  optionDescription: {
    lineHeight: 20,
  },
  editorCard: {
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  editorTitle: {
    marginBottom: 8,
  },
  editor: {
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    textAlignVertical: "top",
  },
  hint: {
    textAlign: 'center',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
  },
});