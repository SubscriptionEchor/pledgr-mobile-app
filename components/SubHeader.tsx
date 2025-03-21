import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface SubHeaderProps { 
  title: string;
}

export function SubHeader({ title }: SubHeaderProps) {
  const { colors, fonts, fontSize } = useTheme();

  return (
    <View style={[styles.header, { 
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      shadowColor: colors.textPrimary,
    }]}>
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      > 
        <ChevronLeft size={24} color={colors.textPrimary} /> 
      </TouchableOpacity>
      <Text style={[
        styles.title, 
        { 
          color: colors.textPrimary,
          fontFamily: fonts.semibold,
          fontSize: fontSize.xl,
        }
      ]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 44,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    left: 10,
    bottom: 8,
    zIndex: 1,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
  },
});