import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';

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

type RecentPostsFeedProps = {
  posts: Post[];
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: () => void;
  onMenuPress?: (event: any, post: Post) => void;
  likedPosts?: Record<string, boolean>;
  showComments?: Record<string, boolean>;
  ListHeaderComponent?: React.ReactElement | null;
};

function formatCount(count: number) {
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
}

function getYoutubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function RecentPostsFeed({
  posts,
  onLike,
  onComment,
  onShare,
  onMenuPress,
  likedPosts = {},
  showComments = {},
  ListHeaderComponent,
}: RecentPostsFeedProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  const renderContent = (item: Post) => {
    switch (item.type) {
      case 'text': {
        const charLimit = 180;
        const isExpanded = expandedPosts[item.id];
        const shouldTruncate = item.content.length > charLimit;
        const displayContent = !shouldTruncate || isExpanded
          ? item.content
          : item.content.slice(0, charLimit) + '...';
        return (
          <View style={styles.textContent}>
            <Text style={[styles.content, { color: colors.textPrimary }]}>{displayContent}</Text>
            {shouldTruncate && (
              <TouchableOpacity
                onPress={() => setExpandedPosts(prev => ({ ...prev, [item.id]: !isExpanded }))}
                style={{ marginTop: 4 }}
              >
                <Text style={{ color: '#3B82F6', fontWeight: '600' }}>
                  {isExpanded ? 'Show less' : 'Show more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }
      case 'video': {
        if (!item.videoUrl) return null;
        const videoId = getYoutubeVideoId(item.videoUrl);
        if (!videoId) return null;
        return (
          <TouchableOpacity 
            style={styles.videoContainer} 
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: getYoutubeThumbnail(videoId) }} 
              style={styles.videoThumbnail} 
              resizeMode="cover" 
            />
            <View style={styles.playOverlay}>
              <View style={styles.modernPlayButton}>
                <Feather name="play" size={48} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        );
      }
      default:
        return (
          <Text style={[styles.content, { color: colors.textPrimary }]}>{item.content}</Text>
        );
    }
  };

  return (
    <FlatList
      data={posts}
      ListHeaderComponent={ListHeaderComponent}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        const isLiked = likedPosts[item.id];
        const isCommentsVisible = showComments[item.id];

        return (
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Image source={{ uri: item.creator.avatar }} style={styles.avatar} />
              <View style={styles.headerTextGroup}>
                <View style={styles.headerNameRow}>
                  <Text style={[styles.creatorName, { color: colors.textPrimary }]}>
                    {item.creator.name}
                  </Text>
                </View>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {item.time}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={(event) => onMenuPress?.(event, item)}
                style={{ padding: 4 }}
              >
                <Feather name="more-vertical" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.textPrimary, marginLeft: 56 }]}>
              {item.title}
            </Text>

            {/* Content */}
            <View style={{ marginLeft: 56 }}>
              {renderContent(item)}
            </View>

            {/* Footer */}
            <View style={[styles.footerRow, { marginLeft: 56 }]}>
              <TouchableOpacity 
                style={styles.footerItem} 
                onPress={() => onLike?.(item.id)}
              >
                <Feather 
                  name="heart" 
                  size={20} 
                  color={isLiked ? "#EF4444" : "#52525B"} 
                  style={[
                    styles.heartIcon,
                    isLiked && styles.likedIcon
                  ]}
                />
                <Text style={styles.footerText}>
                  {formatCount(item.likes)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.footerItem}
                onPress={() => onComment?.(item.id)}
              >
                <Feather name="message-circle" size={20} color="#52525B" />
                <Text style={styles.footerText}>{formatCount(item.comments)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerItem}
                onPress={onShare}
              >
                <Feather name="share-2" size={20} color="#52525B" />
                <Text style={styles.footerText}>{formatCount(item.shares)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.feedContainer}
    />
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 32,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  creatorName: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  timeText: {
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  textContent: {
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  modernPlayButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    gap: 24,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  footerText: {
    marginLeft: 6,
    color: '#52525B',
    fontSize: 15,
    fontWeight: '500',
  },
  heartIcon: {
    opacity: 0.5
  },
  likedIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }]
  },
}); 