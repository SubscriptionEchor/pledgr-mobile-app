import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Settings, LogOut, Crown, ChevronRight, Sparkles, Pencil, ChevronDown, Users } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useBottomSheet } from '@/lib/context/BottomSheetContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ConfirmationModal } from './ConfirmationModal';
import { showToast } from './Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { memberAPI } from '@/lib/api/member';

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
  const { user, updateUserRole, logout, isCreatorCreated } = useAuth();
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);

  const isCreator = user?.role === UserRole.CREATOR || user?.role === UserRole.CREATOR_ASSOCIATE;
  const isCreatorAssociate = user?.role === UserRole.CREATOR_ASSOCIATE;

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
      // Close role dropdown when closing the sheet
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

  if (!visible) {
    return null;
  }

  const handleNavigation = (route: string) => {
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

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      // Close role dropdown when closing the sheet
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
    ...(isCreatorCreated ? [{
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
      await updateUserRole(option.id as UserRole);
      showToast.success(
        'Role switched',
        `You are now in ${option.id === UserRole.CREATOR ? 'creator' : 'member'} mode`
      );
      setShowRoleDropdown(false);
    } catch (error) {
      showToast.error('Failed to switch role', 'Please try again');
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
            <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
              <View style={styles.profileLeft}>
                <Image
                  source={{ uri: currentUser.avatar }}
                  style={styles.avatar}
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
                    {currentUser.name}
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
                    {currentUser.email}
                  </Text>
                </View>
              </View>
              {!isCreatorAssociate && (
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: `${colors.primary}15` }]}
                  onPress={() => handleNavigation('profile')}>
                  <Pencil size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
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
                  <View style={[styles.roleIcon, { backgroundColor: `${colors.primary}15` }]}>
                    {currentUser.role === UserRole.CREATOR ? (
                      <Crown size={20} color={colors.primary} />
                    ) : currentUser.role === UserRole.CREATOR_ASSOCIATE ? (
                      <Users size={20} color={colors.primary} />
                    ) : (
                      <Sparkles size={20} color={colors.primary} />
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
                        currentUser.role === option.id && { backgroundColor: `${colors.primary}15` }
                      ]}
                      onPress={() => handleRoleSelect(option)}>
                      <View style={styles.roleOptionContent}>
                        <View style={[styles.roleIcon, { backgroundColor: `${option.color}15` }]}>
                          <option.icon size={20} color={option.color} />
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

                  {!isCreatorCreated && (
                    <TouchableOpacity
                      style={styles.creatorCardWrapper}
                      onPress={() => handleRoleSelect({ id: 'creator_onboard' } as any)}
                      disabled={isCreatorLoading}>
                      <LinearGradient
                        colors={['#1E88E5', '#9333EA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.creatorCard}>
                        <View style={styles.creatorContent}>
                          <View style={styles.creatorLeft}>
                            <View style={styles.creatorIconGroup}>
                              <View style={styles.creatorMainIcon}>
                                  <Crown size={24} color="#fff" />
                              </View>
                              <View style={styles.creatorSecondaryIcon}>
                                <Sparkles size={16} color="#fff" />
                              </View>
                            </View>
                            <View style={styles.creatorText}>
                              <Text style={[
                                styles.creatorTitle,
                                {
                                  color: '#fff',
                                  fontFamily: fonts.semibold,
                                  fontSize: fontSize.lg,
                                  includeFontPadding: false
                                }
                              ]}>
                                Become a Creator
                              </Text>
                              <Text style={[
                                styles.creatorDescription,
                                {
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontFamily: fonts.regular,
                                  fontSize: fontSize.sm,
                                  includeFontPadding: false
                                }
                              ]}>
                                Share your content with the world
                              </Text>
                            </View>
                          </View>
                          {isCreatorLoading ? (
                                  <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                  <ChevronRight size={20} color="#fff" />
                                )}
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              )}
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

            {!isCreatorAssociate && (
              <TouchableOpacity
                style={[styles.settingsButton, { backgroundColor: colors.surface }]}
                onPress={() => handleNavigation('settings')}>
                <View style={styles.settingsContent}>
                  <View style={[styles.settingsIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <Settings size={20} color={colors.primary} />
                  </View>
                  <Text style={[
                    styles.settingsText,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.medium,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Settings
                  </Text>
                </View>
                <View style={styles.chevronContainer}>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.signOutButton, { backgroundColor: `${colors.error}15` }]}
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
    borderRadius: 16,
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
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  settingsContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  creatorCardWrapper: {
    margin: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  creatorCard: {
    padding: 14,
  },
  creatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creatorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  creatorIconGroup: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  creatorMainIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorSecondaryIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorText: {
    flex: 1,
  },
  creatorTitle: {
    marginBottom: 4,
  },
  creatorDescription: {
    lineHeight: 20,
  },
});