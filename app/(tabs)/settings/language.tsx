import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Globe as Globe2, ChevronRight } from 'lucide-react-native';

export default function LanguageScreen() {
  const { colors } = useTheme();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'en',
    name: 'English',
    nativeName: 'English'
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Language" />
      <View style={styles.content}>
        <View style={[styles.warningBox, { backgroundColor: `${colors.primary}15` }]}>
          <Globe2 size={24} color={colors.primary} />
          <Text style={[styles.warningText, { color: colors.textPrimary }]}>
            Choose your preferred language. This will change the language of the app interface.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Current Language
          </Text>
          <TouchableOpacity
            onPress={() => setShowLanguagePicker(true)}
            style={[styles.languageButton, { backgroundColor: colors.surface }]}>
            <View>
              <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                {selectedLanguage.name}
              </Text>
              <Text style={[styles.nativeName, { color: colors.textSecondary }]}>
                {selectedLanguage.nativeName}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <LanguagePicker
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        onSelect={(language) => {
          setSelectedLanguage(language);
          setShowLanguagePicker(false);
        }}
        selectedCode={selectedLanguage.code}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 14,
  },
});