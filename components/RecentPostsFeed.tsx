import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { PostCard, PostCardProps } from './PostCard';

type RecentPostsFeedProps = {
  posts: PostCardProps['post'][];
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: () => void;
  onUnlock?: (postId: string) => void;
  onShowAttachments?: (postId: string) => void;
  onVideoPress?: (videoUrl: string) => void;
  onAudioPress?: (post: any) => void;
  onVote?: (pollId: string, optionId: string) => void;
  onMenuPress?: (event: any, post: any) => void;
  likedPosts?: Record<string, boolean>;
  currentAudioId?: string;
  isPlaying?: boolean;
  audioProgress?: number;
  audioError?: string | null;
  expandedPosts?: Record<string, boolean>;
  unlockedPosts?: Record<string, boolean>;
  showComments?: Record<string, boolean>;
  ListHeaderComponent?: React.ReactElement | null;
};

export function RecentPostsFeed({
  posts,
  onLike,
  onComment,
  onShare,
  onUnlock,
  onShowAttachments,
  onVideoPress,
  onAudioPress,
  onVote,
  onMenuPress,
  likedPosts = {},
  currentAudioId,
  isPlaying,
  audioProgress,
  audioError,
  expandedPosts = {},
  unlockedPosts = {},
  showComments = {},
  ListHeaderComponent,
}: RecentPostsFeedProps) {
  const [localExpandedPosts, setLocalExpandedPosts] = useState<Record<string, boolean>>({});

  const handleToggleExpand = (postId: string) => {
    setLocalExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <FlatList
      data={posts}
      ListHeaderComponent={ListHeaderComponent}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onUnlock={onUnlock}
          onShowAttachments={onShowAttachments}
          onVideoPress={onVideoPress}
          onAudioPress={onAudioPress}
          onVote={onVote}
          onMenuPress={onMenuPress}
          isLiked={likedPosts[item.id]}
          isPlaying={isPlaying && currentAudioId === item.id}
          audioProgress={currentAudioId === item.id ? audioProgress : 0}
          audioError={currentAudioId === item.id ? audioError : null}
          currentAudioId={currentAudioId}
          isExpanded={expandedPosts[item.id] || localExpandedPosts[item.id]}
          onToggleExpand={handleToggleExpand}
          isUnlocked={unlockedPosts[item.id]}
          showComments={showComments[item.id]}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
} 