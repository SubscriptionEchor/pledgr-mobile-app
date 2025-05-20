import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Instagram, Youtube, Twitter, Facebook, Link as LinkIcon, FileText, User, Lock, Gift, Edit2, Check } from 'lucide-react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import * as WebBrowser from 'expo-web-browser';

export const AboutTab: React.FC = () => {
  const { colors, fonts, fontSize } = useTheme();
  const [playingVideo, setPlayingVideo] = useState(false);
  const videoId = 'BNEmDcQr6hk';
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState(
    "Award-winning digital artist & creator with over 10 years of professional experience in contemporary dance. I specialize in creating compelling dance performances and tutorials that blend traditional techniques with modern innovation.\n\nMy mission is to make dance accessible to everyone, from beginners to professionals. Through my tutorials, live performances, and behind-the-scenes content, I aim to inspire and educate dance enthusiasts worldwide.\n\nJoin me on this creative journey as I share my passion for dance, movement, and artistic expression."
  );
  
  const openYoutubeVideo = async () => {
    await WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${videoId}`);
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Intro Video Section */}
        <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
          Introduction
        </Text>
        
        {/* YouTube Video Embed */}
        <View style={{ width: '100%', aspectRatio: 16/9, backgroundColor: '#eee', borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          {playingVideo ? (
            <YoutubeIframe
              height="100%"
              width="100%"
              videoId={videoId}
              play={true}
              onChangeState={(state: string) => {
                if (state === 'ended') {
                  setPlayingVideo(false);
                }
              }}
            />
          ) : (
            <TouchableOpacity 
              style={{ width: '100%', height: '100%' }}
              onPress={() => setPlayingVideo(true)}
              // Alternative approach: uncomment the line below to open in browser instead
              // onPress={openYoutubeVideo}
            >
              <Image
                source={{ uri: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              {/* Play button overlay */}
              <View style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)'
              }}>
                <View style={{
                  width: 70,
                  height: 70,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderLeftWidth: 20,
                    borderTopWidth: 12,
                    borderBottomWidth: 12,
                    borderLeftColor: colors.primary,
                    borderTopColor: 'transparent',
                    borderBottomColor: 'transparent',
                    marginLeft: 5
                  }} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Description Section with Edit */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>
            About Me
          </Text>
          <TouchableOpacity 
            onPress={() => {
              if (isEditingAbout) {
                // Save functionality could be added here
                setIsEditingAbout(false);
              } else {
                setIsEditingAbout(true);
              }
            }}
            style={{ 
              width: 36,
              height: 36,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isEditingAbout ? '#e6f7ef' : '#f1f5f9',
              borderRadius: 6
            }}
          >
            {isEditingAbout ? (
              <Check size={18} color={colors.success} />
            ) : (
              <Edit2 size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        
        {isEditingAbout ? (
          <TextInput
            style={{ 
              fontFamily: fonts.regular, 
              fontSize: fontSize.md, 
              color: colors.textPrimary, 
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 16,
              minHeight: 200,
              textAlignVertical: 'top',
              marginBottom: 24,
              lineHeight: 24,
              borderWidth: 1,
              borderColor: colors.border
            }}
            multiline
            value={aboutText}
            onChangeText={setAboutText}
          />
        ) : (
          <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 24, lineHeight: 24 }}>
            {aboutText}
          </Text>
        )}
        
        {/* Social Links Section */}
        <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
          Connect With Me
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, gap: 12 }}>
          {[
            { Icon: Instagram, label: 'Instagram', url: 'https://instagram.com/dancestudio' },
            { Icon: Youtube, label: 'YouTube', url: 'https://youtube.com/dancestudio' },
            { Icon: Twitter, label: 'Twitter', url: 'https://twitter.com/dancestudio' },
            { Icon: Facebook, label: 'Facebook', url: 'https://facebook.com/dancestudio' },
            { Icon: LinkIcon, label: 'Website', url: 'https://dancestudio.com' }
          ].map((item, idx) => (
            <TouchableOpacity 
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => {
                // Handle opening social link
                console.log(`Opening ${item.url}`);
              }}
            >
              <item.Icon size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
              <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Stats Section */}
        <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
          Stats
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Posts', value: '215', icon: FileText },
            { label: 'Total Members', value: '523', icon: User },
            { label: 'Paid Members', value: '128', icon: Lock },
            { label: 'Monthly Revenue', value: '$2,840', icon: Gift }
          ].map((item, idx) => (
            <View 
              key={idx}
              style={{ 
                flex: 1, 
                minWidth: '45%', 
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <item.icon size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary }}>
                  {item.label}
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}; 