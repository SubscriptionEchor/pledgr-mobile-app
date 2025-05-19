import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Share2 } from 'lucide-react-native';

type Post = {
  id: string;
  type: 'video' | 'image' | 'text' | 'audio' | 'poll';
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  time: string;
  title: string;
  content: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
};

type PostPreviewProps = {
  post: Post;
  onShare?: () => void;
};

export function PostPreview({ post, onShare }: PostPreviewProps) {
  const { colors, fonts, fontSize } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image source={{ uri: post.creator.avatar }} style={styles.avatar} />
        <View style={styles.headerTextGroup}>
          <View style={styles.headerNameRow}>
            <Text style={[styles.creatorName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              {post.creator.name}
            </Text>
          </View>
          <Text style={[styles.timeText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
            {post.time}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onShare}
          style={[styles.shareButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
        >
          <Share2 size={18} color={colors.buttonText} />
          <Text style={[styles.shareText, { color: colors.buttonText, fontFamily: fonts.medium }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
        {post.title}
      </Text>

      {/* Content */}
      <Text style={[styles.content, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
        {post.content}
      </Text>

      {/* Video Thumbnail if it's a video post */}
      {post.type === 'video' && post.videoUrl && (
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: `https://img.youtube.com/vi/${post.videoUrl.split('v=')[1]}/hqdefault.jpg` }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          <View style={[styles.playOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
            <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.playIcon, { color: colors.buttonText }]}>▶</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 16,
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
    marginTop: 2,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  shareText: {
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 24,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
  },
}); 