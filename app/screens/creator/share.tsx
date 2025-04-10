import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Link2, Download, Instagram, Twitter, Facebook, Music2 as BrandTiktok } from 'lucide-react-native';
import { showToast } from '@/components/Toast';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ShareScreen() {
  const { colors, fonts, fontSize } = useTheme();

  const handleCopyLink = () => {
    showToast.success('Link copied', 'Page link has been copied to clipboard');
  };

  const handleDownload = () => {
    showToast.success('Download started', 'Image download has started');
  };

  const handleShare = (platform: string) => {
    showToast.success('Opening share', `Opening share on ${platform}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Share" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.coverCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.coverSection, { height: SCREEN_HEIGHT * 0.25 }]}>
            <LinearGradient
              colors={['#4338ca', '#6366f1']}
              style={styles.coverGradient}
            />
            <View style={styles.coverContent}>
              <View style={styles.coverProfile}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400' }}
                  style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={[
                    styles.pageName,
                    {
                      color: '#fff',
                      fontFamily: fonts.bold,
                      fontSize: fontSize['2xl'],
                      includeFontPadding: false
                    }
                  ]}>
                    Solo Levelling
                  </Text>
                  <Text style={[
                    styles.profileDescription,
                    {
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    Only I Level Up is a South Korean portal fantasy web novel
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
              includeFontPadding: false
            }
          ]}>
            Quick Share
          </Text>

          <View style={styles.quickShareGrid}>
            <TouchableOpacity
              style={[styles.quickShareOption, { backgroundColor: colors.surface }]}
              onPress={handleCopyLink}>
              <Link2 size={24} color={colors.textPrimary} />
              <Text style={[
                styles.quickShareText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Copy Link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickShareOption, { backgroundColor: colors.surface }]}
              onPress={handleDownload}>
              <Download size={24} color={colors.textPrimary} />
              <Text style={[
                styles.quickShareText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Download
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
              includeFontPadding: false
            }
          ]}>
            Share on Social Media
          </Text>

          <View style={styles.socialGrid}>
            <TouchableOpacity
              style={[styles.socialOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('Instagram')}>
              <Instagram size={32} color={colors.textPrimary} />
              <Text style={[
                styles.socialText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Share on Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('X')}>
              <Twitter size={32} color={colors.textPrimary} />
              <Text style={[
                styles.socialText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Share on X
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('Facebook')}>
              <Facebook size={32} color={colors.textPrimary} />
              <Text style={[
                styles.socialText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Share on Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('TikTok')}>
              <BrandTiktok size={32} color={colors.textPrimary} />
              <Text style={[
                styles.socialText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Share on TikTok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    gap: 32,
    padding: 20,
  },
  coverCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  coverSection: {
    position: 'relative',
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coverContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  coverProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  pageName: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileDescription: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  quickShareGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickShareOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  quickShareText: {
    textAlign: 'center',
  },
  socialGrid: {
    gap: 12,
  },
  socialOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  socialText: {
    flex: 1,
  },
});