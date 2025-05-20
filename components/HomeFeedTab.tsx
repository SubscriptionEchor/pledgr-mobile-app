import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CreatorSteps } from '@/app/components/CreatorSteps';
import { PostCard } from '@/components/PostCard';
import { Rocket, FileText, User, Lock, Gift } from 'lucide-react-native';

// Define post preview component since it might not be exported from PostCard
const PostPreview = ({ post, onShare }: { post: any, onShare: () => void }) => {
  const { colors, fonts, fontSize } = useTheme();
  
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Image 
          source={{ uri: post.creator.avatar }} 
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary }}>
            {post.creator.name}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary }}>
            {post.time}
          </Text>
        </View>
      </View>
      <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary, marginBottom: 8 }}>
        {post.title}
      </Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 16 }}>
        {post.content}
      </Text>
      <View style={{ 
        backgroundColor: '#eee', 
        height: 200, 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        <Text style={{ fontFamily: fonts.medium, color: colors.textSecondary }}>Video Preview</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 16, color: colors.textSecondary }}>♥ {post.likes}</Text>
          <Text style={{ marginRight: 16, color: colors.textSecondary }}>💬 {post.comments}</Text>
        </View>
        <TouchableOpacity onPress={onShare}>
          <Text style={{ color: colors.primary }}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Define proper Post type that includes attachments
export interface Post {
  id: string;
  type: 'text' | 'video' | 'audio' | 'poll' | 'image' | 'link' | 'livestream';
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
  membership?: string;
  attachments?: Array<{
    id: string;
    type: 'image' | 'video' | 'document' | 'audio';
    url: string;
    name: string;
  }>;
}

interface HomeFeedTabProps {
  stepCompleted: boolean[];
  onStepComplete: (idx: number) => void;
  published: boolean;
  posts: Post[];
  likedPosts: Record<string, boolean>;
  showComments: Record<string, boolean>;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  handleLike: (postId: string) => void;
  handleCommentPress: (postId: string) => void;
  setShowFilterSheet: (show: boolean) => void;
  setShowAttachmentsForPost: (postId: string | null) => void;
  setCurrentModalPost: (post: any | null) => void;
  setShowMenu: (menu: { visible: boolean; x: number; y: number } | null) => void;
  filteredPosts: Post[];
  selectedPostType: string;
  selectedPostCategory: string;
  selectedTimePeriod: string;
  selectedSortOrder: string;
  setSelectedPostType: (type: string) => void;
  setSelectedPostCategory: (category: string) => void;
  setSelectedTimePeriod: (period: string) => void;
  setSelectedSortOrder: (order: string) => void;
}

export const HomeFeedTab: React.FC<HomeFeedTabProps> = ({
  stepCompleted,
  onStepComplete,
  published,
  posts,
  likedPosts,
  showComments,
  showShareModal,
  setShowShareModal,
  handleLike,
  handleCommentPress,
  setShowFilterSheet,
  setShowAttachmentsForPost,
  setCurrentModalPost,
  setShowMenu,
  filteredPosts,
  selectedPostType,
  selectedPostCategory,
  selectedTimePeriod,
  selectedSortOrder,
  setSelectedPostType,
  setSelectedPostCategory,
  setSelectedTimePeriod,
  setSelectedSortOrder,
}) => {
  const { colors, fonts, fontSize } = useTheme();

  // Render posts without using FlatList to avoid nested VirtualizedList warning
  const renderPosts = () => {
    if (!stepCompleted.every(Boolean)) {
      return null;
    }

    return filteredPosts.map(item => (
      <View key={item.id} style={{ backgroundColor: '#e5e5e5' }}>
        <View style={{ backgroundColor: '#ffffff', marginBottom: 8 }}>
          <PostCard
            post={item}
            onLike={handleLike}
            onComment={handleCommentPress}
            onShare={() => setShowShareModal(true)}
            onMenuPress={(event, post) => {
              const { pageY } = event.nativeEvent;
              setCurrentModalPost(post);
              setShowMenu({ visible: true, x: 0, y: pageY });
            }}
            isLiked={likedPosts[item.id]}
            showComments={showComments[item.id]}
            {...(item.attachments ? { onShowAttachments: setShowAttachmentsForPost } : {})}
          />
        </View>
        {showComments[item.id] && (
          <View style={{ marginLeft: 56, marginTop: 12, backgroundColor: '#ffffff', paddingBottom: 16, paddingHorizontal: 16 }}>
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
    ));
  };

  // Render empty state when no posts match filters
  const renderEmptyState = () => {
    if (!stepCompleted.every(Boolean) || filteredPosts.length > 0) {
      return null;
    }

    return (
      <View style={{ padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e5e5' }}>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.medium, fontSize: fontSize.lg }}>
          No posts found matching your filters.
        </Text>
      </View>
    );
  };

  return (
    <View>
      {!stepCompleted[2] && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>
            Your page is not yet published
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: 6,
              minHeight: 44,
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => onStepComplete(2)}
            activeOpacity={0.8}
          >
            <Rocket size={16} color={colors.buttonText} style={{ marginRight: 7 }} />
            <Text style={{ color: colors.buttonText, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
              Publish page
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* First Main Section - White Background */}
      <View style={{ backgroundColor: '#ffffff' }}>
        {!stepCompleted.every(Boolean) ? (
          <View style={{ paddingHorizontal: 20, marginTop: 12, paddingBottom: 32 }}>
            <CreatorSteps
              stepCompleted={stepCompleted}
              onStepComplete={onStepComplete}
            />
          </View>
        ) : (
          <>
            {/* Overview Section */}
            <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>Overview</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 20, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 8 }}>Monthly revenue</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 12 }}>$0.00</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>Total members</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary, marginBottom: 8 }}>26</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>Paid members</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary }}>12</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 20, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 8 }}>Revenue ($) - 30d</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 12 }}>$0.00</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>Total sales</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary, marginBottom: 8 }}>0</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>Products</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary }}>0</Text>
                </View>
              </View>
            </View>

            {/* Last Activity Section */}
            <View style={{ paddingHorizontal: 20, marginTop: 28, marginBottom: 28 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 14 }}>
                Last activity on your posts
              </Text>
              
              {/* Activity Stats */}
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>Comments</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>450</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>Likes</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>3.2K</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>Impressions</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>12.5K</Text>
                </View>
              </View>

              {/* Post Preview */}
              <View>
                <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.lg, color: colors.textPrimary, marginBottom: 12 }}>
                  Post preview
                </Text>
                <View style={{ backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden' }}>
                  <PostPreview 
                    post={{
                      id: 'recent1',
                      type: 'video',
                      creator: {
                        name: 'Dance Studio',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        verified: true,
                      },
                      time: '2 hours ago',
                      title: 'Dance Tutorial',
                      content: 'Learn these amazing dance moves!',
                      videoUrl: 'https://youtu.be/d4bTkiftBOk?si=fn9FBiweol8mGfHK',
                      likes: 3200,
                      comments: 800,
                      shares: 400,
                    }}
                    onShare={() => setShowShareModal(true)}
                  />
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Second Main Section - White Background for Recent Activity */}
      {stepCompleted.every(Boolean) && (
        <View style={{ backgroundColor: '#ffffff' }}>
          <View style={{ 
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View>
              <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>
                Recent Activity
              </Text>
              {/* Applied filter badges */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8, width: '100%' }}>
                {selectedPostType !== 'All' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4, flexShrink: 1, maxWidth: '90%' }}>
                    <Text style={{ color: '#181919', fontSize: fontSize.sm, marginRight: 4 }}>{selectedPostType}</Text>
                    <TouchableOpacity onPress={() => setSelectedPostType('All')} hitSlop={8}>
                      <Text style={{ fontSize: fontSize.md, color: "#64748B" }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {selectedPostCategory !== 'All posts' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4, flexShrink: 1, maxWidth: '90%' }}>
                    <Text style={{ color: '#181919', fontSize: fontSize.sm, marginRight: 4 }}>{selectedPostCategory}</Text>
                    <TouchableOpacity onPress={() => setSelectedPostCategory('All posts')} hitSlop={8}>
                      <Text style={{ fontSize: fontSize.md, color: "#64748B" }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {selectedTimePeriod !== 'All time' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4, flexShrink: 1, maxWidth: '90%' }}>
                    <Text style={{ color: '#181919', fontSize: fontSize.sm, marginRight: 4 }}>{selectedTimePeriod}</Text>
                    <TouchableOpacity onPress={() => setSelectedTimePeriod('All time')} hitSlop={8}>
                      <Text style={{ fontSize: fontSize.md, color: "#64748B" }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {selectedSortOrder !== 'Newest to oldest' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4, flexShrink: 1, maxWidth: '90%' }}>
                    <Text style={{ color: '#181919', fontSize: fontSize.sm, marginRight: 4 }}>{selectedSortOrder}</Text>
                    <TouchableOpacity onPress={() => setSelectedSortOrder('Newest to oldest')} hitSlop={8}>
                      <Text style={{ fontSize: fontSize.md, color: "#64748B" }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowFilterSheet(true)} style={{ padding: 6 }}>
              <Text style={{ color: colors.primary, fontFamily: fonts.medium, fontSize: fontSize.md }}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Render posts directly without FlatList */}
      <View style={{ backgroundColor: '#e5e5e5' }}>
        {renderPosts()}
        {renderEmptyState()}
      </View>
    </View>
  );
}; 