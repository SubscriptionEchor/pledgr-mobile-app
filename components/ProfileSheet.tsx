import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Settings, LogOut, Crown, ChevronRight, Sparkles, Pencil, ChevronDown } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useBottomSheet } from '@/lib/context/BottomSheetContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ConfirmationModal } from './ConfirmationModal';
import { showToast } from './Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';

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
  const [showRolePicker, setShowRolePicker] = useState(false);
  const { user, updateUserRole, logout, isCreatorCreated } = useAuth();

  const isCreator = user?.role === UserRole.CREATOR || user?.role === UserRole.CREATOR_ASSOCIATE;

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
    }
  }, [visible]);

  if (!visible || !user) return null;

  const handleNavigation = (route: string) => {
    onClose();
    // If user is a creator and trying to access settings, redirect to creator settings
    if (route === '/settings' && isCreator) {
      router.push('/settings/creator-settings');
    } else {
      router.push(route);
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
    });
  };

  const handleRoleSwitch = async (role: UserRole) => {
    try {
      await updateUserRole(role);
      setShowRolePicker(false);
      showToast.success(
        'Role switched',
        `You are now in ${role === UserRole.CREATOR ? 'creator' : 'member'} mode`
      );
    } catch (error) {
      showToast.error('Failed to switch role', 'Please try again');
    }
  };

  const renderRolePicker = () => (
    <View style={[styles.rolePickerContainer, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={[
          styles.roleOption,
          user.role === UserRole.CREATOR && { backgroundColor: `${colors.primary}15` }
        ]}
        onPress={() => handleRoleSwitch(UserRole.CREATOR)}>
        <View style={styles.roleOptionContent}>
          <View style={[styles.roleIcon, { backgroundColor: `${colors.primary}15` }]}>
            <Crown size={20} color={colors.primary} />
          </View>
          <View style={styles.roleText}>
            <Text style={[
              styles.roleTitle,
              { 
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
              }
            ]}>
              Creator
            </Text>
            <Text style={[
              styles.roleDescription,
              { 
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
              }
            ]}>
              Manage your creator profile
            </Text>
          </View>
        </View>
        {user.role === UserRole.CREATOR && (
          <View style={[styles.activeRole, { backgroundColor: colors.primary }]}>
            <Text style={[
              styles.activeRoleText,
              { 
                color: colors.buttonText,
                fontFamily: fonts.medium,
                fontSize: fontSize.xs,
              }
            ]}>
              Active
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roleOption,
          user.role === UserRole.MEMBER && { backgroundColor: `${colors.primary}15` }
        ]}
        onPress={() => handleRoleSwitch(UserRole.MEMBER)}>
        <View style={styles.roleOptionContent}>
          <View style={[styles.roleIcon, { backgroundColor: `${colors.primary}15` }]}>
            <Sparkles size={20} color={colors.primary} />
          </View>
          <View style={styles.roleText}>
            <Text style={[
              styles.roleTitle,
              { 
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
              }
            ]}>
              Member
            </Text>
            <Text style={[
              styles.roleDescription,
              { 
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
              }
            ]}>
              Browse and interact with content
            </Text>
          </View>
        </View>
        {user.role === UserRole.MEMBER && (
          <View style={[styles.activeRole, { backgroundColor: colors.primary }]}>
            <Text style={[
              styles.activeRoleText,
              { 
                color: colors.buttonText,
                fontFamily: fonts.medium,
                fontSize: fontSize.xs,
              }
            ]}>
              Active
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.overlay}>
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
                  source={{ uri: user.avatar }} 
                  style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={[
                    styles.profileName, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.lg,
                    }
                  ]}>
                    {user.name}
                  </Text>
                  <Text style={[
                    styles.profileEmail, 
                    { 
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                    }
                  ]}>
                    {user.email}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: `${colors.primary}15` }]}
                onPress={() => handleNavigation('/settings/profile')}>
                <Pencil size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {isCreatorCreated ? (
              <View style={styles.section}>
                <Text style={[
                  styles.sectionTitle, 
                  { 
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                  }
                ]}>
                  Current Role
                </Text>
                <TouchableOpacity
                  style={[styles.roleSwitcher, { backgroundColor: colors.surface }]}
                  onPress={() => setShowRolePicker(!showRolePicker)}>
                  <View style={styles.roleSwitcherContent}>
                    <View style={[styles.roleIcon, { backgroundColor: `${colors.primary}15` }]}>
                      {user.role === UserRole.CREATOR ? (
                        <Crown size={20} color={colors.primary} />
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
                      }
                    ]}>
                      {user.role === UserRole.CREATOR ? 'Creator' : 'Member'}
                    </Text>
                  </View>
                  <ChevronDown size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                {showRolePicker && renderRolePicker()}
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.creatorCardWrapper}
                onPress={() => handleNavigation('/creator')}>
                <LinearGradient
                  colors={[colors.primary, '#9333ea']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.creatorCard}>
                  <View style={styles.creatorContent}>
                    <View style={styles.creatorLeft}>
                      <View style={styles.creatorIconGroup}>
                        <View style={styles.creatorMainIcon}>
                          <Crown size={28} color="#fff" />
                        </View>
                        <View style={styles.creatorSecondaryIcon}>
                          <Sparkles size={16} color="#fff" />
                        </View>
                      </View>
                      <View style={styles.creatorText}>
                        <Text style={[
                          styles.creatorTitle,
                          {
                            fontFamily: fonts.semibold,
                            fontSize: fontSize.lg,
                            color: '#fff',
                          }
                        ]}>
                          Become a Creator
                        </Text>
                        <Text style={[
                          styles.creatorDescription,
                          {
                            fontFamily: fonts.regular,
                            fontSize: fontSize.sm,
                            color: 'rgba(255, 255, 255, 0.9)',
                          }
                        ]}>
                          Share your content with the world
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle, 
                { 
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.md,
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
                    }
                  ]}>
                    Dark
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.settingsButton, { backgroundColor: colors.surface }]}
              onPress={() => handleNavigation('/settings')}>
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
                  }
                ]}>
                  Settings
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
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
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94a3b8',
    alignSelf: 'center',
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: MAX_SHEET_HEIGHT - 36, // Subtract handle height and padding
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 24,
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
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    gap: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    gap: 12,
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
  rolePickerContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  themeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  creatorCardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  creatorCard: {
    padding: 20,
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
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
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
    height: 44,
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});