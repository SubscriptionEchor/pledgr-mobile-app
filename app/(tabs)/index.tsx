import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Pencil } from 'lucide-react-native';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const isCreator = user?.role === UserRole.CREATOR;

  const handleEdit = () => {
    router.push('/editPage');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <View style={styles.content}>
        <Text style={[
          styles.title, 
          { 
            color: colors.textPrimary,
            fontFamily: fonts.bold,
            fontSize: fontSize['2xl'],
          }
        ]}>
          Home
        </Text>
        
        {isCreator && (
          <TouchableOpacity
            onPress={handleEdit}
            style={[
              styles.editButton,
              { backgroundColor: colors.primary }
            ]}>
            <Pencil size={20} color={colors.buttonText} />
            <Text style={[
              styles.editButtonText,
              {
                color: colors.buttonText,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
              }
            ]}>
              Edit Page
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});