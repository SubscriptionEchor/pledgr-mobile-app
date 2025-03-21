import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Settings, LogOut, Crown, ChevronRight, Sparkles, Pencil } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useBottomSheet } from '@/lib/context/BottomSheetContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ConfirmationModal } from './ConfirmationModal';
import { showToast } from './Toast';

interface ProfileSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileSheet({ visible, onClose }: ProfileSheetProps) {
  const { colors, fonts, fontSize, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const translateY = useRef(new Animated.Value(500)).current;
  const { setSheetVisible } = useBottomSheet();
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);

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
        toValue: 500,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route);
  };

  const handleSignOutConfirm = () => {
    setShowSignOutConfirmation(false);
    onClose();
    showToast.success('Signed out successfully', 'See you next time!');
  };

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View 
        style={[
          styles.sheet,
          { 
            backgroundColor: colors.background,
            transform: [{ translateY }]
          }
        ]}>
        <View style={styles.handle} />

        <View style={styles.content}>
          <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
            <View style={styles.profileLeft}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
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
                  John Doe
                </Text>
                <Text style={[
                  styles.profileEmail, 
                  { 
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                  }
                ]}>
                  john@example.com
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: `${colors.primary}15` }]}
              onPress={() => handleNavigation('/settings/profile')}>
              <Pencil size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94a3b8',
    alignSelf: 'center',
    marginBottom: 20,
  },
  content: {
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