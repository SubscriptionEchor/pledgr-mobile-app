import { View, Text, StyleSheet, Animated, Image, StatusBar } from 'react-native';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys, UserRole } from '@/lib/enums';
import { router } from 'expo-router';
import { authAPI } from '@/lib/api/auth';
import { memberAPI } from '@/lib/api/member';

export default function SplashScreen() {
  const { fonts, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const { setUser } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let animationTimeout: NodeJS.Timeout;

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

    const checkAuthStatus = async () => {
      try {
        // 1. Check if token exists
        const token = await AsyncStorage.getItem(StorageKeys.TOKEN);
        if (!token) {
          if (isMounted) {
            router.replace('/auth/sign-in');
          }
          return;
        }

        // 2. Check if access_token_member exists
        const accessTokenMember = await AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN_MEMBER);
        if (!accessTokenMember) {
          if (isMounted) {
            router.replace('/auth/sign-in');
          }
          return;
        }

        // 3. Check user role and navigate accordingly
        const userRole = await AsyncStorage.getItem(StorageKeys.USER_ROLE);
        if (!userRole) {
          if (isMounted) {
            router.replace('/auth/sign-in');
          }
          return;
        }
        
        if (userRole === UserRole.CREATOR) {
          const accessTokenCampaign = await AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN_CAMPAIGN);
          if (!accessTokenCampaign) {
            if (isMounted) {
              router.replace('/auth/sign-in');
            }
            return;
          }
        }

        // 4. Fetch base info after all checks pass
        const baseInfoResponse = await authAPI.fetchBaseInfo();
        if (!baseInfoResponse?.data) {
          throw new Error('Failed to fetch base info');
        }

        const data = baseInfoResponse.data;
        if (data.accessTokenMember) {
          await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN_MEMBER, data.accessTokenMember);
        }
        if (data.accessTokenCampaign) {
          await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN_CAMPAIGN, data.accessTokenCampaign);
        }

        // 5. Fetch user profile and update user state
        const userProfile = await memberAPI.getProfile();
        if (isMounted) {
          setUser(userProfile);
        }

        // Navigate based on user role
        if (isMounted) {
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
        }
      } catch (error) {
        if (isMounted) {
          await AsyncStorage.multiRemove([
            StorageKeys.TOKEN,
            StorageKeys.USER_ROLE,
            StorageKeys.IS_CREATOR_CREATED,
          ]);
          router.replace('/auth/sign-in');
        }
      }
    };

    // Wait for 4 seconds before checking auth status
    animationTimeout = setTimeout(checkAuthStatus, 4000);

    return () => {
      isMounted = false;
      clearTimeout(animationTimeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#052f4a"
        translucent
      />
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
          <Image
            source={require('../assets/images/pledgr-light.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Pledgr Logo"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#052f4a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: 8,
  }
});