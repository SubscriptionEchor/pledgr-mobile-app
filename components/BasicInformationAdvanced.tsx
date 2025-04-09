import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { Instagram, Facebook, Twitter, Youtube, Globe } from 'lucide-react-native';
import { SocialPlatforms } from '@/lib/enums';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

export function BasicInformationAdvanced() {
  const { colors, fonts, fontSize } = useTheme();
  const { creatorSettings } = useCreatorSettings();
  
  const [brandColor, setBrandColor] = useState(
    creatorSettings?.campaign_details.campaign_settings.brand_color?.hex_code || colors.primary
  );
  const [about, setAbout] = useState(
    creatorSettings?.campaign_details.campaign_settings.about_page?.description_blob_id || ''
  );
  const [introVideo, setIntroVideo] = useState(
    creatorSettings?.campaign_details.campaign_settings.intro_video?.url || ''
  );
  const [socialLinks, setSocialLinks] = useState<Record<SocialPlatforms, string>>({
    [SocialPlatforms.INSTAGRAM]: creatorSettings?.campaign_details.campaign_settings.social_links?.instagram || '',
    [SocialPlatforms.FACEBOOK]: creatorSettings?.campaign_details.campaign_settings.social_links?.facebook || '',
    [SocialPlatforms.TWITTER]: creatorSettings?.campaign_details.campaign_settings.social_links?.twitter || '',
    [SocialPlatforms.YOUTUBE]: creatorSettings?.campaign_details.campaign_settings.social_links?.youtube || '',
    [SocialPlatforms.WEBSITE]: creatorSettings?.campaign_details.campaign_settings.social_links?.website || '',
  });

  useEffect(() => {
    if (creatorSettings) {
      const settings = creatorSettings.campaign_details.campaign_settings;
      setBrandColor(settings.brand_color?.hex_code || colors.primary);
      setAbout(settings.about_page?.description_blob_id || '');
      setIntroVideo(settings.intro_video?.url || '');
      setSocialLinks({
        [SocialPlatforms.INSTAGRAM]: settings.social_links?.instagram || '',
        [SocialPlatforms.FACEBOOK]: settings.social_links?.facebook || '',
        [SocialPlatforms.TWITTER]: settings.social_links?.twitter || '',
        [SocialPlatforms.YOUTUBE]: settings.social_links?.youtube || '',
        [SocialPlatforms.WEBSITE]: settings.social_links?.website || '',
      });
    }
  }, [creatorSettings, colors.primary]);

  const handleColorSelect = (color: string) => {
    setBrandColor(color);
  };

  const handleSocialLinkChange = (platform: SocialPlatforms, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const getSocialIcon = (platform: SocialPlatforms) => {
    switch (platform) {
      case SocialPlatforms.INSTAGRAM:
        return Instagram;
      case SocialPlatforms.FACEBOOK:
        return Facebook;
      case SocialPlatforms.TWITTER:
        return Twitter;
      case SocialPlatforms.YOUTUBE:
        return Youtube;
      case SocialPlatforms.WEBSITE:
        return Globe;
    }
  };

  const getSocialPlaceholder = (platform: SocialPlatforms) => {
    switch (platform) {
      case SocialPlatforms.INSTAGRAM:
        return 'Instagram username';
      case SocialPlatforms.FACEBOOK:
        return 'Facebook username or page';
      case SocialPlatforms.TWITTER:
        return 'Twitter username';
      case SocialPlatforms.YOUTUBE:
        return 'YouTube channel';
      case SocialPlatforms.WEBSITE:
        return 'Your website URL';
    }
  };

  return (
    <>
      {/* Brand Color Section */}
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
          Custom Brand Color
        </Text>
        <Text style={[
          styles.sectionDescription,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            includeFontPadding: false
          }
        ]}>
          This color will be used for buttons, links, and accents throughout your page
        </Text>
        <View style={[
          styles.colorPreview,
          { backgroundColor: brandColor }
        ]} />
        <View style={styles.colorSection}>
          <Text style={[
            styles.colorCode,
            {
              color: colors.textPrimary,
              fontFamily: fonts.medium,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            {brandColor.toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() => handleColorSelect(colors.primary)}
            style={styles.resetButton}>
            <Text style={[
              styles.resetText,
              {
                color: colors.primary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}>
              Reset to default
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
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
          About Your Page
        </Text>
        <Text style={[
          styles.sectionDescription,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            includeFontPadding: false
          }
        ]}>
          Let visitors know what your page is about
        </Text>
        <TextInput
          value={about}
          onChangeText={setAbout}
          multiline
          style={[
            styles.aboutInput,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}
          placeholder="Write about your page..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Intro Video Section */}
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
          Intro Video
        </Text>
        <Text style={[
          styles.sectionDescription,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            includeFontPadding: false
          }
        ]}>
          This video will be displayed prominently on your page. Choose a video that best represents you and your content.
        </Text>
        <TextInput
          value={introVideo}
          onChangeText={setIntroVideo}
          placeholder="https://youtu.be/XXXXXXXXXXX"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}
        />
      </View>

      {/* Social Links Section */}
      <View style={[
      styles.section,
      {
        borderBottomWidth: 0,
      }
    ]}>
        <Text style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.semibold,
            fontSize: fontSize.md,
            includeFontPadding: false
          }
        ]}>
          Social Links
        </Text>
        <Text style={[
          styles.sectionDescription,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            includeFontPadding: false
          }
        ]}>
          Connect your social media accounts to help fans find you across platforms.
        </Text>
        
        <View style={styles.socialLinks}>
          {Object.values(SocialPlatforms).map((platform) => {
            const Icon = getSocialIcon(platform);
            return (
              <View key={platform} style={styles.socialInputContainer}>
                <View style={[
                  styles.socialIconContainer,
                  { backgroundColor: `${colors.primary}15` }
                ]}>
                  <Icon size={20} color={colors.primary} />
                </View>
                <TextInput
                  value={socialLinks[platform]}
                  onChangeText={(text) => handleSocialLinkChange(platform, text)}
                  placeholder={getSocialPlaceholder(platform)}
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.socialInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.textPrimary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}
                />
              </View>
            );
          })}
        </View>
        <Text style={[
          styles.socialHint,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.xs,
            includeFontPadding: false
          }
        ]}>
          These links will be displayed on your creator page to help fans connect with you across platforms.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    marginBottom: 4,
    fontSize: 14,
  },
  sectionDescription: {
    marginBottom: 8,
    fontSize: 12,
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  colorPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  colorCode: {
    fontSize: 13,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resetText: {
    fontSize: 13,
  },
  aboutInput: {
    height: 120,
    borderRadius: 12,
    padding: 16,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  socialLinks: {
    gap: 12,
  },
  socialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialHint: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  },
});