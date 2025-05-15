import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { useState, useEffect } from 'react';
import { CountryPicker } from '@/components/CountryPicker';
import { StatePicker } from '@/components/StatePicker';
import { showToast } from '@/components/Toast';
import { useUserContext } from '@/lib/context/UserContext';
import { useMemberSettings } from '@/hooks/useMemberSettings';
import { useAuth } from '@/lib/context/AuthContext';
import { Camera, ChevronDown } from 'lucide-react-native';
import { uploadImage } from '@/lib/utils/uploadImage';
import { LinearGradient } from 'expo-linear-gradient';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function ProfileScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const { setUser } = useAuth();
  const router = useRouter();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const { memberSettings, locationInfo, isLoading: isContextLoading, countries, fetchCountries } = useUserContext();
  const { updateMemberSettings, fetchMemberSettings, isLoading: isSettingsLoading } = useMemberSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingProfilePhoto, setPendingProfilePhoto] = useState<string | null>(null);
  const [showImageActions, setShowImageActions] = useState(false);
  
  const [form, setForm] = useState({
    name: memberSettings?.profile.display_name || '',
    country: locationInfo?.countryName || '',
    state: locationInfo?.stateName || '',
    profilePhoto: memberSettings?.profile.profile_photo || '',
  });

  // Track initial state for cancel
  const [initialForm, setInitialForm] = useState(form);
  const [initialProfilePhoto, setInitialProfilePhoto] = useState(form.profilePhoto);

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
        profilePhoto: memberSettings.profile.profile_photo || '',
      });
    }
  }, [memberSettings, locationInfo]);

  // Check for changes in form data
  useEffect(() => {
    if (memberSettings && locationInfo) {
      const initialValues = {
        name: memberSettings.profile.display_name || '',
        country: locationInfo.countryName || '',
        state: locationInfo.stateName || '',
        profilePhoto: memberSettings.profile.profile_photo || '',
      };

      const hasFormChanges = 
        form.name !== initialValues.name ||
        form.country !== initialValues.country ||
        form.state !== initialValues.state ||
        form.profilePhoto !== initialValues.profilePhoto;

      setHasChanges(hasFormChanges);
    }
  }, [form, memberSettings, locationInfo]);

  useEffect(() => {
    setInitialForm(form);
    setInitialProfilePhoto(form.profilePhoto);
  }, [memberSettings, locationInfo]);

  // Determine if there are unsaved changes
  const hasUnsavedChanges =
    form.name !== initialForm.name ||
    form.country !== initialForm.country ||
    form.state !== initialForm.state ||
    (pendingProfilePhoto !== null && pendingProfilePhoto !== initialProfilePhoto);

  const handleImageUpload = async () => {
    const imageUri = await uploadImage({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!imageUri) return;
    setPendingProfilePhoto(imageUri);
    setShowImageActions(true);
  };

  const handleImageSave = async () => {
    setForm(prev => ({ ...prev, profilePhoto: pendingProfilePhoto || prev.profilePhoto }));
    setPendingProfilePhoto(null);
    setShowImageActions(false);
    // Optionally, trigger save logic here or let user press the main Save button
  };

  const handleImageCancel = () => {
    setPendingProfilePhoto(null);
    setShowImageActions(false);
  };

  const generatePageUrl = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const pageUrl = generatePageUrl(form.name);

  const handlePageNameChange = (text: string) => {
    setForm(prev => ({ ...prev, name: text }));
  };

  const handleCountrySelect = (country: string) => {
    setForm(prev => ({ ...prev, country, state: '' }));
    setShowCountryPicker(false);
  };

  const handleStateSelect = (state: string) => {
    setForm(prev => ({ ...prev, state }));
    setShowStatePicker(false);
  };

  const handleStatePickerOpen = () => {
    if (form.country) {
      setShowStatePicker(true);
    }
  };

  // Save all changes
  const handleSaveAll = async () => {
    if (pendingProfilePhoto) {
      setForm(prev => ({ ...prev, profilePhoto: pendingProfilePhoto }));
      setPendingProfilePhoto(null);
    }
    setInitialForm(form);
    setInitialProfilePhoto(pendingProfilePhoto || form.profilePhoto);
    // Call your save logic here (existing handleSave)
    await handleSave();
  };

  // Cancel all changes
  const handleCancelAll = () => {
    setForm(initialForm);
    setPendingProfilePhoto(null);
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;

    try {
      setIsSaving(true);

      // Create updated settings object with all existing settings plus changes
      const { type, ...settingsWithoutType } = memberSettings || {};
      const updatedSettings = {
        ...settingsWithoutType,
        profile: {
          ...settingsWithoutType.profile,
          display_name: form.name,
          profile_photo: form.profilePhoto,
        },
      };

      await updateMemberSettings(updatedSettings);
      
      // Update user context with new name and avatar
      setUser(prev => prev ? {
        ...prev,
        name: form.name,
        avatar: form.profilePhoto
      } : null);
      
      showToast.success('Profile updated', 'Your profile has been updated successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error('Failed to update profile', 'Please try again later');
    } finally {
      setIsSaving(false);
    }
  };

  const getCountryCode = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country?.iso2;
  };

  // Split name into first and last for display
  const [firstName, ...lastNameArr] = form.name.split(' ');
  const lastName = lastNameArr.join(' ');
  // Get username and email safely
  const username = memberSettings && memberSettings.profile && 'username' in memberSettings.profile ? memberSettings.profile.username : '';
  const email = memberSettings && memberSettings.profile && 'email' in memberSettings.profile ? memberSettings.profile.email : '';
  const emailInitial = email ? email[0].toUpperCase() : '';

  // Get theme values
  const avatarBg = colors.surface;
  const avatarInitialColor = colors.primary;
  const avatarBorder = colors.background;
  const labelColor = colors.textSecondary;
  const valueColor = colors.textPrimary;
  const fieldLabelFont = fonts.regular;
  const fieldValueFont = fonts.medium;
  const fieldLabelSize = fontSize.md;
  const fieldValueSize = fontSize.lg;

  if (isContextLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Profile" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Cover and avatar */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={[styles.headerBg, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}
        >
          <View style={styles.avatarContainer}>
            {(pendingProfilePhoto || form.profilePhoto) ? (
              <Image
                source={{ uri: pendingProfilePhoto || form.profilePhoto }}
                style={[styles.avatar, { borderColor: avatarBorder }]}
              />
            ) : (
              <View style={[styles.avatarDefault, { backgroundColor: avatarBg, borderColor: avatarBorder }] }>
                <Text style={[styles.avatarInitial, { color: avatarInitialColor, fontFamily: fonts.bold, fontSize: 48 }]}>{emailInitial}</Text>
              </View>
            )}
            <TouchableOpacity style={[styles.avatarCameraBtn, { backgroundColor: colors.primary }]} onPress={handleImageUpload}>
              <Camera size={24} color={colors.buttonText} />
            </TouchableOpacity>
          </View>
          {showImageActions && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginRight: 12,
                }}
                onPress={handleImageSave}
              >
                <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.md }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.surface,
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={handleImageCancel}
              >
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
        {/* Profile fields */}
        <View style={[styles.content, { marginTop: 40 }]}>
          {/* Name field with character limit */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: labelColor, fontFamily: fieldLabelFont, fontSize: fieldLabelSize, marginBottom: 6 }]}>Name</Text>
            <TextInput
              value={form.name}
              onChangeText={text => {
                if (text.length <= 30) setForm(prev => ({ ...prev, name: text }));
              }}
              placeholder="Enter your name"
              placeholderTextColor={labelColor}
              style={[
                styles.input,
                { color: valueColor, fontFamily: fieldValueFont, fontSize: fieldValueSize, backgroundColor: colors.surface }
              ]}
              maxLength={30}
            />
            <Text style={{ color: labelColor, fontFamily: fieldLabelFont, fontSize: fontSize.sm, alignSelf: 'flex-end' }}>{form.name.length}/30</Text>
          </View>
          {/* Email field (read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: labelColor, fontFamily: fieldLabelFont, fontSize: fieldLabelSize, marginBottom: 6 }]}>Email</Text>
            <View style={[
              styles.input,
              { backgroundColor: colors.surface, justifyContent: 'center' }
            ]}>
              <Text style={{ color: valueColor, fontFamily: fieldValueFont, fontSize: fieldValueSize }}>{email}</Text>
            </View>
          </View>
          {/* Country picker */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: labelColor, fontFamily: fieldLabelFont, fontSize: fieldLabelSize, marginBottom: 6 }]}>Country</Text>
            <TouchableOpacity
              style={[
                styles.input,
                { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingRight: 8 }
              ]}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={{ color: form.country ? valueColor : labelColor, fontFamily: fieldValueFont, fontSize: fieldValueSize, flex: 1 }}>
                {form.country || 'Select country'}
              </Text>
              <ChevronDown size={20} color={labelColor} />
            </TouchableOpacity>
          </View>
          {/* State/Province picker */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: labelColor, fontFamily: fieldLabelFont, fontSize: fieldLabelSize, marginBottom: 6 }]}>State/Province</Text>
            <TouchableOpacity
              style={[
                styles.input,
                { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', opacity: form.country ? 1 : 0.5, paddingRight: 8 }
              ]}
              onPress={form.country ? () => setShowStatePicker(true) : undefined}
              disabled={!form.country}
            >
              <Text style={{ color: form.state ? valueColor : labelColor, fontFamily: fieldValueFont, fontSize: fieldValueSize, flex: 1 }}>
                {form.state || 'Select state'}
              </Text>
              <ChevronDown size={20} color={labelColor} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Save/Cancel at bottom if there are unsaved changes */}
        {hasUnsavedChanges && (
          <View style={{ flexDirection: 'row', marginTop: 32, marginBottom: 16, paddingHorizontal: 20, gap: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 8,
                flex: 1,
                alignItems: 'center',
              }}
              onPress={handleSaveAll}
            >
              <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.md }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface,
                paddingVertical: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                flex: 1,
                alignItems: 'center',
              }}
              onPress={handleCancelAll}
            >
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* Country and State pickers */}
      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={country => {
          setForm(prev => ({ ...prev, country, state: '' }));
          setShowCountryPicker(false);
        }}
      />
      <StatePicker
        visible={showStatePicker}
        onClose={() => setShowStatePicker(false)}
        onSelect={state => {
          setForm(prev => ({ ...prev, state }));
          setShowStatePicker(false);
        }}
        countryCode={getCountryCode(form.country)}
        selectedState={form.state}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBg: {
    height: 220,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  headerCameraBtn: {
    position: 'absolute',
    top: 32,
    right: 24,
    backgroundColor: '#000',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: -48,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarDefault: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    // fontSize, color, fontFamily set inline
  },
  avatarCameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  fieldsContainer: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
  fieldGroup: {
    marginBottom: 28,
  },
  fieldLabel: {
    flex: 1,
    // color, fontFamily, fontSize set inline
  },
  fieldValue: {
    flex: 2,
    textAlign: 'left',
    // color, fontFamily, fontSize set inline
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
    gap: 0,
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