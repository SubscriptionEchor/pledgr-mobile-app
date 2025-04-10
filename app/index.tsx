import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys, UserRole } from '@/lib/enums';
import { router } from 'expo-router';
import { authAPI } from '@/lib/api/auth';

export default function SplashScreen() {
  const { fonts, updateBrandColor } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  const { setUser } = useAuth();

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();

    // Animate dots
    const animateDots = () => {
      Animated.sequence([
        // Dot 1
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Dot 2
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Dot 3
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Reset all dots
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ]).start(() => animateDots()); // Loop animation
    };

    animateDots();

    const checkAuthStatus = async () => {
      try {
        // 1. Check if token exists
        const token = await AsyncStorage.getItem(StorageKeys.TOKEN);
        if (!token) {
          router.replace('/auth/sign-in');
          return;
        }

        // 2. Check if access_token_member exists
        const accessTokenMember = await AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN_MEMBER);
        if (!accessTokenMember) {
          router.replace('/auth/sign-in');
          return;
        }

        // 3. Check user role and navigate accordingly
        const userRole = await AsyncStorage.getItem(StorageKeys.USER_ROLE);
        console.log("User Role : ", userRole);
        if (!userRole) {
          router.replace('/auth/sign-in');
          return;
        }
        
        if (userRole === UserRole.CREATOR) {
          const accessTokenCampaign = await AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN_CAMPAIGN);
          if (!accessTokenCampaign) {
            router.replace('/auth/sign-in');
            return;
          }
        }

        // 4. Fetch base info after all checks pass
        const baseInfoResponse = await authAPI.fetchBaseInfo();
        
        // Extract user info from response
        const data = baseInfoResponse?.data;
        const userData = {
          name: data?.memberObj?.settings?.profile?.display_name || '',
          email: data?.memberObj?.settings?.profile?.email || '',
          role: userRole as UserRole,
          profile_photo: data?.memberObj?.settings?.profile?.profile_photo || ''
        };

        // Update user state
        setUser(userData);

        // Brand color
        if (data?.campaignObj && data?.campaignObj?.campaign_settings?.brand_color?.hex_code) {
          let color = data?.campaignObj?.campaign_settings?.brand_color?.hex_code;
          await AsyncStorage.setItem(StorageKeys.BRAND_COLOR, color);
          updateBrandColor(color);
        }

        // Store access tokens if present
        if (baseInfoResponse?.data?.accessTokenMember) {
          await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN_MEMBER, baseInfoResponse.data.accessTokenMember);
        }
        if (baseInfoResponse?.data?.accessTokenCampaign) {
          await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN_CAMPAIGN, baseInfoResponse.data.accessTokenCampaign);
        }

        // Navigate based on user role
        switch (userRole) {
          case UserRole.CREATOR:
            router.replace('/creator/home');
            break;
          case UserRole.CREATOR_ASSOCIATE:
            router.replace('/creator-associate/home');
            break;
          case UserRole.MEMBER:
            router.replace('/member/home');
            break;
          default:
            router.replace('/auth/sign-in');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        await AsyncStorage.multiRemove([
          StorageKeys.TOKEN,
          StorageKeys.USER_ROLE,
          StorageKeys.IS_CREATOR_CREATED,
        ]);
        router.replace('/auth/sign-in');
      }
    };

    // Wait for 3 seconds before checking auth status
    const timer = setTimeout(checkAuthStatus, 3000);

    return () => {
      clearTimeout(timer);
      dot1Opacity.setValue(0.3);
      dot2Opacity.setValue(0.3);
      dot3Opacity.setValue(0.3);
    };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#e3f2fd', '#bbdefb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.brandContainer}>
            <View style={styles.iconContainer}>
              <Crown size={48} color="#1e88e5" strokeWidth={1.5} />
            </View>
            <Text style={[styles.brandName, { fontFamily: fonts.bold }]}>
              Pledgr
            </Text>
          </View>

          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { fontFamily: fonts.medium }]}>
              Loading
            </Text>
            <View style={styles.dots}>
              <Animated.Text style={[styles.dot, { opacity: dot1Opacity, fontFamily: fonts.bold }]}>
                .
              </Animated.Text>
              <Animated.Text style={[styles.dot, { opacity: dot2Opacity, fontFamily: fonts.bold }]}>
                .
              </Animated.Text>
              <Animated.Text style={[styles.dot, { opacity: dot3Opacity, fontFamily: fonts.bold }]}>
                .
              </Animated.Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 100,
  },
  brandContainer: {
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.1)',
    shadowColor: '#1e88e5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  brandName: {
    fontSize: 32,
    color: '#1e88e5',
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#1e88e5',
    includeFontPadding: false
  },
  dots: {
    flexDirection: 'row',
    marginLeft: 2,
  },
  dot: {
    fontSize: 20,
    color: '#1e88e5',
    lineHeight: 20,
  },
});