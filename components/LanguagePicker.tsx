import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, X, Check } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { useMemberSettings } from '@/hooks/useMemberSettings';

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

interface LanguagePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (language: { code: string; name: string }) => void;
  selectedCode?: string;
}

export function LanguagePicker({ visible, onClose, onSelect, selectedCode }: LanguagePickerProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [search, setSearch] = useState('');
  const { memberSettings, updateMemberSettings, isLoading } = useMemberSettings();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    selectedCode ? LANGUAGES.find(l => l.code === selectedCode) || null : null
  );

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(language =>
      language.name.toLowerCase().includes(search.toLowerCase()) ||
      language.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const handleSelect = async (language: Language) => {
    // Update state immediately
    setSelectedLanguage(language);
    onSelect(language);

    try {
      // Create updated settings object with all existing settings plus changes
      const { type, ...settingsWithoutType } = memberSettings || {};
      const updatedSettings = {
        ...settingsWithoutType,
        content_preferences: {
          ...settingsWithoutType.content_preferences,
          language: language.code
        },
        security: {
          ...settingsWithoutType.security,
        },
        social_media: {
          ...settingsWithoutType.social_media,
        },
        notification_preferences: {
          ...settingsWithoutType.notification_preferences,
        }
      };

      await updateMemberSettings(updatedSettings);
    } catch (error) {
      // Revert state if API call fails
      setSelectedLanguage(selectedCode ? LANGUAGES.find(l => l.code === selectedCode) || null : null);
      console.error('Error updating language:', error);
    }
  };

  const renderSelectedLanguage = () => {
    if (!selectedCode || search) return null;

    const selected = LANGUAGES.find(l => l.code === selectedCode);
    if (!selected) return null;

    return (
      <View style={[styles.selectedSection, { backgroundColor: `${colors.primary}08` }]}>
        <Text style={[
          styles.selectedTitle,
          {
            color: colors.textSecondary,
            fontFamily: fonts.medium,
            fontSize: fontSize.sm,
            includeFontPadding: false
          }
        ]}>
          Selected
        </Text>
        <TouchableOpacity
          style={[
            styles.languageItem,
            { 
              borderBottomColor: colors.border,
              backgroundColor: `${colors.primary}20`,
              marginTop: 8,
            }
          ]}
          onPress={() => handleSelect(selected)}
          disabled={isLoading}>
          <Text style={[
            styles.languageName,
            {
              color: colors.primary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            {selected.name}
          </Text>
          <Check size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
            Select Language
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {isLoading && (
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

        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search languages"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.searchInput,
              {
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}
          />
        </View>

        {renderSelectedLanguage()}

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {!search && selectedCode && (
            <View style={[styles.listHeader, { backgroundColor: `${colors.primary}08` }]}>
              <Text style={[
                styles.listHeaderText,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                All Languages
              </Text>
            </View>
          )}

          <View style={styles.languageList}>
            {filteredLanguages.map(language => {
              const isSelected = language.code === selectedCode;
              if (isSelected && !search) return null;

              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    { 
                      borderBottomColor: colors.border,
                      backgroundColor: isSelected ? `${colors.primary}20` : 'transparent'
                    }
                  ]}
                  onPress={() => handleSelect(language)}
                  disabled={isLoading}>
                  <Text style={[
                    styles.languageName,
                    {
                      color: isSelected ? colors.primary : colors.textPrimary,
                      fontFamily: isSelected ? fonts.semibold : fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    {language.name}
                  </Text>
                  {isSelected && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 100,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
  },
  selectedSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  selectedTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listHeaderText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  languageList: {
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  languageName: {
    fontSize: 16,
  },
});