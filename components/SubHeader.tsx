import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface SubHeaderProps { 
  title: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
  titleAlignment?: 'center' | 'left';
}

export function SubHeader({ title, children, showBackButton = true, titleAlignment = 'center' }: SubHeaderProps) {
  const { colors, fonts, fontSize } = useTheme();

  return (
    <View style={[
      styles.header,
      { backgroundColor: colors.background, borderBottomColor: colors.border, shadowColor: colors.textPrimary }
    ]}>
      <View style={styles.topRow}>
        {showBackButton ? (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          > 
            <ChevronLeft size={24} color={colors.textPrimary} /> 
          </TouchableOpacity>
        ) : (
          <View style={{ width: 16 }} />
        )}
        <Text style={[
          styles.title, 
          { 
            color: colors.textPrimary, 
            fontFamily: fonts.semibold, 
            fontSize: fontSize.xl, 
            includeFontPadding: false,
            textAlign: titleAlignment,
            ...(titleAlignment === 'left' ? { paddingLeft: 4 } : {})
          }
        ]}>
          {title}
        </Text>
        {children ? (
          children
        ) : (
          <View style={{ width: showBackButton ? 34 : 16 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
    paddingBottom: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButton: {
    padding: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  subHeaderContent: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});