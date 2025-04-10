import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { showToast } from '@/components/Toast';

interface ImageUploadOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  mediaTypes?: ImagePicker.MediaTypeOptions;
}

export async function uploadImage(options: ImageUploadOptions = {}) {
  try {
    // Request permission first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      showToast.error(
        'Permission denied',
        'Please allow access to your photo library to upload images'
      );
      return null;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: options.mediaTypes || ImagePicker.MediaTypeOptions.Images,
      allowsEditing: options.allowsEditing ?? true,
      aspect: options.aspect || [1, 1],
      quality: options.quality || 0.8,
      base64: true,
    });

    if (result.canceled) {
      return null;
    }

    // Get the first asset
    const asset = result.assets[0];

    // For web, we need to handle the URI differently
    if (Platform.OS === 'web') {
      // On web, the URI is already in the correct format
      return asset.uri;
    }

    // For native platforms, return the URI
    return asset.uri;
  } catch (error) {
    console.error('Error picking image:', error);
    showToast.error(
      'Upload failed',
      'Failed to upload image. Please try again.'
    );
    return null;
  }
}