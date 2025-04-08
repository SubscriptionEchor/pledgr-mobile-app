import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { Globe, Utensils, Palette, Music, BookOpen, Gamepad2, PenTool, Building2, Atom, Home } from 'lucide-react-native';
import { useState } from 'react';

interface Category {
  id: string;
  icon: any;
  label: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', icon: Globe, label: 'All Categories' },
  { id: 'food', icon: Utensils, label: 'Food' },
  { id: 'arts', icon: Palette, label: 'Arts & Entertainment' },
  { id: 'music', icon: Music, label: 'Music' },
  { id: 'writing', icon: BookOpen, label: 'Writing' },
  { id: 'gaming', icon: Gamepad2, label: 'Sports & Gaming' },
  { id: 'design', icon: PenTool, label: 'Design & Style' },
  { id: 'business', icon: Building2, label: 'Business' },
  { id: 'tech', icon: Atom, label: 'Science & Tech' },
  { id: 'lifestyle', icon: Home, label: 'Home & Lifestyle' },
];

export default function CreatorOnboardingScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleNext = () => {
    if (selectedCategory) {
      router.push('/screens/common/creator-page');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Become a Creator" />

      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: fontSize['2xl'],
                includeFontPadding: false
              }
            ]}>
              What type of content will you create?
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
              Choose a category that best describes your content.
            </Text>
          </View>

          <View style={styles.grid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: selectedCategory === category.id ? colors.primary : 'transparent',
                  }
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.primary}15` }
                ]}>
                  <category.icon size={24} color={colors.primary} />
                </View>
                <Text style={[
                  styles.categoryLabel,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: colors.primary,
                opacity: selectedCategory ? 1 : 0.5,
              }
            ]}
            onPress={handleNext}
            disabled={!selectedCategory}
          >
            <Text style={[
              styles.nextButtonText,
              {
                color: colors.buttonText,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 32,
    paddingBottom: 100, // Add padding to account for the sticky button
  },
  header: {
    gap: 8,
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  nextButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});