import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function SplashScreen() {
  const { checkAuth } = useAuth();
  const { fonts } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

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

    const initializeApp = async () => {
      // Wait for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check authentication status
      await checkAuth();
    };

    initializeApp();

    // Cleanup animation on unmount
    return () => {
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
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#1e88e5',
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