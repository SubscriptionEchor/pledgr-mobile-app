import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Link2, Download, Instagram, Twitter, Facebook, GitBranch as BrandTiktok, Share2, QrCode } from 'lucide-react-native';
import { showToast } from '@/components/Toast';
import { LinearGradient } from 'expo-linear-gradient';

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
        <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800' }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            />
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
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Link2 size={24} color={colors.primary} />
              </View>
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
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Download size={24} color={colors.primary} />
              </View>
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

            <TouchableOpacity
              style={[styles.quickShareOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('System')}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Share2 size={24} color={colors.primary} />
              </View>
              <Text style={[
                styles.quickShareText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Share
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickShareOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('QR')}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <QrCode size={24} color={colors.primary} />
              </View>
              <Text style={[
                styles.quickShareText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                QR Code
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
              <View style={[styles.socialIconContainer, { backgroundColor: '#E1306C15' }]}>
                <Instagram size={32} color="#E1306C" />
              </View>
              <Text style={[
                styles.socialText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Instagram Story
              </Text>
              <Text style={[
                styles.socialDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Share to your Instagram story
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('X')}>
              <View style={[styles.socialIconContainer, { backgroundColor: '#00000015' }]}>
                <Twitter size={32} color="#000000" />
              </View>
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
              <Text style={[
                styles.socialDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Post to your X feed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('Facebook')}>
              <View style={[styles.socialIconContainer, { backgroundColor: '#1877F215' }]}>
                <Facebook size={32} color="#1877F2" />
              </View>
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
              <Text style={[
                styles.socialDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Share with your Facebook friends
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialOption, { backgroundColor: colors.surface }]}
              onPress={() => handleShare('TikTok')}>
              <View style={[styles.socialIconContainer, { backgroundColor: '#00000015' }]}>
                <BrandTiktok size={32} color="#000000" />
              </View>
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
              <Text style={[
                styles.socialDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Share with your TikTok followers
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
    padding: 20,
    gap: 32,
  },
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  pageName: {
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
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
    flexWrap: 'wrap',
    gap: 12,
  },
  quickShareOption: {
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  socialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    flex: 1,
  },
  socialDescription: {
    flex: 2,
  },
});