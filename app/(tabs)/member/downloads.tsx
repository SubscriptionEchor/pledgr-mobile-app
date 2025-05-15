import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Modal, Pressable, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useDownload } from '@/lib/context/DownloadContext';
import { Feather } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { DownloadedItem } from '@/lib/context/DownloadContext';
import { formatDistanceToNow } from 'date-fns';
import { ReportPostModal } from '@/components/ReportPostModal';
import { BlockUserModal } from '@/components/BlockUserModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FilterType = 'all' | 'audio' | 'image';

// Mock data for testing
const MOCK_DOWNLOADS: DownloadedItem[] = [
    {
        id: '1',
        postId: 'post1',
        type: 'image',
        url: 'https://picsum.photos/400/400',
        name: 'Beautiful landscape photography',
        description: 'Captured during sunset at the mountains',
        localUri: 'file://mock1.jpg',
        downloadedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        size: '2.4 MB',
        thumbnail: 'https://picsum.photos/400/400',
        creator: {
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            verified: true
        }
    },
    {
        id: '2',
        postId: 'post1',
        type: 'image',
        url: 'https://picsum.photos/400/401',
        name: 'Nature photography collection',
        description: 'A series of nature shots from my recent trip',
        localUri: 'file://mock2.jpg',
        downloadedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        size: '1.8 MB',
        thumbnail: 'https://picsum.photos/400/401',
        creator: {
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            verified: true
        }
    },
    {
        id: '3',
        postId: 'post2',
        type: 'audio',
        url: 'https://example.com/audio1.mp3',
        name: 'Morning meditation music',
        description: 'Relaxing sounds to start your day',
        localUri: 'file://mock3.mp3',
        downloadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        size: '4.2 MB',
        creator: {
            name: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            verified: false
        }
    }
];

const GRID_SPACING = 4;
const MAX_IMAGES_PER_ROW = 3;

export default function DownloadsScreen() {
    const { colors, fonts, fontSize, isDark } = useTheme();
    const { downloadedItems, removeDownload } = useDownload();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [showMenu, setShowMenu] = useState<{ visible: boolean; postId: string; x: number; y: number } | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Use mock data for testing
    const allItems = [...MOCK_DOWNLOADS, ...downloadedItems];

    // Group downloaded items by postId
    const groupedItems = allItems.reduce((acc, item) => {
        if (!acc[item.postId]) {
            acc[item.postId] = [];
        }
        acc[item.postId].push(item);
        return acc;
    }, {} as Record<string, DownloadedItem[]>);

    const filteredGroups = Object.entries(groupedItems).filter(([_, items]) => {
        if (activeFilter === 'all') return true;
        return items.some(item => item.type === activeFilter);
    });

    const paginatedGroups = filteredGroups.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreItems = paginatedGroups.length < filteredGroups.length;

    const loadMore = useCallback(() => {
        if (hasMoreItems && !isLoadingMore) {
            setIsLoadingMore(true);
            // Simulate network delay
            setTimeout(() => {
                setPage(prev => prev + 1);
                setIsLoadingMore(false);
            }, 1000);
        }
    }, [hasMoreItems, isLoadingMore]);

    const renderFooter = () => {
        if (!hasMoreItems) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    const handleReportSubmit = (reason: string, description?: string) => {
        // TODO: Implement report post functionality
        console.log('Report submitted:', { reason, description, postId: selectedPostId });
        setShowReportModal(false);
        setSelectedPostId(null);
    };

    const handleBlockSubmit = (reason: string, description?: string) => {
        // TODO: Implement block user functionality
        console.log('Block submitted:', { reason, description, postId: selectedPostId });
        setShowBlockModal(false);
        setSelectedPostId(null);
    };

    const handleRemoveDownload = (postId: string) => {
        const items = groupedItems[postId];
        items.forEach(item => removeDownload(item.id));
        setShowMenu(null);
    };

    const renderMenu = () => {
        if (!showMenu) return null;

        return (
            <Modal
                visible={showMenu.visible}
                transparent={true}
                onRequestClose={() => setShowMenu(null)}
                animationType="none"
            >
                <Pressable 
                    style={styles.menuOverlay} 
                    onPress={() => setShowMenu(null)}
                >
                    <View 
                        style={[
                            styles.menuContent,
                            {
                                position: 'absolute',
                                top: showMenu.y,
                                right: 16,
                            }
                        ]}
                    >
                        <TouchableOpacity 
                            style={styles.menuOption} 
                            onPress={() => {
                                setSelectedPostId(showMenu.postId);
                                setShowMenu(null);
                                setShowReportModal(true);
                            }}
                        >
                            <Feather name="flag" size={20} color={colors.textPrimary} />
                            <Text style={[styles.menuOptionText, { color: colors.textPrimary }]}>Report post</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.menuOption} 
                            onPress={() => {
                                setSelectedPostId(showMenu.postId);
                                setShowMenu(null);
                                setShowBlockModal(true);
                            }}
                        >
                            <Feather name="user-x" size={20} color={colors.textPrimary} />
                            <Text style={[styles.menuOptionText, { color: colors.textPrimary }]}>Block creator</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.menuOption, styles.menuOptionDanger]} 
                            onPress={() => {
                                handleRemoveDownload(showMenu.postId);
                            }}
                        >
                            <Feather name="trash-2" size={20} color="#EF4444" />
                            <Text style={[styles.menuOptionText, { color: '#EF4444' }]}>Remove download</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        );
    };

    const renderPost = ({ item: [postId, items] }: { item: [string, DownloadedItem[]] }) => {
        const firstItem = items[0];
        const isImage = items.some(item => item.type === 'image');
        const isAudio = items.some(item => item.type === 'audio');
        const imageItems = items.filter(item => item.type === 'image');
        const audioItems = items.filter(item => item.type === 'audio');

        return (
            <View style={[styles.postContainer, { backgroundColor: colors.surface }]}>
                {/* Creator Section */}
                <View style={styles.creatorSection}>
                    <View style={styles.creatorContainer}>
                        <Image 
                            source={{ uri: firstItem.creator?.avatar || 'https://via.placeholder.com/40' }} 
                            style={styles.creatorAvatar}
                        />
                        <View style={styles.creatorInfo}>
                            <Text 
                                style={[
                                    styles.creatorName,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.medium,
                                        fontSize: fontSize.md,
                                        includeFontPadding: false
                                    }
                                ]}
                            >
                                {firstItem.creator?.name || 'Unknown Creator'}
                            </Text>
                            <Text 
                                style={[
                                    styles.postMeta,
                                    {
                                        color: colors.textSecondary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.sm,
                                        includeFontPadding: false
                                    }
                                ]}
                            >
                                Downloaded {formatDistanceToNow(new Date(firstItem.downloadedAt), { addSuffix: true })}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.menuButton}
                        onPress={(event) => {
                            const { pageY } = event.nativeEvent;
                            setShowMenu({ visible: true, postId, x: 0, y: pageY });
                        }}
                    >
                        <Feather name="more-vertical" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    {/* Title and Description */}
                    <View style={styles.postHeader}>
                        <Text 
                            style={[
                                styles.postTitle,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.medium,
                                    fontSize: fontSize.md,
                                    includeFontPadding: false
                                }
                            ]}
                            numberOfLines={2}
                        >
                            {firstItem.name}
                        </Text>
                        {firstItem.description && (
                            <Text 
                                style={[
                                    styles.postDescription,
                                    {
                                        color: colors.textSecondary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.sm,
                                        includeFontPadding: false
                                    }
                                ]}
                                numberOfLines={2}
                            >
                                {firstItem.description}
                            </Text>
                        )}
                    </View>

                    {/* Assets Grid */}
                    <View style={styles.assetsContainer}>
                        {/* Image Grid */}
                        {imageItems.length > 0 && (
                            <View style={styles.imageGrid}>
                                {imageItems.map((item, index) => {
                                    const isLastInRow = (index + 1) % MAX_IMAGES_PER_ROW === 0;
                                    const isLastRow = index >= imageItems.length - (imageItems.length % MAX_IMAGES_PER_ROW);
                                    
                                    return (
                                        <View 
                                            key={item.id} 
                                            style={[
                                                styles.imageGridItem,
                                                !isLastInRow && styles.imageGridItemRight,
                                                !isLastRow && styles.imageGridItemBottom
                                            ]}
                                        >
                                            <Image 
                                                source={{ uri: item.thumbnail || item.url }} 
                                                style={styles.imageGridThumbnail}
                                                resizeMode="cover"
                                            />
                                            {index === 0 && imageItems.length > 1 && (
                                                <View style={styles.imageCount}>
                                                    <Feather name="image" size={14} color="#FFFFFF" />
                                                    <Text style={styles.imageCountText}>
                                                        {imageItems.length}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* Audio Items */}
                        {audioItems.length > 0 && (
                            <View style={styles.audioList}>
                                {audioItems.map((item) => (
                                    <View key={item.id} style={styles.audioItem}>
                                        <View style={[styles.audioIcon, { backgroundColor: colors.background }]}>
                                            <Feather 
                                                name="music" 
                                                size={24} 
                                                color={colors.primary} 
                                            />
                                        </View>
                                        <View style={styles.audioInfo}>
                                            <Text 
                                                style={[
                                                    styles.audioName,
                                                    {
                                                        color: colors.textPrimary,
                                                        fontFamily: fonts.medium,
                                                        fontSize: fontSize.sm,
                                                        includeFontPadding: false
                                                    }
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {item.name}
                                            </Text>
                                            {item.size && (
                                                <Text 
                                                    style={[
                                                        styles.audioSize,
                                                        {
                                                            color: colors.textSecondary,
                                                            fontFamily: fonts.regular,
                                                            fontSize: fontSize.xs,
                                                            includeFontPadding: false
                                                        }
                                                    ]}
                                                >
                                                    {item.size}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <Text 
                        style={[
                            styles.headerTitle,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.bold,
                                fontSize: fontSize['2xl']
                            }
                        ]}
                    >
                        Downloads
                    </Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filters}
                >
                    {(['all', 'audio', 'image'] as FilterType[]).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterButton,
                                {
                                    backgroundColor: activeFilter === filter ? colors.primary : 'transparent',
                                    borderColor: activeFilter === filter ? colors.primary : colors.textSecondary + '20',
                                }
                            ]}
                            onPress={() => setActiveFilter(filter)}
                            activeOpacity={0.8}
                        >
                            <Text 
                                style={[
                                    styles.filterText,
                                    {
                                        color: activeFilter === filter ? colors.background : colors.textSecondary,
                                        fontFamily: activeFilter === filter ? fonts.medium : fonts.regular,
                                        fontSize: fontSize.sm,
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {paginatedGroups.length > 0 ? (
                <FlatList
                    data={paginatedGroups}
                    renderItem={renderPost}
                    keyExtractor={([postId]) => postId}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Feather name="download" size={48} color={colors.textSecondary} />
                    <Text 
                        style={[
                            styles.emptyStateText,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.medium,
                                fontSize: fontSize.lg,
                                includeFontPadding: false
                            }
                        ]}
                    >
                        No downloads yet
                    </Text>
                    <Text 
                        style={[
                            styles.emptyStateSubtext,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}
                    >
                        Download audio and images from posts to view them here
                    </Text>
                </View>
            )}
            {renderMenu()}
            <ReportPostModal
                visible={showReportModal}
                onClose={() => {
                    setShowReportModal(false);
                    setSelectedPostId(null);
                }}
                onSubmit={handleReportSubmit}
                postAuthor={selectedPostId ? groupedItems[selectedPostId]?.[0]?.creator?.name || 'Unknown Creator' : 'Unknown Creator'}
            />
            <BlockUserModal
                visible={showBlockModal}
                onClose={() => {
                    setShowBlockModal(false);
                    setSelectedPostId(null);
                }}
                onSubmit={handleBlockSubmit}
                userName={selectedPostId ? groupedItems[selectedPostId]?.[0]?.creator?.name || 'Unknown Creator' : 'Unknown Creator'}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 56,
    },
    headerTitle: {
        marginBottom: 0,
    },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)',
        height: 56,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        minWidth: 100,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterText: {
        textTransform: 'capitalize',
        textAlign: 'center',
        includeFontPadding: false,
        lineHeight: 20,
    },
    list: {
        padding: 16,
    },
    postContainer: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    creatorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    creatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    creatorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    creatorInfo: {
        flex: 1,
    },
    creatorName: {
        marginBottom: 4,
    },
    postMeta: {
        opacity: 0.8,
    },
    menuButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    contentSection: {
        padding: 16,
    },
    postHeader: {
        marginBottom: 16,
    },
    postTitle: {
        marginBottom: 8,
    },
    postDescription: {
        opacity: 0.8,
    },
    assetsContainer: {
        gap: 16,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -GRID_SPACING,
    },
    imageGridItem: {
        width: (SCREEN_WIDTH - 32 - (GRID_SPACING * (MAX_IMAGES_PER_ROW - 1))) / MAX_IMAGES_PER_ROW,
        aspectRatio: 1,
        padding: GRID_SPACING,
    },
    imageGridItemRight: {
        paddingRight: GRID_SPACING,
    },
    imageGridItemBottom: {
        paddingBottom: GRID_SPACING,
    },
    imageGridThumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    imageCount: {
        position: 'absolute',
        top: GRID_SPACING + 8,
        right: GRID_SPACING + 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    imageCountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    audioList: {
        gap: 12,
    },
    audioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
    },
    audioIcon: {
        width: 56,
        height: 56,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    audioInfo: {
        marginLeft: 12,
        flex: 1,
    },
    audioName: {
        marginBottom: 4,
    },
    audioSize: {
        opacity: 0.8,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyStateText: {
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        textAlign: 'center',
        opacity: 0.8,
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    menuContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 8,
        width: 200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuOptionDanger: {
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        marginTop: 4,
    },
    menuOptionText: {
        marginLeft: 12,
        fontSize: 15,
        fontWeight: '500',
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
}); 