import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Audio } from 'expo-av';

export type PostType = 'text' | 'video' | 'audio' | 'poll' | 'image' | 'link' | 'livestream';

export type PollOption = {
  id: string;
  text: string;
  votes: number;
  voted: boolean;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endTime?: string;
  hasVoted: boolean;
  selectionType: 'single' | 'multiple';
};

export type Attachment = {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  name: string;
  size?: string;
  thumbnail?: string;
};

export type PostCardProps = {
  post: {
    id: string;
    type: PostType;
    creator: {
      name: string;
      avatar: string;
      verified?: boolean;
    };
    time: string;
    title: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    isLocked?: boolean;
    attachments?: Attachment[];
    images?: string[];
    videoUrl?: string;
    audioUrl?: string;
    duration?: string;
    poll?: Poll;
  };
  // Interaction handlers
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: () => void;
  onUnlock?: (postId: string) => void;
  onShowAttachments?: (postId: string) => void;
  onVideoPress?: (videoUrl: string) => void;
  onAudioPress?: (post: any) => void;
  onVote?: (pollId: string, optionId: string) => void;
  onMenuPress?: (event: any, post: any) => void;
  // State
  isLiked?: boolean;
  isPlaying?: boolean;
  audioProgress?: number;
  audioError?: string | null;
  currentAudioId?: string;
  isExpanded?: boolean;
  onToggleExpand?: (postId: string) => void;
  isUnlocked?: boolean;
  showComments?: boolean;
};

function getYoutubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function formatCount(count: number) {
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
}

export const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onUnlock,
  onShowAttachments,
  onVideoPress,
  onAudioPress,
  onVote,
  onMenuPress,
  isLiked,
  isPlaying,
  audioProgress = 0,
  audioError,
  currentAudioId,
  isExpanded,
  onToggleExpand,
  isUnlocked,
  showComments,
}: PostCardProps) => {
  const { colors, fonts, fontSize } = useTheme();
  const [localExpanded, setLocalExpanded] = React.useState(false);
  const isTextPost = post.type === 'text';
  const charLimit = 180;
  const shouldTruncate = isTextPost && post.content.length > charLimit;
  const expanded = typeof isExpanded === 'boolean' ? isExpanded : localExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) onToggleExpand(post.id);
    else setLocalExpanded((prev) => !prev);
  };

  const renderLockedContent = (content: React.ReactNode) => {
    if (!post.isLocked || isUnlocked) return content;
    
    return (
      <View style={{ position: 'relative' }}>
        <View style={{ opacity: 0.5, filter: 'blur(8px)' }}>
          {content}
        </View>
        <View style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center', 
          alignItems: 'center',
          borderRadius: 12 
        }}>
          <Feather name="lock" size={32} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 8 }}>Locked Content</Text>
          <TouchableOpacity 
            style={{ 
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              marginTop: 16 
            }}
            onPress={() => onUnlock?.(post.id)}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Unlock Content</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (post.type) {
      case 'text': {
        const displayContent = !shouldTruncate || expanded
          ? post.content
          : post.content.slice(0, charLimit) + '...';
        return (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, lineHeight: 24 }}>{displayContent}</Text>
            {shouldTruncate && (
              <TouchableOpacity
                onPress={handleToggleExpand}
                style={{ marginTop: 4 }}
              >
                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                  {expanded ? 'Show less' : 'Show more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }
      case 'audio':
        const isCurrentAudio = currentAudioId === post.id;
        return (
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Feather name="music" size={24} color={colors.primary} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>{post.title}</Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>{post.duration}</Text>
                {audioError && isCurrentAudio && (
                  <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>{audioError}</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
                onPress={() => onAudioPress?.(post)}
              >
                <Feather 
                  name={isCurrentAudio && isPlaying ? "pause" : "play"} 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>
              <View style={{ flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' }}>
                <View style={{ height: '100%', backgroundColor: colors.primary, borderRadius: 2, width: `${audioProgress * 100}%` }} />
              </View>
            </View>
          </View>
        );
      case 'image':
        return (
          <View style={{ marginBottom: 16 }}>
            {post.images?.length === 1 ? (
              <Image 
                source={{ uri: post.images[0] }} 
                style={{ width: '100%', height: 300, borderRadius: 12 }} 
                resizeMode="cover"
              />
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                style={{ marginHorizontal: -20 }}
                contentOffset={{ x: 20, y: 0 }}
              >
                <View style={{ width: 20 }} />
                {post.images?.map((imageUrl, index) => (
                  <Image 
                    key={index}
                    source={{ uri: imageUrl }} 
                    style={{ width: 280, height: 280, borderRadius: 12 }} 
                    resizeMode="cover"
                  />
                ))}
                <View style={{ width: 20 }} />
              </ScrollView>
            )}
          </View>
        );
      case 'video':
        const videoId = post.videoUrl ? getYoutubeVideoId(post.videoUrl) : null;
        if (!videoId) return null;
        return (
          <TouchableOpacity 
            style={{ 
              width: '100%',
              height: 200,
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 18,
              backgroundColor: '#000',
              position: 'relative',
            }} 
            onPress={() => onVideoPress?.(post.videoUrl!)}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: getYoutubeThumbnail(videoId) }} 
              style={{ width: '100%', height: '100%', position: 'absolute' }} 
              resizeMode="cover" 
            />
            <View style={{ 
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{ 
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ scale: 1.1 }]
              }}>
                <Feather name="play" size={48} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'poll':
        if (!post.poll) return null;
        const { options, totalVotes, selectionType } = post.poll;
        return (
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 16 }}>
              {selectionType === 'single' ? 'Select one option' : 'Select multiple options'}
            </Text>
            <View style={{ gap: 12 }}>
              {options.map((option) => {
                const percentage = totalVotes > 0 
                  ? (option.votes / totalVotes) * 100 
                  : 0;
                
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={{
                      borderRadius: 8,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: option.voted ? colors.primary : colors.border,
                      backgroundColor: option.voted ? `${colors.primary}10` : '#fff',
                    }}
                    onPress={() => onVote?.(post.poll!.id, option.id)}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: option.voted ? colors.primary : colors.border,
                          backgroundColor: option.voted ? colors.primary : 'transparent',
                          marginRight: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          {option.voted && (
                            <Feather 
                              name={post.poll!.selectionType === 'single' ? 'check' : 'check-square'} 
                              size={16} 
                              color="#fff" 
                            />
                          )}
                        </View>
                        <Text style={{ fontSize: 15, color: colors.textPrimary, fontWeight: '500' }}>{option.text}</Text>
                      </View>
                      <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                        {option.votes} votes ({percentage.toFixed(1)}%)
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 12, textAlign: 'center' }}>
              {totalVotes} total votes
              {post.poll.endTime && ` • Ends ${new Date(post.poll.endTime).toLocaleDateString()}`}
            </Text>
          </View>
        );
      default:
        return (
          <Text style={{ color: colors.textPrimary, fontSize: 16, marginBottom: 8, lineHeight: 24 }}>{post.content}</Text>
        );
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 16, marginBottom: 4 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Image source={{ uri: post.creator.avatar }} style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }} />
        <View style={{ flexShrink: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: colors.textPrimary }}>{post.creator.name}</Text>
            {post.isLocked && (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 }}>
                <Feather name="lock" size={12} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>Locked</Text>
              </View>
            )}
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{post.time}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={(event) => onMenuPress?.(event, post)}>
          <Feather name="more-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.textPrimary, marginBottom: 4, marginLeft: 56 }}>{post.title}</Text>

      {/* Content */}
      <View style={{ marginLeft: 56 }}>
        {renderLockedContent(renderContent())}
      </View>

      {/* Attachments Button */}
      {post.attachments && post.attachments.length > 0 && (
        <TouchableOpacity
          style={{ alignSelf: 'flex-start', backgroundColor: '#F1F5F9', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginLeft: 56, marginBottom: 8 }}
          onPress={() => onShowAttachments?.(post.id)}
        >
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Show Attachments ({post.attachments.length})</Text>
        </TouchableOpacity>
      )}

      {/* Footer */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 4, gap: 24, marginLeft: 56 }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}
          onPress={() => onLike?.(post.id)}
        >
          <Feather 
            name="heart" 
            size={20} 
            color={isLiked ? "#EF4444" : colors.textSecondary} 
            style={{ opacity: isLiked ? 1 : 0.5, transform: [{ scale: isLiked ? 1.1 : 1 }] }} 
          />
          <Text style={{ marginLeft: 6, color: colors.textSecondary, fontSize: 15, fontWeight: '500' }}>
            {formatCount(post.likes)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}
          onPress={() => onComment?.(post.id)}
        >
          <Feather name="message-circle" size={20} color={colors.textSecondary} style={{ opacity: 0.5 }} />
          <Text style={{ marginLeft: 6, color: colors.textSecondary, fontSize: 15, fontWeight: '500' }}>
            {formatCount(post.comments)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}
          onPress={onShare}
        >
          <Feather name="share-2" size={20} color={colors.textSecondary} style={{ opacity: 0.5 }} />
          <Text style={{ marginLeft: 6, color: colors.textSecondary, fontSize: 15, fontWeight: '500' }}>
            {formatCount(post.shares)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments UI (shows when showComments is true) */}
      {showComments && (
        <View style={{ marginLeft: 56, marginTop: 12 }}>
          <Text style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
            Comments would appear here.
          </Text>
          <TextInput
            placeholder="Write a comment..."
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 8,
              marginTop: 8,
              color: colors.textPrimary,
            }}
          />
        </View>
      )}
    </View>
  );
}; 