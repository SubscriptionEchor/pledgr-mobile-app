import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { Camera, ChevronLeft, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { CountryPicker } from '@/components/CountryPicker';

interface ProfileForm {
  name: string;
  email: string;
  country: string;
  state: string;
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: 'John Doe',
    email: 'john@example.com',
    country: 'United States',
    state: 'California'
  });

  const handleImageUpload = () => {
    // Implement image upload logic
  };

  const handleSave = () => {
    // Implement save logic
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Profile" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageSection}>
            <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
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
              <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
              <TextInput
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary }]}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary }]}
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.locationSection}>
              <View style={styles.locationHeader}>
                <MapPin size={20} color={colors.textSecondary} />
                <Text style={[styles.locationTitle, { color: colors.textPrimary }]}>Location</Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowCountryPicker(true)}
                style={[styles.input, styles.pickerButton, { backgroundColor: colors.surface }]}>
                <Text style={[styles.pickerButtonText, { color: colors.textPrimary }]}>
                  {form.country}
                </Text>
                <ChevronLeft size={20} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>

              <TextInput
                value={form.state}
                onChangeText={(text) => setForm({ ...form, state: text })}
                style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary }]}
                placeholder="State/Province"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <Button label="Save Changes" onPress={handleSave} variant="primary" />
        </View>
      </ScrollView>

      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={(country) => {
          setForm({ ...form, country });
          setShowCountryPicker(false);
        }}
      />
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
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  locationSection: {
    gap: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 15,
  },
});