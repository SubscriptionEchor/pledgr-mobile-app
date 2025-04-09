import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { useState, useEffect, useMemo } from 'react';
import { CountryPicker } from '@/components/CountryPicker';
import { StatePicker } from '@/components/StatePicker';
import { showToast } from '@/components/Toast';
import { useUserContext } from '@/lib/context/UserContext';
import { useMemberSettings } from '@/hooks/useMemberSettings';
import { useAuth } from '@/lib/context/AuthContext';
import { Camera } from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const { setUser } = useAuth();
  const router = useRouter();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const { memberSettings, locationInfo, isLoading: isContextLoading, countries, fetchCountries } = useUserContext();
  const { updateMemberSettings, fetchMemberSettings, isLoading: isSettingsLoading } = useMemberSettings();
  const [isSaving, setIsSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: memberSettings?.profile.display_name || '',
    country: locationInfo?.countryName || '',
    state: locationInfo?.stateName || '',
  });

  useEffect(() => {
    fetchMemberSettings();
  }, []);

  // Add backup fetch for countries if they're not loaded
  useEffect(() => {
    if (countries.length === 0) {
      fetchCountries();
    }
  }, [countries.length, fetchCountries]);

  // Update form when context data changes
  useEffect(() => {
    if (memberSettings && locationInfo) {
      setForm({
        name: memberSettings.profile.display_name || '',
        country: locationInfo.countryName || '',
        state: locationInfo.stateName || '',
      });
    }
  }, [memberSettings, locationInfo]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    if (!memberSettings || !locationInfo) return false;

    return (
      form.name.trim() !== memberSettings.profile.display_name ||
      form.country !== locationInfo.countryName ||
      form.state !== locationInfo.stateName
    );
  }, [form, memberSettings, locationInfo]);

  const handleImageUpload = () => {
    // Implement image upload logic
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Find country code from name
      const selectedCountry = countries.find(c => c.name === form.country);
      if (!selectedCountry) {
        showToast.error('Invalid country', 'Please select a valid country');
        return;
      }

      // Find state code from name
      const states = await commonAPI.getStates(selectedCountry.iso2);
      const selectedState = states.data.find((s: any) => s.name === form.state);
      if (!selectedState) {
        showToast.error('Invalid state', 'Please select a valid state');
        return;
      }

      // Create updated settings object with all existing settings plus changes
      const { type, ...settingsWithoutType } = memberSettings || {};
      const updatedSettings = {
        ...settingsWithoutType,
        profile: {
          ...settingsWithoutType.profile,
          display_name: form.name.trim(),
          country: selectedCountry.iso2,
          state: selectedState.state_code,
        },
        security: {
          ...settingsWithoutType.security,
        },
        social_media: {
          ...settingsWithoutType.social_media,
        },
        content_preferences: {
          ...settingsWithoutType.content_preferences,
        },
        notification_preferences: {
          ...settingsWithoutType.notification_preferences,
        }
      };

      await updateMemberSettings(updatedSettings);

      setUser(prev=>({
        ...prev,
        name: form.name.trim()
      }));
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast.error('Failed to save changes', 'Please try again later');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatePickerOpen = () => {
    if (!form.country) {
      showToast.error('Country required', 'Please select a country first');
      return;
    }
    setShowStatePicker(true);
  };

  const getCountryCode = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country?.iso2;
  };

  if (isContextLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SubHeader title="Profile" />
        <View style={styles.loadingContainer}>
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
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Profile" />
      {isSaving && (
        <View style={styles.updatingOverlay}>
          <View style={[styles.updatingContainer, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[
              styles.updatingText,
              {
                color: colors.textPrimary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
                includeFontPadding: false,
                marginLeft: 8
              }
            ]}>
              Saving changes...
            </Text>
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.imageSection}>
              <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                <Image
                  source={{ uri: memberSettings?.profile.profile_photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  onPress={handleImageUpload}
                  style={[styles.uploadButton, { backgroundColor: colors.primary }]}>
                  <Camera size={20} color={colors.buttonText} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  Name
                </Text>
                <TextInput
                  value={form.name}
                  onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.textPrimary,
                      fontFamily: fonts.regular
                    }
                  ]}
                  editable={!isSaving}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  Country of residence
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  style={[
                    styles.input,
                    styles.countrySelector,
                    { backgroundColor: colors.surface }
                  ]}
                  disabled={isSaving}>
                  <Text style={[
                    styles.countryText,
                    {
                      color: form.country ? colors.textPrimary : colors.textSecondary,
                      fontFamily: fonts.regular
                    }
                  ]}>
                    {form.country || 'Select a country'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  State/Province
                </Text>
                <TouchableOpacity
                  onPress={handleStatePickerOpen}
                  style={[
                    styles.input,
                    styles.countrySelector,
                    { 
                      backgroundColor: colors.surface,
                      opacity: !form.country ? 0.5 : 1 
                    }
                  ]}
                  disabled={isSaving || !form.country}>
                  <Text style={[
                    styles.countryText,
                    {
                      color: form.state ? colors.textPrimary : colors.textSecondary,
                      fontFamily: fonts.regular
                    }
                  ]}>
                    {form.state || 'Select a state'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.primary,
                  opacity: (!hasChanges || isSaving) ? 0.5 : 1
                }
              ]}
              onPress={handleSave}
              disabled={!hasChanges || isSaving}>
              {isSaving ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={[
                  styles.saveButtonText,
                  {
                    color: colors.buttonText,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md
                  }
                ]}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={(country) => {
          setForm(prev => ({ ...prev, country, state: '' }));
          setShowCountryPicker(false);
        }}
        selectedCountry={form.country}
      />

      <StatePicker
        visible={showStatePicker}
        onClose={() => setShowStatePicker(false)}
        onSelect={(state) => {
          setForm(prev => ({ ...prev, state }));
          setShowStatePicker(false);
        }}
        countryCode={getCountryCode(form.country)}
        selectedState={form.state}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
  updatingOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  updatingContainer: {
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
  updatingText: {
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 32,
  },
  imageSection: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryText: {
    fontSize: 15,
  },
  hint: {
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});