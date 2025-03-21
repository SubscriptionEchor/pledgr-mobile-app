import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Settings, LogOut, Crown, ChevronRight, Sparkles, Star } from 'lucide-react-native';
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
  const { colors, isDark, toggleTheme } = useTheme();
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
    // Implement sign out logic here
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
          {/* Profile Section */}
          <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                John Doe
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                john@example.com
              </Text>
            </View>
          </View>

          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
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
                  { color: !isDark ? colors.primary : colors.textSecondary }
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
                  { color: isDark ? colors.primary : colors.textSecondary }
                ]}>
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Creator Section */}
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
                    <Text style={styles.creatorTitle}>
                      Become a Creator
                    </Text>
                    <Text style={styles.creatorDescription}>
                      Share your content with the world
                    </Text>
                  </View>
                </View>
                <View style={styles.creatorStats}>
                  <View style={styles.statItem}>
                    <Star size={14} color="#fff" />
                    <Text style={styles.statText}>10K+ Creators</Text>
                  </View>
                  <ChevronRight size={20} color="#fff" style={styles.chevronIcon} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Settings Section */}
          <TouchableOpacity 
            style={[styles.settingsButton, { backgroundColor: colors.surface }]}
            onPress={() => handleNavigation('/settings')}>
            <View style={styles.settingsContent}>
              <View style={[styles.settingsIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Settings size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingsText, { color: colors.textPrimary }]}>
                Settings
              </Text>
            </View>
            <View style={styles.chevronContainer}>
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: `${colors.error}15` }]}
            onPress={() => setShowSignOutConfirmation(true)}>
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>
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
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  creatorDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  creatorStats: {
    alignItems: 'flex-end',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  chevronIcon: {
    marginRight: -4,
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