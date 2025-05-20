import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Settings, LogOut, Crown, ChevronRight, Sparkles, Pencil, ChevronDown, Users } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { useBottomSheet } from '@/lib/context/BottomSheetContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ConfirmationModal } from './ConfirmationModal';
import { showToast } from './Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole, StorageKeys } from '@/lib/enums';
import { memberAPI } from '@/lib/api/member';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiImage, AnimatePresence } from 'moti';
import { Easing } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;

interface ProfileSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileSheet({ visible, onClose }: ProfileSheetProps) {
  const { colors, fonts, fontSize, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const { setSheetVisible } = useBottomSheet();
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);
  const { user, updateUserRole, logout, isCreatorCreated } = useAuth();
  const [hasCreatorToken, setHasCreatorToken] = useState(false);

  const isCreator = user?.role === UserRole.CREATOR || user?.role === UserRole.CREATOR_ASSOCIATE;
  const isCreatorAssociate = user?.role === UserRole.CREATOR_ASSOCIATE;

  useEffect(() => {
    AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN_CAMPAIGN).then(token => {
      setHasCreatorToken(!!token);
    });
  }, [visible]);

  useEffect(() => {
    setSheetVisible(visible);

    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 15,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setShowRoleDropdown(false);
    }
  }, [visible]);

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.MEMBER,
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
  };

  const currentUser = user || mockUser;

  const creatorImages = [
    'https://cdn.midjourney.com/1b5ae338-2a67-44ce-aa22-0d1c994260cd/0_0.png',
    'https://cdn.midjourney.com/9e1db248-5e90-45ad-84c2-d1f4dce89acc/0_2.png',
    'https://cdn.midjourney.com/6d7c3cf8-78e2-475f-865e-1d0fbe099b6d/0_2.png',
  ];
  const [creatorImageIdx, setCreatorImageIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCreatorImageIdx(idx => (idx + 1) % creatorImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!visible) {
    return null;
  }

  const handleNavigation = (route: string) => {
    setShowRoleDropdown(false);
    onClose();

    switch (route) {
      case 'settings':
        if (isCreator) {
          router.push('/screens/creator/settings');
        } else {
          router.push('/screens/member/settings');
        }
        break;

      case 'profile':
        if (isCreator) {
          router.push('/screens/creator/edit-page');
        } else {
          router.push('/screens/member/profile');
        }
        break;

      case 'creatorOnboard':
        router.push('/screens/common/creator-onboard');
        break;

      case 'creatorAssociate':
        router.push('/screens/creator-associate/onboard');
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      setShowRoleDropdown(false);
    });
  };

  const roleOptions = [
    {
      id: UserRole.MEMBER,
      label: 'Member',
      description: 'Browse and interact with content',
      icon: Sparkles,
      color: colors.primary
    },
    {
      id: UserRole.CREATOR,
      label: 'Creator',
      description: 'Manage your creator profile',
      icon: Crown,
      color: colors.primary
    },
    // ...(hasCreatorToken ? [{
    //   id: UserRole.CREATOR,
    //   label: 'Creator',
    //   description: 'Manage your creator profile',
    //   icon: Crown,
    //   color: colors.primary
    // }] : []),
    ...(hasCreatorToken ? [{
      id: UserRole.CREATOR,
      label: 'Creator',
      description: 'Manage your creator profile',
      icon: Crown,
      color: colors.primary
    }] : []),
    {
      id: 'creator_associate',
      label: 'Creator Associate',
      description: 'Help manage creator content',
      icon: Users,
      color: colors.primary
    }
  ];

  const handleRoleSelect = async (option: typeof roleOptions[0]) => {
    if (option.id === 'creator_onboard') {
      setIsCreatorLoading(true);
      try {
        const response = await memberAPI.checkCreatorExists();
        
        if (response.data.exists) {
          showToast.error(
            'Already a creator',
            'You already have a creator account'
          );
          return;
        }

        handleNavigation('creatorOnboard');
      } catch (error) {
        showToast.error(
          'Error',
          'Failed to check creator status. Please try again.'
        );
      } finally {
        setIsCreatorLoading(false);
      }
      return;
    }

    if (option.id === 'creator_associate') {
      handleNavigation('creatorAssociate');
      return;
    }

    try {
      console.log(option.id);
      await updateUserRole(option.id as UserRole);
      showToast.success(
        'Role switched',
        `You are now in ${option.id === UserRole.CREATOR ? 'creator' : 'member'} mode`
      );
      setShowRoleDropdown(false);
      onClose();
    } catch (error) {
      showToast.error('Failed to switch role', 'Please try again');
    }
  };

  const handleSignOutConfirm = async () => {
    try {
      await logout();
      setShowSignOutConfirmation(false);
      onClose();
      showToast.success('Signed out successfully', 'See you next time!');
    } catch (error) {
      showToast.error('Sign out failed', 'Please try again');
    }
  };

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            transform: [{ translateY }],
            maxHeight: MAX_SHEET_HEIGHT,
          }
        ]}>
        <View style={styles.handle} />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.content}>
            <View style={styles.sheetGroupCard}>
              <View style={[styles.profileSection, { backgroundColor: 'transparent' }]}>
                <View style={styles.profileLeft}>
                  <Image
                    source={{ uri: currentUser.profile_photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
                    style={[styles.avatar, { backgroundColor: `${colors.primary}15` }]}
                  />
                  <View style={styles.profileInfo}>
                    <Text style={[
                      styles.profileName,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.lg,
                        includeFontPadding: false
                      }
                    ]}>
                      {currentUser.name || 'User'}
                    </Text>
                    <Text style={[
                      styles.profileEmail,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      {currentUser.email || 'user@gmail.com'}
                    </Text>
                  </View>
                </View>
                {!isCreatorAssociate && !isCreator && (
                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: `${colors.primary}15` }]}
                    onPress={() => handleNavigation('profile')}>
                    <Pencil size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Current Role
              </Text>
              <TouchableOpacity
                style={[styles.roleSwitcher, { backgroundColor: colors.surface }]}
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}>
                <View style={styles.roleSwitcherContent}>
                  <View style={[styles.roleIcon, { backgroundColor: `${colors.primary}30` }]}>
                    {currentUser.role === UserRole.CREATOR ? (
                      <Crown size={24} color={colors.primary} />
                    ) : currentUser.role === UserRole.CREATOR_ASSOCIATE ? (
                      <Users size={24} color={colors.primary} />
                    ) : (
                      <Sparkles size={24} color={colors.primary} />
                    )}
                  </View>
                  <Text style={[
                    styles.currentRole,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    {currentUser.role === UserRole.CREATOR ? 'Creator' : 
                     currentUser.role === UserRole.CREATOR_ASSOCIATE ? 'Creator Associate' : 
                     'Member'}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.textSecondary} style={{ transform: [{ rotate: showRoleDropdown ? '180deg' : '0deg' }] }} />
              </TouchableOpacity>

              {showRoleDropdown && (
                <View style={[styles.roleDropdown, { backgroundColor: colors.surface }]}>
                  {roleOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.roleOption,
                        currentUser.role === option.id && { backgroundColor: `${colors.primary}20` }
                      ]}
                      onPress={() => handleRoleSelect(option)}>
                      <View style={styles.roleOptionContent}>
                        <View style={[
                          styles.roleIcon, 
                          { 
                            backgroundColor: currentUser.role === option.id 
                              ? `${colors.primary}40` 
                              : `${colors.primary}20`
                          }
                        ]}>
                          <option.icon 
                            size={24} 
                            color={currentUser.role === option.id 
                              ? colors.primary 
                              : colors.textSecondary} 
                          />
                        </View>
                        <View style={styles.roleText}>
                          <Text style={[
                            styles.roleTitle,
                            {
                              color: colors.textPrimary,
                              fontFamily: fonts.semibold,
                              fontSize: fontSize.md,
                              includeFontPadding: false
                            }
                          ]}>
                            {option.label}
                          </Text>
                          <Text style={[
                            styles.roleDescription,
                            {
                              color: colors.textSecondary,
                              fontFamily: fonts.regular,
                              fontSize: fontSize.sm,
                              includeFontPadding: false
                            }
                          ]}>
                            {option.description}
                          </Text>
                        </View>
                      </View>
                      {currentUser.role === option.id && (
                        <View style={[styles.activeRole, { backgroundColor: colors.primary }]}>
                          <Text style={[
                            styles.activeRoleText,
                            {
                              color: colors.buttonText,
                              fontFamily: fonts.medium,
                              fontSize: fontSize.xs,
                              includeFontPadding: false
                            }
                          ]}>
                            Active
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Standalone Become a Creator Section */}
            {!hasCreatorToken && (
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.creatorCardHost}
                  onPress={() => handleRoleSelect({ id: 'creator_onboard' } as any)}
                  disabled={isCreatorLoading}>
                  <View style={styles.creatorCardHostContent}>
                    {/* Left: Text and Button */}
                    <View style={styles.creatorCardHostLeft}>
                      <Text style={styles.creatorCardHostTitle}>Become a creator</Text>
                      <Text style={styles.creatorCardHostSubtitle}>Share your passion, build your audience, and earn doing what you love.</Text>
                      <View style={styles.creatorCardHostButtonWrapper}>
                        <View style={[styles.creatorCardHostButton, { backgroundColor: colors.primary }]}>
                          <Text style={styles.creatorCardHostButtonText}>Start journey</Text>
                        </View>
                      </View>
                    </View>
                    {/* Right: Image */}
                    <View style={styles.creatorCardHostGrid}>
                      <View style={styles.creatorCardHostGridRow}>
                        <Image source={{ uri: 'https://cdn.midjourney.com/1b5ae338-2a67-44ce-aa22-0d1c994260cd/0_0.png' }} style={styles.creatorCardHostGridImage} />
                        <Image source={{ uri: 'https://cdn.midjourney.com/9e1db248-5e90-45ad-84c2-d1f4dce89acc/0_2.png' }} style={styles.creatorCardHostGridImage} />
                      </View>
                      <View style={styles.creatorCardHostGridRow}>
                        <Image source={{ uri: 'https://cdn.midjourney.com/6d7c3cf8-78e2-475f-865e-1d0fbe099b6d/0_2.png' }} style={styles.creatorCardHostGridImage} />
                        <Image source={{ uri: 'https://cdn.midjourney.com/a809c8c0-c74d-4168-8380-add29c0ca09c/0_1.png' }} style={styles.creatorCardHostGridImage} />
                      </View>
                    </View>
                  </View>
                  {isCreatorLoading && (
                    <ActivityIndicator color="#5B2EFF" size="small" style={{ marginTop: 8 }} />
                  )}
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.sheetGroupCard}>
              <View style={styles.section}>
                <Text style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  Appearance
                </Text>
                <View style={[styles.themeSelector, { backgroundColor: colors.surface }]}>
                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      { backgroundColor: !isDark ? `${colors.primary}15` : 'transparent' }
                    ]}
                    onPress={() => !isDark || toggleTheme()}>
                    <Text style={[
                      styles.themeText,
                      {
                        color: !isDark ? colors.primary : colors.textSecondary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Light
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      { backgroundColor: isDark ? `${colors.primary}15` : 'transparent' }
                    ]}
                    onPress={() => isDark || toggleTheme()}>
                    <Text style={[
                      styles.themeText,
                      {
                        color: isDark ? colors.primary : colors.textSecondary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      Dark
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Divider and extra spacing before Sign Out */}
            <View style={styles.signOutDivider} />
            <TouchableOpacity
              style={[styles.signOutButton, { marginTop: 10 }]}
              onPress={() => setShowSignOutConfirmation(true)}>
              <LogOut size={20} color={colors.error} />
              <Text style={[
                styles.signOutText,
                {
                  color: colors.error,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Sign out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      <ConfirmationModal
        visible={showSignOutConfirmation}
        onClose={() => setShowSignOutConfirmation(false)}
        onConfirm={handleSignOutConfirm}
        title="Sign Out"
        description="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmLabel="Sign Out"
        confirmVariant="error"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94a3b8',
    alignSelf: 'center',
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: MAX_SHEET_HEIGHT - 32,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileInfo: {
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginLeft: 4,
  },
  roleSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  roleSwitcherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentRole: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleDropdown: {
    marginTop: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  roleOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  roleText: {
    flex: 1,
  },
  roleTitle: {
    marginBottom: 2,
  },
  roleDescription: {
    lineHeight: 18,
  },
  activeRole: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeRoleText: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  themeOption: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  themeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  creatorCardHost: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'visible',
    marginHorizontal: 2,
    marginTop: 2,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  creatorCardHostContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    minHeight: 140,
  },
  creatorCardHostLeft: {
    flex: 1.2,
    justifyContent: 'center',
  },
  creatorCardHostTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  creatorCardHostSubtitle: {
    fontSize: 15,
    color: '#444',
    fontWeight: '400',
    marginBottom: 18,
  },
  creatorCardHostButtonWrapper: {
    flexDirection: 'row',
  },
  creatorCardHostButton: {
    backgroundColor: '#5B2EFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  creatorCardHostButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  creatorCardHostGrid: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  creatorCardHostGridRow: {
    flexDirection: 'row',
    gap: 6,
  },
  creatorCardHostGridImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
  },
  signOutDivider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
  },
  sheetGroupCard: {
    backgroundColor: '#fafbfc',
    borderRadius: 16,
    padding: 0,
    marginBottom: 18,
    overflow: 'hidden',
  },
});