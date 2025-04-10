import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react-native';
import { CountryPicker } from '@/components/CountryPicker';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

// Create enums for the settings options
enum VisibilityOption {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

enum MembershipOption {
  ALL = 'all',
  PAID_ONLY = 'paid_only'
}

enum CommentAccess {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

export function PageSettings() {
  const { colors, fonts, fontSize } = useTheme();
  const { creatorSettings, isLoading, updateGeneralSettings } = useCreatorSettings();
  const [form, setForm] = useState({
    firstName: creatorSettings?.campaign_details.campaign_settings.legal_info.first_name || '',
    surname: creatorSettings?.campaign_details.campaign_settings.legal_info.surname || '',
    country: creatorSettings?.campaign_details.campaign_settings.legal_info.country_of_residence || '',
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [settings, setSettings] = useState({
    earningsVisibility: creatorSettings?.campaign_details.campaign_settings.visibility_settings.earnings_visibility || VisibilityOption.PRIVATE,
    membershipDetails: creatorSettings?.campaign_details.campaign_settings.visibility_settings.membership_details_visibility || VisibilityOption.PRIVATE,
    membershipOptions: creatorSettings?.campaign_details.campaign_settings.visibility_settings.membership_options || MembershipOption.ALL,
    comments: creatorSettings?.campaign_details.campaign_settings.visibility_settings.comment_access || CommentAccess.ENABLED,
    adultContent: creatorSettings?.campaign_details.campaign_settings.visibility_settings.adult_content || false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    surname: '',
    country: '',
    earningsVisibility: VisibilityOption.PRIVATE,
    membershipDetails: VisibilityOption.PRIVATE,
    membershipOptions: MembershipOption.ALL,
    comments: CommentAccess.ENABLED,
    adultContent: false,
  });

  // Update form and settings when creatorSettings changes
  useEffect(() => {
    if (creatorSettings) {
      const { campaign_settings } = creatorSettings.campaign_details;
      
      const newForm = {
        firstName: campaign_settings.legal_info.first_name || '',
        surname: campaign_settings.legal_info.surname || '',
        country: campaign_settings.legal_info.country_of_residence || '',
      };
      
      const newSettings = {
        earningsVisibility: campaign_settings.visibility_settings.earnings_visibility || VisibilityOption.PRIVATE,
        membershipDetails: campaign_settings.visibility_settings.membership_details_visibility || VisibilityOption.PRIVATE,
        membershipOptions: campaign_settings.visibility_settings.membership_options || MembershipOption.ALL,
        comments: campaign_settings.visibility_settings.comment_access || CommentAccess.ENABLED,
        adultContent: campaign_settings.visibility_settings.adult_content || false,
      };

      setForm(newForm);
      setSettings(newSettings);
      setInitialValues({...newForm, ...newSettings});
    }
  }, [creatorSettings]);

  // Check for changes
  useEffect(() => {
    const hasFormChanges = 
      form.firstName !== initialValues.firstName ||
      form.surname !== initialValues.surname ||
      form.country !== initialValues.country;
    
    const hasSettingsChanges = 
      settings.earningsVisibility !== initialValues.earningsVisibility ||
      settings.membershipDetails !== initialValues.membershipDetails ||
      settings.membershipOptions !== initialValues.membershipOptions ||
      settings.comments !== initialValues.comments ||
      settings.adultContent !== initialValues.adultContent;
    
    setHasChanges(hasFormChanges || hasSettingsChanges);
  }, [form, settings, initialValues]);

  const handleCountrySelect = (country: string) => {
    setForm(prev => ({ ...prev, country }));
    setShowCountryPicker(false);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges || isSaving || !creatorSettings) return;
    
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
          hex_code: creatorSettings.campaign_details.campaign_settings.brand_color?.hex_code || ''
        },
        visibility_settings: {
          earnings_visibility: settings.earningsVisibility,
          membership_details_visibility: settings.membershipDetails,
          membership_options: settings.membershipOptions,
          comment_access: settings.comments,
          adult_content: settings.adultContent
        },
        legal_info: {
          first_name: form.firstName,
          surname: form.surname,
          country_of_residence: form.country
        },
        featured_tags: {
          tags: creatorSettings.campaign_details.campaign_settings.featured_tags?.tags.map(tag => ({ name: tag })) || []
        },
        page_url: creatorSettings.campaign_details.page_url
      };
      
      await updateGeneralSettings(payload);
      
      // Update initial values after successful save
      setInitialValues({
        firstName: form.firstName,
        surname: form.surname,
        country: form.country,
        earningsVisibility: settings.earningsVisibility,
        membershipDetails: settings.membershipDetails,
        membershipOptions: settings.membershipOptions,
        comments: settings.comments,
        adultContent: settings.adultContent
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold, includeFontPadding: false }]}>
              Legal first name
            </Text>
            <TextInput
              value={form.firstName}
              onChangeText={(text) => setForm(prev => ({ ...prev, firstName: text }))}
              placeholder="Enter your first name"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  includeFontPadding: false
                }
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold, includeFontPadding: false }]}>
              Legal surname
            </Text>
            <TextInput
              value={form.surname}
              onChangeText={(text) => setForm(prev => ({ ...prev, surname: text }))}
              placeholder="Enter your surname"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  includeFontPadding: false
                }
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold, includeFontPadding: false }]}>
              Country of residence
            </Text>
            <TouchableOpacity
              onPress={() => setShowCountryPicker(true)}
              style={[
                styles.input,
                styles.countrySelector,
                { backgroundColor: colors.surface }
              ]}>
              <Text style={[
                styles.countryText,
                {
                  color: form.country ? colors.textPrimary : colors.textSecondary,
                  fontFamily: fonts.regular,
                  includeFontPadding: false
                }
              ]}>
                {form.country || 'Select a country'}
              </Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[
              styles.hint,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              This information is used for tax purposes
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.cardTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.lg,
                includeFontPadding: false
              }
            ]}>
              Visibility Settings
            </Text>

            <View style={styles.settingGroup}>
              <View style={styles.settingHeader}>
                <Text style={[
                  styles.settingTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    includeFontPadding: false
                  }
                ]}>
                  Earnings visibility
                </Text>
                <Text style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Choose whether to display your earnings publicly
                </Text>
              </View>

              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, earningsVisibility: VisibilityOption.PRIVATE }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.earningsVisibility === VisibilityOption.PRIVATE && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Keep private
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Only you can see your earnings
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, earningsVisibility: VisibilityOption.PUBLIC }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.earningsVisibility === VisibilityOption.PUBLIC && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Make public
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Everyone can see your earnings
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingGroup}>
              <View style={styles.settingHeader}>
                <Text style={[
                  styles.settingTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    includeFontPadding: false
                  }
                ]}>
                  Membership Details
                </Text>
                <Text style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Control who can see your membership details
                </Text>
              </View>

              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, membershipDetails: VisibilityOption.PRIVATE }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.membershipDetails === VisibilityOption.PRIVATE && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Keep private
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Only you can see membership details
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, membershipDetails: VisibilityOption.PUBLIC }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.membershipDetails === VisibilityOption.PUBLIC && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Make public
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Everyone can see membership details
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingGroup}>
              <View style={styles.settingHeader}>
                <Text style={[
                  styles.settingTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    includeFontPadding: false
                  }
                ]}>
                  Membership Options
                </Text>
                <Text style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Choose which membership options to display
                </Text>
              </View>

              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, membershipOptions: MembershipOption.ALL }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.membershipOptions === MembershipOption.ALL && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Show free and paid options
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Display all membership tiers
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, membershipOptions: MembershipOption.PAID_ONLY }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.membershipOptions === MembershipOption.PAID_ONLY && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Show paid options only
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Hide free membership tier
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingGroup}>
              <View style={styles.settingHeader}>
                <Text style={[
                  styles.settingTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    includeFontPadding: false
                  }
                ]}>
                  Comment access
                </Text>
                <Text style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Manage comment settings for your page
                </Text>
              </View>

              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, comments: CommentAccess.ENABLED }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.comments === CommentAccess.ENABLED && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Allow comments
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Members can comment on your posts
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSettings(prev => ({ ...prev, comments: CommentAccess.DISABLED }))}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: colors.primary }
                    ]}>
                      {settings.comments === CommentAccess.DISABLED && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={styles.radioContent}>
                      <Text style={[
                        styles.radioLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          includeFontPadding: false
                        }
                      ]}>
                        Turn off comments
                      </Text>
                      <Text style={[
                        styles.radioDescription,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.regular,
                          fontSize: fontSize.sm,
                          includeFontPadding: false
                        }
                      ]}>
                        Disable comments on all posts
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[styles.adultContentSection, { backgroundColor: colors.surface }]}>
            <View style={styles.adultContentHeader}>
              <View>
                <Text style={[
                  styles.adultContentTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.lg,
                    includeFontPadding: false
                  }
                ]}>
                  Adult content
                </Text>
                <Text style={[
                  styles.adultContentDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  My work isn't suitable for people under 18
                </Text>
              </View>
              <Switch
                value={settings.adultContent}
                onValueChange={(value) => setSettings(prev => ({ ...prev, adultContent: value }))}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.buttonText}
              />
            </View>
          </View>
          
          {/* Add extra padding at the bottom to ensure content isn't hidden behind the save button */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={handleCountrySelect}
      />
      
      {/* Sticky Save Button */}
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
  section: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryText: {
    fontSize: 16,
  },
  hint: {
    marginTop: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    padding: 24,
  },
  cardTitle: {
    marginBottom: 24,
  },
  settingGroup: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingHeader: {
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    lineHeight: 20,
  },
  radioGroup: {
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  radioDescription: {
    lineHeight: 20,
  },
  adultContentSection: {
    borderRadius: 16,
    padding: 24,
  },
  adultContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adultContentTitle: {
    marginBottom: 4,
  },
  adultContentDescription: {
    lineHeight: 20,
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