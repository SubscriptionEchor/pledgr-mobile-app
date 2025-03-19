import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, ScrollView, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, X, Globe as Globe2 } from 'lucide-react-native';
import { useState, useMemo } from 'react';

const LANGUAGES = [
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
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter((language) =>
      language.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Select Language</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.warningBox, { backgroundColor: `${colors.primary}15` }]}>
            <Globe2 size={24} color={colors.primary} />
            <Text style={[styles.warningText, { color: colors.textPrimary }]}>
              Choose your preferred language. This will change the language of the app interface.
            </Text>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search languages"
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />
          </View>

          <View style={styles.languageList}>
            {filteredLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  { 
                    backgroundColor: language.code === selectedCode ? `${colors.primary}15` : 'transparent',
                    borderBottomColor: colors.border 
                  }
                ]}
                onPress={() => onSelect(language)}>
                <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                  {language.name}
                </Text>
                {language.code === selectedCode && (
                  <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  languageList: {
    gap: 2,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});