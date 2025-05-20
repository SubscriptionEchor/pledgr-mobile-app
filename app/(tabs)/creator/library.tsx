import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Modal, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import React, { useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import { SubHeader } from '@/components/SubHeader';
import { Search, Filter, CheckSquare, Square, Image as ImageIcon, FileText, Video, Headphones, MoreVertical, Clock, Eye, Edit, Trash, X, ChevronDown, Radio, Tag } from 'lucide-react-native';

export default function LibraryScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [activeTab, setActiveTab] = useState('Collections');
    const [tabLabelWidths, setTabLabelWidths] = useState<Record<string, number>>({});
    const [searchText, setSearchText] = useState('');
    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [collectionMenuOpen, setCollectionMenuOpen] = useState<string | null>(null);
    
    // Filter state
    const [selectedPostTypes, setSelectedPostTypes] = useState<string[]>([]);
    const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const ITEMS_PER_PAGE = 8;

    const tabs = ['Posts', 'Collections', 'Drafts'];
    
    // Mock data for filters
    const postTypes = ['Livestream', 'Audio', 'Image', 'Link', 'Poll', 'Text'];
    const accessOptions = ['Public', 'All members', 'Paid members only', 'Free members only'];
    const creatorTiers = ['Gold Tier', 'Silver Tier', 'Bronze Tier'];
    const creatorTags = ['Tutorial', 'News', 'Update', 'Behind the scenes', 'Q&A'];

    // Clear all filters
    const clearFilters = () => {
        setSelectedPostTypes([]);
        setSelectedAccess([]);
        setSelectedTags([]);
    };
    
    // Apply filters 
    const applyFilters = () => {
        // Here you would implement the actual filtering logic
        setShowFilterSheet(false);
    };
    
    // Toggle selection for filter items
    const togglePostType = (type: string) => {
        setSelectedPostTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type) 
                : [...prev, type]
        );
    };
    
    const toggleAccess = (access: string) => {
        setSelectedAccess(prev => 
            prev.includes(access) 
                ? prev.filter(a => a !== access) 
                : [...prev, access]
        );
    };
    
    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    // Generate a larger dataset to demonstrate pagination
    const generateMockPosts = useCallback((count: number) => {
        return Array(count).fill(null).map((_, i) => ({
            id: `${i + 1}`,
            title: i % 3 === 0 
                ? 'Getting Started with React Native' 
                : i % 3 === 1 
                ? 'React Native Animation Tutorial'
                : 'Mobile App Design Principles',
            publishDate: i % 3 === 0 
                ? '2023-06-15' 
                : i % 3 === 1 
                ? '2023-07-22'
                : '2023-08-05',
            tierAccess: i % 3 === 0 
                ? 'Premium' 
                : i % 3 === 1 
                ? 'Free'
                : 'Gold',
            price: i % 3 === 0 
                ? '$4.99' 
                : i % 3 === 1 
                ? '-'
                : '$9.99',
            type: i % 3 === 0 
                ? 'text' 
                : i % 3 === 1 
                ? 'video'
                : 'audio',
            thumbnail: i % 3 === 0 
                ? 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80' 
                : i % 3 === 1 
                ? 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80'
                : 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80'
        }));
    }, []);

    // Create dataset with 50 items
    const allMockPosts = generateMockPosts(50);
    
    // Get current page data
    const getCurrentPageData = useCallback(() => {
        return allMockPosts.slice(0, page * ITEMS_PER_PAGE);
    }, [allMockPosts, page]);
    
    const mockPosts = getCurrentPageData();

    // Check if all items are selected
    const allSelected = mockPosts.length > 0 && selectedPosts.length === mockPosts.length;
    
    // Select/deselect all items
    const toggleSelectAll = useCallback(() => {
        if (allSelected) {
            // If all are selected, clear selection
            setSelectedPosts([]);
        } else {
            // Select all visible posts
            setSelectedPosts(mockPosts.map(post => post.id));
        }
    }, [mockPosts, allSelected]);

    const handleLoadMore = useCallback(() => {
        if (isLoading || !hasMoreData) return;
        
        // Check if we've reached the end of the data
        if (page * ITEMS_PER_PAGE >= allMockPosts.length) {
            setHasMoreData(false);
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
            setPage(prevPage => prevPage + 1);
            setIsLoading(false);
        }, 800);
    }, [page, isLoading, hasMoreData, allMockPosts.length]);

    const renderFooter = useCallback(() => {
        if (!isLoading) return null;

    return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loaderText, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
                    Loading more posts...
                </Text>
            </View>
        );
    }, [isLoading, colors, fonts]);

    const togglePostSelection = (postId: string) => {
        setSelectedPosts(prev => 
            prev.includes(postId) 
                ? prev.filter(id => id !== postId) 
                : [...prev, postId]
        );
    };

    const handleOpenMenu = (postId: string) => {
        setMenuOpen(postId);
    };

    const handleCloseMenu = () => {
        setMenuOpen(null);
    };

    const handleViewPost = (postId: string) => {
        console.log(`View post ${postId}`);
        handleCloseMenu();
        // Navigation logic would go here
    };

    const handleEditPost = (postId: string) => {
        console.log(`Edit post ${postId}`);
        handleCloseMenu();
        // Navigation logic would go here
    };

    const handleDeletePost = (postId: string) => {
        console.log(`Delete post ${postId}`);
        handleCloseMenu();
        // Delete logic would go here
    };

    const getPostTypeIcon = (type: string) => {
        switch (type) {
            case 'text':
                return <FileText size={16} color={colors.textSecondary} />;
            case 'video':
                return <Video size={16} color={colors.textSecondary} />;
            case 'audio':
                return <Headphones size={16} color={colors.textSecondary} />;
            default:
                return <ImageIcon size={16} color={colors.textSecondary} />;
        }
    };

    const renderListItem = ({ item }: { item: typeof mockPosts[0] }) => (
        <View style={styles.listItem}>
            <View style={styles.listImageContainer}>
                <Image 
                    source={{ uri: item.thumbnail }} 
                    style={styles.listThumbnail} 
                    resizeMode="cover"
                />
                <TouchableOpacity 
                    style={styles.listCheckboxOverlay}
                    onPress={() => togglePostSelection(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={styles.checkboxBackground}>
                        {selectedPosts.includes(item.id) ? (
                            <CheckSquare size={20} color={colors.primary} />
                        ) : (
                            <Square size={20} color={colors.textSecondary} />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            
            <View style={styles.listItemContent}>
                <View style={styles.listItemHeader}>
                    <Text 
                        style={[styles.listItemTitle, { fontFamily: fonts.medium, color: colors.textPrimary }]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                    
                    <View style={styles.listItemDate}>
                        <Clock size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={[styles.listItemDateText, { fontFamily: fonts.regular }]}>
                            {item.publishDate}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.listItemBadges}>
                    <View style={styles.listItemType}>
                        {getPostTypeIcon(item.type)}
                        <Text 
                            style={[styles.listItemTypeText, { fontFamily: fonts.regular }]} 
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Text>
                    </View>
                    
                    <View style={[
                        styles.accessBadge, 
                        { backgroundColor: item.tierAccess === 'Free' ? '#E5F6FD' : '#FFF4E5' }
                    ]}>
                        <Text 
                            style={{ 
                                color: item.tierAccess === 'Free' ? '#0288D1' : '#ED8936', 
                                fontFamily: fonts.medium, 
                                fontSize: 12 
                            }}
                            numberOfLines={1}
                        >
                            {item.tierAccess}
                </Text>
                    </View>
                    
                    {item.price !== '-' && (
                        <View style={styles.priceBadge}>
                            <Text 
                                style={[styles.priceText, { fontFamily: fonts.medium }]}
                                numberOfLines={1}
                            >
                                {item.price}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            
            <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => handleOpenMenu(item.id)}
            >
                <MoreVertical size={22} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
                    <Text style={{
                        color: colors.textSecondary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.xl,
                        marginBottom: 8,
                    }}>
                No posts yet
            </Text>
            <Text style={{
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                textAlign: 'center',
                maxWidth: 260,
            }}>
                Create and publish content to see it here
            </Text>
        </View>
    );

    // Handle bulk edit for selected posts
    const handleBulkEdit = () => {
        console.log(`Editing ${selectedPosts.length} posts`);
        // Navigate to edit screen or show edit modal
    };

    // Handle bulk delete for selected posts
    const handleBulkDelete = () => {
        console.log(`Deleting ${selectedPosts.length} posts`);
        // Show confirmation dialog before deleting
    };

    // Clear selection
    const clearSelection = () => {
        setSelectedPosts([]);
    };

    // Generate mock collections data
    const generateMockCollections = useCallback((count: number) => {
        return Array(count).fill(null).map((_, i) => ({
            id: `${i + 1}`,
            title: i % 3 === 0 
                ? 'Beginner Tutorials' 
                : i % 3 === 1 
                ? 'Advanced Techniques'
                : 'Platform Updates',
            postCount: i % 3 === 0 
                ? 12
                : i % 3 === 1 
                ? 8
                : 5,
            createdDate: i % 3 === 0 
                ? '2023-06-15' 
                : i % 3 === 1 
                ? '2023-07-22'
                : '2023-08-05',
            tierAccess: i % 3 === 0 
                ? 'Premium' 
                : i % 3 === 1 
                ? 'Free'
                : 'Gold',
            price: i % 3 === 0 
                ? '$9.99' 
                : i % 3 === 1 
                ? ''
                : '$14.99',
        }));
    }, []);

    // Create mock collections dataset with 20 items
    const allMockCollections = generateMockCollections(20);
    
    // Get current page of collections
    const getCurrentPageCollections = useCallback(() => {
        return allMockCollections.slice(0, page * ITEMS_PER_PAGE);
    }, [allMockCollections, page]);
    
    const mockCollections = getCurrentPageCollections();

    // Check if all collections are selected
    const allCollectionsSelected = mockCollections.length > 0 && selectedPosts.length === mockCollections.length;
    
    // Toggle select all collections
    const toggleSelectAllCollections = useCallback(() => {
        if (allCollectionsSelected) {
            // If all are selected, clear selection
            setSelectedPosts([]);
        } else {
            // Select all visible collections
            setSelectedPosts(mockCollections.map(collection => collection.id));
        }
    }, [mockCollections, allCollectionsSelected]);

    // Collection action handlers
    const handleOpenCollectionMenu = (collectionId: string) => {
        setCollectionMenuOpen(collectionId);
    };

    const handleCloseCollectionMenu = () => {
        setCollectionMenuOpen(null);
    };

    const handleViewCollection = (collectionId: string) => {
        console.log(`View collection ${collectionId}`);
        handleCloseCollectionMenu();
        // Navigation logic would go here
    };

    const handleEditCollection = (collectionId: string) => {
        console.log(`Edit collection ${collectionId}`);
        handleCloseCollectionMenu();
        // Navigation logic would go here
    };

    const handleDeleteCollection = (collectionId: string) => {
        console.log(`Delete collection ${collectionId}`);
        handleCloseCollectionMenu();
        // Delete logic would go here
    };

    // Render a collection item in the list
    const renderCollectionItem = ({ item }: { item: typeof mockCollections[0] }) => (
        <View style={styles.listItem}>
            <View style={styles.listImageContainer}>
                <View style={styles.collectionThumbnail}>
                    <FileText size={30} color="#777777" />
                </View>
                <TouchableOpacity 
                    style={styles.listCheckboxOverlay}
                    onPress={() => togglePostSelection(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={styles.checkboxBackground}>
                        {selectedPosts.includes(item.id) ? (
                            <CheckSquare size={20} color="#444444" />
                        ) : (
                            <Square size={20} color="#444444" />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            
            <View style={styles.listItemContent}>
                <View style={styles.listItemHeader}>
                    <Text 
                        style={[styles.listItemTitle, { fontFamily: fonts.medium, color: colors.textPrimary }]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                    
                    <View style={styles.listItemDate}>
                        <Clock size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={[styles.listItemDateText, { fontFamily: fonts.regular }]}>
                            {item.createdDate}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.listItemBadges}>
                    <View style={styles.listItemType}>
                        <FileText size={14} color={colors.textSecondary} />
                        <Text 
                            style={[styles.listItemTypeText, { fontFamily: fonts.regular }]} 
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.postCount} posts
                        </Text>
                    </View>
                    
                    {item.tierAccess === 'Free' ? (
                        <View style={[styles.accessBadge, { backgroundColor: '#E5F6FD' }]}>
                            <Text 
                                style={{ 
                                    color: '#0288D1', 
                                    fontFamily: fonts.medium, 
                                    fontSize: 12 
                                }}
                                numberOfLines={1}
                            >
                                Free
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.priceBadge}>
                            <Text style={[styles.priceText, { fontFamily: fonts.medium }]}>
                                {item.price}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            
            <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => handleOpenCollectionMenu(item.id)}
            >
                <MoreVertical size={22} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Posts':
                return (
                    <View style={{ width: '100%' }}>
                        {/* Search and Filter Bar */}
                        <View style={styles.searchContainer}>
                            <View style={styles.searchInputContainer}>
                                <Search size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
                                <TextInput
                                    style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                                    placeholder="Search posts..."
                                    placeholderTextColor={colors.textSecondary}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>
                            
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => setShowFilterSheet(true)}
                            >
                                <Filter size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Selection Bar */}
                        <View style={styles.selectionBar}>
                            <View style={styles.selectAllContainer}>
                                <TouchableOpacity 
                                    style={styles.selectAllButton}
                                    onPress={toggleSelectAll}
                                >
                                    {allSelected ? (
                                        <CheckSquare size={20} color={colors.primary} />
                                    ) : (
                                        <Square size={20} color={colors.textSecondary} />
                                    )}
                                    <Text style={[styles.selectAllText, { 
                                        fontFamily: fonts.medium, 
                                        color: allSelected ? colors.primary : colors.textSecondary 
                                    }]}>
                                        Select All
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{ 
                                color: colors.textSecondary, 
                                fontFamily: fonts.regular, 
                                fontSize: 13 
                            }}>
                                Showing {mockPosts.length} of {allMockPosts.length} posts
                            </Text>
                        </View>

                        {/* Content List */}
                        {mockPosts.length > 0 ? (
                            <FlatList
                                data={mockPosts}
                                renderItem={renderListItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.listContainer}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={ITEMS_PER_PAGE}
                                maxToRenderPerBatch={ITEMS_PER_PAGE}
                                windowSize={5}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.3}
                                ListFooterComponent={renderFooter}
                            />
                        ) : (
                            renderEmptyState()
                        )}

                        {/* Filters Bottom Sheet */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showFilterSheet}
                            onRequestClose={() => setShowFilterSheet(false)}
                        >
                            <Pressable 
                                style={styles.modalOverlay} 
                                onPress={() => setShowFilterSheet(false)}
                            >
                                <View style={styles.filterBottomSheet}>
                                    <View style={styles.bottomSheetHandle} />
                                    
                                    <View style={styles.filterHeader}>
                                        <Text style={[styles.filterTitle, { fontFamily: fonts.semibold }]}>
                                            Filter posts
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowFilterSheet(false)}>
                                            <X size={24} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <ScrollView style={styles.filterContent}>
                                        {/* Post Type Section */}
                                        <View style={styles.filterSection}>
                                            <Text style={[styles.filterSectionTitle, { fontFamily: fonts.medium }]}>
                                                Post type
                                            </Text>
                                            <View style={styles.filterOptionsList}>
                                                {postTypes.map((type) => (
                                                    <TouchableOpacity 
                                                        key={type}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedPostTypes.includes(type) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => togglePostType(type)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedPostTypes.includes(type) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {type}
                                                        </Text>
                                                        {selectedPostTypes.includes(type) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Post Access Section */}
                                        <View style={styles.filterSection}>
                                            <Text style={[styles.filterSectionTitle, { fontFamily: fonts.medium }]}>
                                                Post access
                                            </Text>
                                            <View style={styles.filterOptionsList}>
                                                {accessOptions.map((access) => (
                                                    <TouchableOpacity 
                                                        key={access}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedAccess.includes(access) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => toggleAccess(access)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedAccess.includes(access) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {access}
                                                        </Text>
                                                        {selectedAccess.includes(access) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                                
                                                {/* Creator Tiers */}
                                                {creatorTiers.map((tier) => (
                                                    <TouchableOpacity 
                                                        key={tier}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedAccess.includes(tier) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => toggleAccess(tier)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedAccess.includes(tier) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {tier}
                                                        </Text>
                                                        {selectedAccess.includes(tier) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Tags Section */}
                                        <View style={styles.filterSection}>
                                            <Text style={[styles.filterSectionTitle, { fontFamily: fonts.medium }]}>
                                                Tags
                                            </Text>
                                            <View style={styles.filterOptionsList}>
                                                {creatorTags.map((tag) => (
                                                    <TouchableOpacity 
                                                        key={tag}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedTags.includes(tag) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => toggleTag(tag)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedTags.includes(tag) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {tag}
                                                        </Text>
                                                        {selectedTags.includes(tag) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </ScrollView>
                                    
                                    {/* Action Buttons */}
                                    <View style={styles.filterActions}>
                                        <TouchableOpacity 
                                            style={styles.clearButton}
                                            onPress={clearFilters}
                                        >
                                            <Text style={[styles.clearButtonText, { fontFamily: fonts.medium }]}>
                                                Clear
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={[styles.applyButton, { backgroundColor: colors.primary }]}
                                            onPress={applyFilters}
                                        >
                                            <Text style={[styles.applyButtonText, { fontFamily: fonts.medium }]}>
                                                Apply
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Pressable>
                        </Modal>

                        {/* Action Menu Bottom Sheet */}
                        {menuOpen && (
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={!!menuOpen}
                                onRequestClose={handleCloseMenu}
                            >
                                <Pressable 
                                    style={styles.modalOverlay} 
                                    onPress={handleCloseMenu}
                                >
                                    <View 
                                        style={[styles.bottomSheet, { backgroundColor: colors.background }]}
                                    >
                                        <View style={styles.bottomSheetHandle} />
                                        
                                        <View style={styles.menuOptionsList}>
                                            <TouchableOpacity 
                                                style={styles.bottomSheetOption}
                                                onPress={() => handleViewPost(menuOpen)}
                                            >
                                                <Eye size={20} color={colors.textPrimary} style={styles.bottomSheetIcon} />
                                                <Text style={[styles.bottomSheetText, { fontFamily: fonts.medium, color: colors.textPrimary }]}>
                                                    View post
                                                </Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                style={styles.bottomSheetOption}
                                                onPress={() => handleEditPost(menuOpen)}
                                            >
                                                <Edit size={20} color={colors.textPrimary} style={styles.bottomSheetIcon} />
                                                <Text style={[styles.bottomSheetText, { fontFamily: fonts.medium, color: colors.textPrimary }]}>
                                                    Edit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <TouchableOpacity 
                                            style={[styles.bottomSheetOption, styles.deleteOption]}
                                            onPress={() => handleDeletePost(menuOpen)}
                                        >
                                            <Trash size={20} color="#E53935" style={styles.bottomSheetIcon} />
                                            <Text style={[styles.bottomSheetText, { fontFamily: fonts.medium, color: "#E53935" }]}>
                                                Delete post
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Pressable>
                            </Modal>
                        )}
                    </View>
                );
            case 'Collections':
                return (
                    <View style={{ width: '100%' }}>
                        {/* Search and Filter Bar */}
                        <View style={styles.searchContainer}>
                            <View style={styles.searchInputContainer}>
                                <Search size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
                                <TextInput
                                    style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                                    placeholder="Search collections..."
                                    placeholderTextColor={colors.textSecondary}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>
                            
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => setShowFilterSheet(true)}
                            >
                                <Filter size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Selection Bar */}
                        <View style={styles.selectionBar}>
                            <View style={styles.selectAllContainer}>
                                <TouchableOpacity 
                                    style={styles.selectAllButton}
                                    onPress={toggleSelectAllCollections}
                                >
                                    {allCollectionsSelected ? (
                                        <CheckSquare size={20} color={colors.primary} />
                                    ) : (
                                        <Square size={20} color={colors.textSecondary} />
                                    )}
                                    <Text style={[styles.selectAllText, { 
                                        fontFamily: fonts.medium, 
                                        color: allCollectionsSelected ? colors.primary : colors.textSecondary 
                                    }]}>
                                        Select All
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{ 
                                color: colors.textSecondary, 
                                fontFamily: fonts.regular, 
                                fontSize: 13 
                            }}>
                                Showing {mockCollections.length} of {allMockCollections.length} collections
                            </Text>
                        </View>

                        {/* Content List */}
                        {mockCollections.length > 0 ? (
                            <FlatList
                                data={mockCollections}
                                renderItem={renderCollectionItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.listContainer}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={ITEMS_PER_PAGE}
                                maxToRenderPerBatch={ITEMS_PER_PAGE}
                                windowSize={5}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.3}
                                ListFooterComponent={renderFooter}
                            />
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Text style={{
                                    color: colors.textSecondary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.xl,
                                    marginBottom: 8,
                                }}>
                                    No collections yet
                    </Text>
                    <Text style={{
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                        textAlign: 'center',
                        maxWidth: 260,
                    }}>
                        Create your first collection to organize your content
                    </Text>
                </View>
                        )}

                        {/* Collection Action Menu Bottom Sheet */}
                        {collectionMenuOpen && (
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={!!collectionMenuOpen}
                                onRequestClose={handleCloseCollectionMenu}
                            >
                                <Pressable 
                                    style={styles.modalOverlay} 
                                    onPress={handleCloseCollectionMenu}
                                >
                                    <View 
                                        style={[styles.bottomSheet, { backgroundColor: colors.background }]}
                                    >
                                        <View style={styles.bottomSheetHandle} />
                                        
                                        <View style={styles.menuOptionsList}>
                                            <TouchableOpacity 
                                                style={styles.bottomSheetOption}
                                                onPress={() => handleViewCollection(collectionMenuOpen)}
                                            >
                                                <Eye size={20} color={colors.textPrimary} style={styles.bottomSheetIcon} />
                                                <Text style={[styles.bottomSheetText, { fontFamily: fonts.medium, color: colors.textPrimary }]}>
                                                    View collection
                                                </Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                style={styles.bottomSheetOption}
                                                onPress={() => handleEditCollection(collectionMenuOpen)}
                                            >
                                                <Edit size={20} color={colors.textPrimary} style={styles.bottomSheetIcon} />
                                                <Text style={[styles.bottomSheetText, { fontFamily: fonts.medium, color: colors.textPrimary }]}>
                                                    Edit collection
                                                </Text>
                                            </TouchableOpacity>
            </View>
                                        
                                        <TouchableOpacity 
                                            style={[styles.bottomSheetOption, styles.deleteOption]}
                                            onPress={() => handleDeleteCollection(collectionMenuOpen)}
                                        >
                                            <Trash size={20} color="#E53935" style={styles.bottomSheetIcon} />
                                            <Text style={[styles.bottomSheetText, { fontFamily: fonts.medium, color: "#E53935" }]}>
                                                Delete collection
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Pressable>
                            </Modal>
                        )}

                        {/* Filters Bottom Sheet - Reusing the same sheet from Posts tab */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showFilterSheet}
                            onRequestClose={() => setShowFilterSheet(false)}
                        >
                            <Pressable 
                                style={styles.modalOverlay} 
                                onPress={() => setShowFilterSheet(false)}
                            >
                                <View style={styles.filterBottomSheet}>
                                    <View style={styles.bottomSheetHandle} />
                                    
                                    <View style={styles.filterHeader}>
                                        <Text style={[styles.filterTitle, { fontFamily: fonts.semibold }]}>
                                            Filter collections
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowFilterSheet(false)}>
                                            <X size={24} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <ScrollView style={styles.filterContent}>
                                        {/* Post Type Section */}
                                        <View style={styles.filterSection}>
                                            <Text style={[styles.filterSectionTitle, { fontFamily: fonts.medium }]}>
                                                Collection type
                                            </Text>
                                            <View style={styles.filterOptionsList}>
                                                {postTypes.map((type) => (
                                                    <TouchableOpacity 
                                                        key={type}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedPostTypes.includes(type) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => togglePostType(type)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedPostTypes.includes(type) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {type}
                                                        </Text>
                                                        {selectedPostTypes.includes(type) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Access Section */}
                                        <View style={styles.filterSection}>
                                            <Text style={[styles.filterSectionTitle, { fontFamily: fonts.medium }]}>
                                                Collection access
                                            </Text>
                                            <View style={styles.filterOptionsList}>
                                                {accessOptions.map((access) => (
                                                    <TouchableOpacity 
                                                        key={access}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedAccess.includes(access) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => toggleAccess(access)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedAccess.includes(access) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {access}
                                                        </Text>
                                                        {selectedAccess.includes(access) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                                
                                                {/* Creator Tiers */}
                                                {creatorTiers.map((tier) => (
                                                    <TouchableOpacity 
                                                        key={tier}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedAccess.includes(tier) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => toggleAccess(tier)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedAccess.includes(tier) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {tier}
                                                        </Text>
                                                        {selectedAccess.includes(tier) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Tags Section */}
                                        <View style={styles.filterSection}>
                                            <Text style={[styles.filterSectionTitle, { fontFamily: fonts.medium }]}>
                                                Tags
                                            </Text>
                                            <View style={styles.filterOptionsList}>
                                                {creatorTags.map((tag) => (
                                                    <TouchableOpacity 
                                                        key={tag}
                                                        style={[
                                                            styles.filterOption,
                                                            selectedTags.includes(tag) && styles.selectedFilterOption
                                                        ]}
                                                        onPress={() => toggleTag(tag)}
                                                    >
                                                        <Text 
                                                            style={[
                                                                styles.filterOptionText,
                                                                { fontFamily: fonts.regular },
                                                                selectedTags.includes(tag) && { color: colors.primary }
                                                            ]}
                                                        >
                                                            {tag}
                                                        </Text>
                                                        {selectedTags.includes(tag) && (
                                                            <CheckSquare size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </ScrollView>
                                    
                                    {/* Action Buttons */}
                                    <View style={styles.filterActions}>
                                        <TouchableOpacity 
                                            style={styles.clearButton}
                                            onPress={clearFilters}
                                        >
                                            <Text style={[styles.clearButtonText, { fontFamily: fonts.medium }]}>
                                                Clear
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={[styles.applyButton, { backgroundColor: colors.primary }]}
                                            onPress={applyFilters}
                                        >
                                            <Text style={[styles.applyButtonText, { fontFamily: fonts.medium }]}>
                                                Apply
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Pressable>
                        </Modal>
        </View>
    );
            case 'Drafts':
                return (
                    <View style={{ alignItems: 'center', marginTop: 32 }}>
                        <Text style={{
                            color: colors.textSecondary,
                            fontFamily: fonts.semibold,
                            fontSize: fontSize.xl,
                            marginBottom: 8,
                        }}>
                            No drafts yet
                        </Text>
                        <Text style={{
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                            textAlign: 'center',
                            maxWidth: 260,
                        }}>
                            Save your work in progress as drafts
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBarComponent />
            
            {selectedPosts.length > 0 ? (
                // Selection mode header with edit/delete actions
                <View style={styles.selectionHeader}>
                    <View style={styles.selectionHeaderLeft}>
                        <TouchableOpacity 
                            style={styles.clearSelectionButton}
                            onPress={clearSelection}
                        >
                            <X size={22} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={[styles.selectedCountText, { 
                            fontFamily: fonts.medium,
                            color: colors.textPrimary
                        }]}>
                            {selectedPosts.length} selected
                        </Text>
                    </View>
                    
                    <View style={styles.selectionHeaderActions}>
                        <TouchableOpacity 
                            style={styles.headerEditButton}
                            onPress={handleBulkEdit}
                        >
                            <Edit size={22} color="#444444" />
                            <Text style={[styles.headerActionText, { 
                                fontFamily: fonts.medium,
                                color: "#444444" 
                            }]}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.headerDeleteButton}
                            onPress={handleBulkDelete}
                        >
                            <Trash size={22} color="#444444" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                // Normal header
                <SubHeader title="Library" showBackButton={false} titleAlignment="left" />
            )}
            
            {/* Tab Bar (sticky) */}
            <View style={{ backgroundColor: '#ffffff', zIndex: 10, position: 'relative', height: 48 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: 12,
                        height: 48,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 48 }}>
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <View
                                    key={tab}
                                    style={{
                                        alignItems: 'center',
                                        marginRight: 8,
                                        height: 48,
                                        justifyContent: 'flex-end',
                                        position: 'relative',
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => setActiveTab(tab)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            borderRadius: 999,
                                            paddingHorizontal: 8,
                                            paddingVertical: 0,
                                            minWidth: 48,
                                            alignItems: 'center',
                                            height: '100%',
                                            justifyContent: 'center',
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            onLayout={e => {
                                                const width = e.nativeEvent.layout.width;
                                                setTabLabelWidths(prev =>
                                                    prev[tab] === width ? prev : { ...prev, [tab]: width }
                                                );
                                            }}
                                            style={{
                                                color: isActive ? '#181919' : '#888',
                                                fontFamily: isActive ? fonts.bold : fonts.medium,
                                                fontSize: fontSize.lg,
                                            }}
                                        >
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                    {isActive && (
                                        <View style={{
                                            position: 'absolute',
                                            left: '50%',
                                            bottom: 1,
                                            transform: [{ translateX: -((tabLabelWidths[tab] || 24) * 0.5) }],
                                            height: 2,
                                            width: tabLabelWidths[tab] || 24,
                                            borderRadius: 2,
                                            backgroundColor: '#181919',
                                        }} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
                {/* Divider line below tab bar */}
                <View style={{ height: 1, backgroundColor: colors.border, width: '100%', position: 'absolute', left: 0, right: 0, bottom: 0 }} />
            </View>

            {/* Tab Content */}
            <View style={styles.content}>
                {renderTabContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    emptyStateContainer: {
        alignItems: 'center',
        marginTop: 32,
    },
    selectionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginBottom: 12,
        justifyContent: 'space-between',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    selectAllText: {
        marginLeft: 6,
        fontSize: 14,
    },
    paginationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listContainer: {
        width: '100%',
        paddingBottom: 180,
        paddingTop: 8,
        paddingHorizontal: 4,
    },
    gridColumns: {
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        width: '100%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        marginHorizontal: 2,
    },
    listImageContainer: {
        position: 'relative',
        marginRight: 2,
    },
    listThumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    listCheckboxOverlay: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    checkboxBackground: {
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItemContent: {
        flex: 1,
        paddingVertical: 4,
    },
    listItemHeader: {
        marginBottom: 12,
    },
    listItemTitle: {
        fontSize: 16,
        marginBottom: 6,
    },
    listItemDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    listItemDateText: {
        fontSize: 12,
        color: '#777',
    },
    listItemBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 8,
    },
    listItemType: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        maxWidth: 80,
    },
    listItemTypeText: {
        fontSize: 12,
        color: '#777',
        marginLeft: 4,
    },
    accessBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceText: {
        fontSize: 13,
        color: '#2E7D32',
    },
    moreButton: {
        padding: 8,
        marginLeft: 12,
    },
    cardItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        flex: 1,
        maxWidth: '48%',
        marginHorizontal: 2,
        overflow: 'hidden',
    },
    cardHeader: {
        display: 'none',
    },
    cardImageContainer: {
        position: 'relative',
        marginHorizontal: 0,
        width: '100%',
    },
    cardImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
    },
    cardCheckboxOverlay: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    cardMoreButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
    },
    cardTypeContainer: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 15,
        marginBottom: 12,
        height: 44,
    },
    cardMeta: {
        marginTop: 4,
    },
    cardDate: {
        fontSize: 12,
        marginBottom: 12,
    },
    cardBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    loaderContainer: {
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    loaderText: {
        marginLeft: 8,
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 16,
    },
    bottomSheetHandle: {
        width: 36,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    menuOptionsList: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    bottomSheetOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    bottomSheetIcon: {
        marginRight: 12,
    },
    bottomSheetText: {
        fontSize: 16,
    },
    deleteOption: {
        marginTop: 0,
        paddingTop: 14,
    },
    checkbox: {
        marginRight: 16,
    },
    activeIconButton: {
        backgroundColor: '#E8F4FF',
    },
    filterBottomSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 24,
        maxHeight: '90%',
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterTitle: {
        fontSize: 18,
        color: '#333',
    },
    filterContent: {
        maxHeight: 500,
    },
    filterSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterSectionTitle: {
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    filterOptionsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginBottom: 8,
    },
    selectedFilterOption: {
        backgroundColor: '#E8F4FF',
    },
    filterOptionText: {
        fontSize: 14,
        color: '#555',
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 12,
    },
    clearButton: {
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        alignItems: 'center',
        flex: 1,
    },
    clearButtonText: {
        fontSize: 16,
        color: '#555',
    },
    applyButton: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    applyButtonText: {
        fontSize: 16,
        color: 'white',
    },
    // Selection header styles
    selectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    selectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearSelectionButton: {
        padding: 8,
        marginRight: 8,
    },
    selectedCountText: {
        fontSize: 16,
    },
    selectionHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerActionText: {
        fontSize: 15,
        marginLeft: 6,
    },
    headerEditButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginLeft: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 0,
    },
    headerDeleteButton: {
        padding: 10,
        marginLeft: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
    },
    collectionThumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
});