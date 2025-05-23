import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { Search, Users, Crown, MoreVertical, Bell, MessageCircle, User } from 'lucide-react-native';
import { TextInput } from 'react-native';
import { showToast } from '@/components/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'expo-router';
import { UserRole } from '@/lib/enums';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBarComponent } from '@/components/StatusBarComponent';

// Mock creators data
const MOCK_CREATORS = [
  {
    id: '1',
    name: 'Sarah Anderson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    title: 'Digital Artist & Creative Technologist',
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    title: 'Web3 Educator & Community Builder',
  },
  {
    id: '3',
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    title: 'Tech Writer & Blockchain Enthusiast',
  }
];

export default function CreatorAssociateOnboardScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const [search, setSearch] = useState('');
  const [creators, setCreators] = useState(MOCK_CREATORS);
  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);
  const [creatorToRevoke, setCreatorToRevoke] = useState<typeof MOCK_CREATORS[0] | null>(null);
  const { updateUserRole } = useAuth();
  const router = useRouter();

  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(search.toLowerCase()) ||
    creator.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreatorSelect = async (creatorId: string) => {
    try {
      await updateUserRole(UserRole.CREATOR_ASSOCIATE);
      showToast.success(
        'Access granted',
        `You can now manage this creator's page`
      );
    } catch (error) {
      showToast.error(
        'Failed to update access',
        'Please try again later'
      );
    }
  };

  const handleRevokeAccess = (creator: typeof MOCK_CREATORS[0], event: any) => {
    event.stopPropagation();
    setCreatorToRevoke(creator);
    setShowRevokeConfirmation(true);
  };

  const handleConfirmRevoke = () => {
    if (!creatorToRevoke) return;

    setCreators(prev => prev.filter(c => c.id !== creatorToRevoke.id));
    showToast.success(
      'Access revoked',
      `You no longer have access to ${creatorToRevoke.name}'s page`
    );
    setShowRevokeConfirmation(false);
    setCreatorToRevoke(null);
  };

  const handleNavigateToChat = () => {
    router.push('/screens/creator-associate/chat');
  };

  const handleNavigateToNotifications = () => {
    router.push('/screens/creator-associate/notifications');
  };

  const handleNavigateToProfile = () => {
    router.push('/screens/member/profile');
  };

  const headerActions = (
    <View style={styles.headerRightContent}>
      <TouchableOpacity
        style={[styles.headerButton, { backgroundColor: colors.surface }]}
        onPress={handleNavigateToChat}>
        <MessageCircle size={20} color={colors.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.headerButton, { backgroundColor: colors.surface }]}
        onPress={handleNavigateToNotifications}>
        <Bell size={20} color={colors.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.headerButton, { backgroundColor: colors.surface }]}
        onPress={handleNavigateToProfile}>
        <User size={20} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBarComponent />
      <SubHeader title="Associate">
        {headerActions}
      </SubHeader>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Users size={32} color={colors.primary} />
          </View>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.bold,
              fontSize: fontSize['2xl'],
              includeFontPadding: false
            }
          ]}>
            Manage Creators
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
            View and manage the creators you have access to
          </Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search creators by name"
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

        {filteredCreators.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Crown size={32} color={colors.textSecondary} />
            <Text style={[
              styles.emptyTitle,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.lg,
                includeFontPadding: false
              }
            ]}>
              No creators found
            </Text>
            <Text style={[
              styles.emptyDescription,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Try searching with a different name or check back later
            </Text>
          </View>
        ) : (
          <View style={styles.creatorsList}>
            {filteredCreators.map(creator => (
              <TouchableOpacity
                key={creator.id}
                style={[
                  styles.creatorCard,
                  { backgroundColor: colors.surface }
                ]}
                onPress={() => handleCreatorSelect(creator.id)}
              >
                <View style={styles.creatorInfo}>
                  <Image
                    source={{ uri: creator.avatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.creatorDetails}>
                    <Text style={[
                      styles.creatorName,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.lg,
                        includeFontPadding: false
                      }
                    ]}>
                      {creator.name}
                    </Text>
                    <Text style={[
                      styles.creatorTitle,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      {creator.title}
                    </Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={(e) => handleRevokeAccess(creator, e)}
                      style={[styles.actionButton, { backgroundColor: colors.surface }]}
                    >
                      <MoreVertical size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <ConfirmationModal
        visible={showRevokeConfirmation}
        onClose={() => {
          setShowRevokeConfirmation(false);
          setCreatorToRevoke(null);
        }}
        onConfirm={handleConfirmRevoke}
        title="Revoke Access"
        description={`Are you sure you want to revoke your access to ${creatorToRevoke?.name}'s page? This action cannot be undone.`}
        confirmLabel="Revoke Access"
        confirmVariant="error"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContent: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    marginTop: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 24,
  },
  creatorsList: {
    gap: 12,
  },
  creatorCard: {
    padding: 16,
    borderRadius: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  creatorDetails: {
    flex: 1,
    gap: 4,
  },
  creatorName: {
    marginBottom: 2,
  },
  creatorTitle: {
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});