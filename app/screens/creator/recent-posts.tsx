import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useRouter } from 'expo-router';
import { FileText, Globe, Clock, MoveVertical as MoreVertical, ThumbsUp, MessageCircle, Video, Crown, CircleUser as UserCircle } from 'lucide-react-native';
import { useState } from 'react';
import { DeletePostModal } from '@/components/DeletePostModal';
import { showToast } from '@/components/Toast';

interface Post {
    id: string;
    title: string;
    type: 'text' | 'video';
    visibility: 'public' | 'paid_only' | 'all_members';
    date: string;
    image: string;
    stats: {
        views: number;
        likes: number;
        comments: number;
    };
}

const RECENT_POSTS: Post[] = [
    {
        id: '1',
        title: 'Getting Started with Web Development',
        type: 'text',
        visibility: 'public',
        date: '3/25/2024',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        stats: {
            views: 1200,
            likes: 45,
            comments: 12
        }
    },
    {
        id: '2',
        title: 'Understanding React Hooks',
        type: 'video',
        visibility: 'paid_only',
        date: '3/24/2024',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        stats: {
            views: 800,
            likes: 32,
            comments: 8
        }
    },
    {
        id: '3',
        title: 'CSS Grid Layout Guide',
        type: 'text',
        visibility: 'all_members',
        date: '3/17/2024',
        image: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800',
        stats: {
            views: 950,
            likes: 38,
            comments: 15
        }
    },
];

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export default function RecentPostsScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>(RECENT_POSTS);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeletePost = () => {
        if (selectedPost) {
            setPosts(prev => prev.filter(post => post.id !== selectedPost.id));
            showToast.success(
                'Post deleted',
                'The post has been permanently deleted'
            );
        }
        setShowDeleteModal(false);
        setSelectedPost(null);
    };

    const renderPostTypeIcon = (type: Post['type']) => {
        return type === 'text' ? (
            <View style={styles.metaItem}>
                <FileText size={16} color={colors.textSecondary} />
                <Text style={[
                    styles.metaText,
                    {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                    }
                ]}>
                    Text
                </Text>
            </View>
        ) : (
            <View style={styles.metaItem}>
                <Video size={16} color={colors.textSecondary} />
                <Text style={[
                    styles.metaText,
                    {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                    }
                ]}>
                    Video
                </Text>
            </View>
        );
    };

    const renderVisibilityIcon = (visibility: Post['visibility']) => {
        switch (visibility) {
            case 'public':
                return (
                    <View style={styles.metaItem}>
                        <Globe size={16} color={colors.textSecondary} />
                        <Text style={[
                            styles.metaText,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.sm,
                                includeFontPadding: false
                            }
                        ]}>
                            Public
                        </Text>
                    </View>
                );
            case 'paid_only':
                return (
                    <View style={[styles.metaItem, { backgroundColor: `${colors.primary}15`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }]}>
                        <Crown size={16} color={colors.primary} />
                        <Text style={[
                            styles.metaText,
                            {
                                color: colors.primary,
                                fontFamily: fonts.medium,
                                fontSize: fontSize.sm,
                                includeFontPadding: false
                            }
                        ]}>
                            Paid Only
                        </Text>
                    </View>
                );
            case 'all_members':
                return (
                    <View style={styles.metaItem}>
                        <UserCircle size={16} color={colors.textSecondary} />
                        <Text style={[
                            styles.metaText,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.sm,
                                includeFontPadding: false
                            }
                        ]}>
                            All Members
                        </Text>
                    </View>
                );
        }
    };

    const renderPost = (post: Post) => (
        <View
            key={post.id}
            style={[styles.postCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
                onPress={() => router.push(`/screens/creator/post/${post.id}`)}
                style={styles.postLink}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
                <View style={styles.postContent}>
                    <View style={styles.postHeader}>
                        <Text style={[
                            styles.postTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            {post.title}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedPost(post);
                                setShowDeleteModal(true);
                            }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <MoreVertical size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.postMeta}>
                        <View style={styles.postMetaLeft}>
                            {renderPostTypeIcon(post.type)}
                            {renderVisibilityIcon(post.visibility)}
                            <View style={styles.dateContainer}>
                                <Clock size={16} color={colors.textSecondary} />
                                <Text style={[
                                    styles.dateText,
                                    {
                                        color: colors.textSecondary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.sm,
                                        includeFontPadding: false
                                    }
                                ]}>
                                    {post.date}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.postStats}>
                        <Text style={[
                            styles.statText,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.sm,
                                includeFontPadding: false
                            }
                        ]}>
                            {formatNumber(post.stats.views)} views
                        </Text>
                        <View style={styles.statItem}>
                            <ThumbsUp size={16} color={colors.textSecondary} />
                            <Text style={[
                                styles.statText,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                {formatNumber(post.stats.likes)}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <MessageCircle size={16} color={colors.textSecondary} />
                            <Text style={[
                                styles.statText,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false
                                }
                            ]}>
                                {formatNumber(post.stats.comments)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Recent Posts" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <View style={styles.postsList}>
                    {posts.map(renderPost)}
                </View>
            </ScrollView>

            <DeletePostModal
                visible={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedPost(null);
                }}
                onConfirm={handleDeletePost}
                postTitle={selectedPost?.title || ''}
            />
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
    scrollContent: {
        padding: 20,
        gap: 16,
    },
    postsList: {
        gap: 16,
    },
    postCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    postLink: {
        flex: 1,
    },
    postImage: {
        width: '100%',
        height: 200,
    },
    postContent: {
        padding: 16,
        gap: 12,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    postTitle: {
        flex: 1,
        lineHeight: 24,
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    postMetaLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        lineHeight: 20,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        lineHeight: 20,
    },
    postStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        lineHeight: 20,
    },
});