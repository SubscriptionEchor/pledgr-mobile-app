import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { MoreVertical, ThumbsUp, MessageCircle, Share2, ChevronDown, ChevronUp } from 'lucide-react-native';

export type Post = {
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

type PostCardProps = {
    post: Post;
    onLike?: (postId: string) => void;
    onComment?: (postId: string) => void;
    onShare?: () => void;
    onMenuPress?: (event: any, post: Post) => void;
    isLiked?: boolean;
    showComments?: boolean;
    style?: ViewStyle;
};

export function PostCard({
    post,
    onLike,
    onComment,
    onShare,
    onMenuPress,
    isLiked,
    showComments,
    style,
}: PostCardProps) {
    const { colors, fonts, fontSize } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: post.creator.avatar }} style={styles.avatar} />
                <View style={styles.headerInfo}>
                    <Text style={[styles.creatorName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                        {post.creator.name}
                    </Text>
                    <Text style={[styles.timeText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                        {post.time}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={(event) => onMenuPress?.(event, post)}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                    <MoreVertical size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* All content aligned with creator name */}
            <View style={{ paddingLeft: 52, paddingRight: 20 }}>
                {/* Title */}
                <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, paddingHorizontal: 0 }]}>
                    {post.title}
                </Text>

                {/* Content */}
                <View>
                    <Text 
                        style={[styles.content, { color: colors.textSecondary, fontFamily: fonts.regular, paddingHorizontal: 0 }]}
                        numberOfLines={isExpanded ? undefined : 3}
                    >
                        {post.content}
                    </Text>
                    {post.content.length > 150 && (
                        <TouchableOpacity
                            style={[styles.expandButton, { paddingHorizontal: 0 }]}
                            onPress={() => setIsExpanded(!isExpanded)}
                        >
                            <Text style={[styles.expandButtonText, { color: colors.primary, fontFamily: fonts.medium }]}>
                                {isExpanded ? 'Show less' : 'Show more'}
                            </Text>
                            {isExpanded ? (
                                <ChevronUp size={16} color={colors.primary} />
                            ) : (
                                <ChevronDown size={16} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Video Preview if it's a video post */}
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

                {/* Interaction Bar */}
                <View style={[styles.interactionBar, { paddingHorizontal: 0 }]}>
                    <TouchableOpacity
                        style={styles.interactionButton}
                        onPress={() => onLike?.(post.id)}
                    >
                        <ThumbsUp
                            size={20}
                            color={isLiked ? colors.primary : colors.textSecondary}
                            fill={isLiked ? colors.primary : 'none'}
                        />
                        <Text style={[styles.interactionText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                            {post.likes}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.interactionButton}
                        onPress={() => onComment?.(post.id)}
                    >
                        <MessageCircle size={20} color={colors.textSecondary} />
                        <Text style={[styles.interactionText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                            {post.comments}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.interactionButton}
                        onPress={onShare}
                    >
                        <Share2 size={20} color={colors.textSecondary} />
                        <Text style={[styles.interactionText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                            {post.shares}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    creatorName: {
        fontSize: 16,
        marginBottom: 2,
    },
    timeText: {
        fontSize: 14,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
        paddingHorizontal: 20,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    expandButtonText: {
        fontSize: 14,
        marginRight: 4,
    },
    videoContainer: {
        width: '100%',
        height: 200,
        marginBottom: 16,
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
    interactionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    interactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    interactionText: {
        fontSize: 14,
        marginLeft: 6,
    },
}); 