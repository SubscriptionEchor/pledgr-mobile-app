import React, { useState, useRef, useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, Modal, StyleSheet, Pressable, findNodeHandle, ScrollView } from 'react-native';
import type { View as RNView, ScrollView as RNScrollView, GestureResponderEvent } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { TabBar } from '@/components/TabBar';
import { Pencil, Instagram, Facebook, Twitter, Youtube, Link as LinkIcon, Rocket, CheckCircle, Info, Gift, ChevronRight, FileText, Share2, ChevronDown, X, MessageCircle, Bell, User, Lock, Folder } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProfileSheet } from '@/lib/context/ProfileSheetContext';

// Import tab components
import { HomeFeedTab } from '@/components/HomeFeedTab';
import { CollectionsTab } from '@/components/CollectionsTab';
import { ChatTab } from '@/components/ChatTab';
import { ShopTab } from '@/components/ShopTab';
import { MembershipsTab } from '@/components/MembershipsTab';
import { AboutTab } from '@/components/AboutTab';
import { RecommendationTab } from '@/components/RecommendationTab';
import { Post } from '@/components/HomeFeedTab';

// Add utility functions
function getYoutubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function HomeScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [activeTab, setActiveTab] = useState('Home');
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const homeTabBarScrollRef = useRef<RNScrollView>(null);
    const homeTabRefs = useRef<React.RefObject<RNView>[]>([]);
    const otherTabBarScrollRef = useRef<RNScrollView>(null);
    const otherTabRefs = useRef<React.RefObject<RNView>[]>([]);
    const tabOptions = ['Home', 'Collections', 'Chat', 'Shop', 'Memberships', 'About', 'Recommendation'];
    const [stepCompleted, setStepCompleted] = useState([false, false, false, false]);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [published, setPublished] = useState(false);

    // Add state for post interactions
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [showComments, setShowComments] = useState<Record<string, boolean>>({});
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [unlockedPosts, setUnlockedPosts] = useState<Record<string, boolean>>({});
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAttachmentsForPost, setShowAttachmentsForPost] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<{ id: string; videoId: string } | null>(null);
    const [currentModalPost, setCurrentModalPost] = useState<any | null>(null);
    const [showMenu, setShowMenu] = useState<{ visible: boolean; x: number; y: number } | null>(null);

    // Add state for audio playback
    const [currentAudio, setCurrentAudio] = useState<{ id: string; sound: Audio.Sound | null } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioError, setAudioError] = useState<string | null>(null);

    // Add state for filter
    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [showPostTypeDropdown, setShowPostTypeDropdown] = useState(false);
    const [selectedPostType, setSelectedPostType] = useState('All');
    const postTypeOptions = ['All', 'Text', 'Video', 'Image', 'Link', 'Poll', 'Audio', 'Livestream'];
    // Second dropdown: Post categories
    const [showPostCategoryDropdown, setShowPostCategoryDropdown] = useState(false);
    const [selectedPostCategory, setSelectedPostCategory] = useState('All posts');
    const mockMemberships = ['Gold Membership', 'Silver Membership'];
    const postCategoryOptions = ['All posts', 'Public', 'Paid', ...mockMemberships];
    // Third dropdown: Time period
    const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('All time');
    const timePeriodOptions = ['All time', 'This month', 'Last month', 'This year', 'Last year'];
    // Fourth dropdown: Sort order
    const [showSortOrderDropdown, setShowSortOrderDropdown] = useState(false);
    const [selectedSortOrder, setSelectedSortOrder] = useState('Newest to oldest');
    const sortOrderOptions = ['Newest to oldest', 'Oldest to newest'];

    // Memberships horizontal carousel state
    const [activeMembershipIdx, setActiveMembershipIdx] = useState(0);

    const router = useRouter();
    const { showProfileSheet } = useProfileSheet();

    const buttonMinWidth = 160;

    const [tabLabelWidths, setTabLabelWidths] = useState<Record<string, number>>({});

    const priceBadgeBg = '#F1F5F9';

    if (homeTabRefs.current.length !== tabOptions.length) {
        homeTabRefs.current = Array(tabOptions.length).fill(null).map((_, i) => homeTabRefs.current[i] || React.createRef<RNView>());
    }
    if (otherTabRefs.current.length !== tabOptions.length) {
        otherTabRefs.current = Array(tabOptions.length).fill(null).map((_, i) => otherTabRefs.current[i] || React.createRef<RNView>());
    }
    const scrollToTab = (idx: number, isHome: boolean) => {
        const scrollView = isHome ? homeTabBarScrollRef.current : otherTabBarScrollRef.current;
        const tab = isHome ? homeTabRefs.current[idx]?.current : otherTabRefs.current[idx]?.current;
        if (scrollView && tab) {
            const scrollViewNode = findNodeHandle(scrollView);
            const tabNode = findNodeHandle(tab);
            if (scrollViewNode && tabNode) {
                tab.measureLayout(
                    scrollViewNode,
                    (x: number) => {
                        scrollView.scrollTo({ x: x - 24, animated: true });
                    },
                    () => {}
                );
            }
        }
    };

    // Check if all steps are complete
    React.useEffect(() => {
        if (stepCompleted.every(Boolean)) {
            setShowCompleteModal(true);
            setShowAnalytics(true);
        }
    }, [stepCompleted]);

    // On mount, check if published
    React.useEffect(() => {
        AsyncStorage.getItem('creator_page_published').then(val => {
            if (val === 'true') setPublished(true);
        });
    }, []);

    // When publish step is completed, set published and persist
    const handleStepComplete = (idx: number) => {
        setStepCompleted(s => {
            const arr = [...s];
            arr[idx] = true;
            if (idx === 2) {
                setPublished(true);
                AsyncStorage.setItem('creator_page_published', 'true');
            }
            return arr;
        });
    };

    // Add handlers for post interactions
    const handleLike = useCallback((postId: string) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    }, []);

    const handleCommentPress = useCallback((postId: string) => {
        console.log('Toggling comments for', postId);
        setShowComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    }, []);

    const handleUnlock = useCallback((postId: string) => {
        setUnlockedPosts(prev => ({
            ...prev,
            [postId]: true
        }));
    }, []);

    const handleAudioPress = useCallback(async (post: any) => {
        try {
            setAudioError(null);
            const currentSound = currentAudio?.sound;
            
            if (currentAudio?.id === post.id && currentSound) {
                // Toggle play/pause for current audio
                if (isPlaying) {
                    await currentSound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await currentSound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                // Stop current audio if any
                if (currentSound) {
                    await currentSound.unloadAsync();
                }

                // Load and play new audio
                const { sound } = await Audio.Sound.createAsync(
                    { uri: post.audioUrl },
                    { shouldPlay: true }
                );
                setCurrentAudio({ id: post.id, sound });
                setIsPlaying(true);
                setAudioProgress(0);
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setAudioError('Failed to play audio. Please try again.');
            setIsPlaying(false);
            setAudioProgress(0);
        }
    }, [currentAudio, isPlaying]);

    const handleVote = useCallback((pollId: string, optionId: string) => {
        // Handle poll voting logic here
        console.log('Vote:', pollId, optionId);
    }, []);

    const handleChatPress = () => {
        router.push('/screens/common/chat');
    };
    const handleNotificationPress = () => {
        router.push('/screens/member/notifications');
    };

    const renderProfileHeader = () => (
        <>
            {/* Cover image */}
            <View style={{ width: '100%', aspectRatio: 1.7, backgroundColor: '#eee', position: 'relative' }}>
                <Image
                    source={{ uri: 'https://cdn.midjourney.com/3bc68bae-e208-4a0a-b612-cc0f0b512e12/0_2.png' }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
                <View style={{ position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity
                        style={{ backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 8, marginRight: 4 }}
                        onPress={handleChatPress}
                        activeOpacity={0.7}
                    >
                        <MessageCircle size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 8, marginRight: 4 }}
                        onPress={handleNotificationPress}
                        activeOpacity={0.7}
                    >
                        <Bell size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 8 }}
                        onPress={showProfileSheet}
                        activeOpacity={0.7}
                    >
                        <User size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Profile section */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 }}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: '#eee', marginRight: 16 }}
                />
                <View style={{ flex: 1 }}>
                    <Text
                        style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.xl }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        John Doe
                    </Text>
                    <Text
                        style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md, marginTop: 2 }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        Award-winning digital artist & creator
                    </Text>
                </View>
                <TouchableOpacity style={{ marginLeft: 12, padding: 8 }} onPress={() => setBottomSheetVisible(true)}>
                    <Text style={{ fontSize: 24, color: colors.textSecondary }}>⋮</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    // Store posts array in a variable for reference in modal
    const posts: Post[] = !stepCompleted.every(Boolean) ? [] : [
        {
            id: 'video1',
            type: 'video',
            creator: {
                name: 'Dance Studio',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                verified: true,
            },
            time: '1 hour ago',
            title: 'Live Dance Performance',
            content: 'Experience the magic of our latest live performance! 🎭✨ Our talented dancers brought their A-game to this spectacular show. Watch as they seamlessly blend contemporary and classical styles in this unforgettable performance. Special thanks to everyone who joined us live! #DancePerformance #LiveShow #DanceArt',
            videoUrl: 'https://www.youtube.com/live/5q8YAUTYAyk?si=al9pKr_zpyKLSdAx',
            likes: 3200,
            comments: 800,
            shares: 400,
            attachments: [
                { id: 'a1', type: 'image', url: 'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png', name: 'Performance Image' },
                { id: 'a2', type: 'document', url: 'https://example.com/show.pdf', name: 'Show Details.pdf' }
            ],
        },
        {
            id: 'video2',
            type: 'video',
            creator: {
                name: 'Dance Studio',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                verified: true,
            },
            time: '2 hours ago',
            title: 'New Choreography Tutorial',
            content: 'Ready to learn something new? 💃🕺 In this tutorial, I break down our latest choreography step by step. Perfect for intermediate dancers looking to challenge themselves! We\'ll focus on body isolation, rhythm, and expression. Grab your water bottle and let\'s get moving! #DanceTutorial #LearnDance #Choreography',
            videoUrl: 'https://youtu.be/5x2uHUB_pzw?si=gVYNV4FgtwzuJA-e',
            likes: 2800,
            comments: 650,
            shares: 320,
            attachments: [
                { id: 'a3', type: 'image', url: 'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png', name: 'Tutorial Image' },
                { id: 'a4', type: 'document', url: 'https://example.com/tutorial.pdf', name: 'Tutorial Notes.pdf' }
            ],
        },
        {
            id: 'video3',
            type: 'video',
            creator: {
                name: 'Dance Studio',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                verified: true,
            },
            time: '3 hours ago',
            title: 'Behind the Scenes',
            content: 'Ever wondered what goes into creating a dance performance? 🎬 Take an exclusive peek behind the curtain! Watch our dancers prepare, rehearse, and perfect their moves. From warm-ups to final run-throughs, this is your all-access pass to see how we bring our shows to life. Plus, some funny bloopers at the end! 😄 #BehindTheScenes #DanceLife #Rehearsal',
            videoUrl: 'https://youtu.be/-sAAa-CCOcg?si=v6742E42oqBa3TJJ',
            likes: 2100,
            comments: 420,
            shares: 280,
            attachments: [
                { id: 'a5', type: 'image', url: 'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png', name: 'BTS Image' },
                { id: 'a6', type: 'document', url: 'https://example.com/bts.pdf', name: 'BTS Notes.pdf' }
            ],
        },
        {
            id: 'video4',
            type: 'video',
            creator: {
                name: 'Dance Studio',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                verified: true,
            },
            time: '4 hours ago',
            title: 'Dance Workshop Highlights',
            content: 'What an incredible workshop we had this weekend! 🌟 Watch the highlights from our intensive dance sessions where dancers of all levels came together to learn, grow, and express themselves. Featuring special moments from our hip-hop, contemporary, and jazz classes. Thank you to everyone who participated and made this workshop so special! #DanceWorkshop #DanceCommunity #Learning',
            videoUrl: 'https://youtu.be/Rd6F5wHIysM?si=1410Jn2VdLKKF-62',
            likes: 1900,
            comments: 380,
            shares: 250,
            attachments: [
                { id: 'a7', type: 'image', url: 'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png', name: 'Workshop Image' },
                { id: 'a8', type: 'document', url: 'https://example.com/workshop.pdf', name: 'Workshop Notes.pdf' }
            ],
        },
        {
            id: 'video5',
            type: 'video',
            creator: {
                name: 'Dance Studio',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                verified: true,
            },
            time: '5 hours ago',
            title: 'Special Performance',
            content: 'Proud to share this special performance from our advanced class! 🎉 This piece was choreographed over the past month and showcases the incredible talent and dedication of our advanced dancers. Watch how they bring emotion and technical precision to this contemporary piece set to original music. A beautiful demonstration of what can be achieved through hard work and passion! #DancePerformance #Contemporary #AdvancedDance',
            videoUrl: 'https://youtu.be/gqlkLVO_zaI?si=9HmB_cekBQ6bPOu8',
            likes: 1700,
            comments: 340,
            shares: 220,
            attachments: [
                { id: 'a9', type: 'image', url: 'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png', name: 'Performance Image' },
                { id: 'a10', type: 'document', url: 'https://example.com/performance.pdf', name: 'Performance Notes.pdf' }
            ],
        }
    ];

    // Filtering logic
    const getFilteredPosts = () => {
        let filtered = posts;
        // Post type filter
        if (selectedPostType !== 'All') {
            filtered = filtered.filter(post => post.type.toLowerCase() === selectedPostType.toLowerCase());
        }
        // Post categories filter
        if (selectedPostCategory !== 'All posts') {
            if (selectedPostCategory === 'Public') {
                filtered = filtered.filter(post => !post.membership);
            } else if (selectedPostCategory === 'Paid') {
                filtered = filtered.filter(post => post.membership);
            } else {
                filtered = filtered.filter(post => post.membership === selectedPostCategory);
            }
        }
        // Time period filter (mock logic, assumes post.time is a string like '1 hour ago', '2 hours ago', etc.)
        // In real app, use a date property and compare with current date
        // Sort order filter
        if (selectedSortOrder === 'Oldest to newest') {
            filtered = [...filtered].reverse();
        }
        return filtered;
    };
    const filteredPosts = getFilteredPosts();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.background }}
                contentContainerStyle={{ flexGrow: 1 }}
                stickyHeaderIndices={[1]}
            >
                {/* Profile Header (scrolls away) */}
                <View style={{ backgroundColor: '#ffffff' }}>
                    {renderProfileHeader()}
                </View>
                {/* Tab Bar (sticky) */}
                <View style={{ backgroundColor: '#ffffff', zIndex: 10, position: 'relative', height: 48 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 12 }}
                        style={{ flexGrow: 0 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 48 }}>
                            {tabOptions.map((tab, idx) => {
                                const isActive = activeTab === tab;
                                return (
                                    <View
                                        ref={homeTabRefs.current[idx]}
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
                    </ScrollView>
                    {/* Divider line below tab bar */}
                    <View style={{ height: 1, backgroundColor: colors.border, width: '100%', position: 'absolute', left: 0, right: 0, bottom: 0 }} />
                </View>
                {/* Tab Content (scrollable) */}
                {activeTab === 'Home' ? (
                    <HomeFeedTab
                        stepCompleted={stepCompleted}
                        onStepComplete={handleStepComplete}
                        published={published}
                        posts={posts}
                        likedPosts={likedPosts}
                        showComments={showComments}
                        showShareModal={showShareModal}
                        setShowShareModal={setShowShareModal}
                        handleLike={handleLike}
                        handleCommentPress={handleCommentPress}
                        setShowFilterSheet={setShowFilterSheet}
                        setShowAttachmentsForPost={setShowAttachmentsForPost}
                        setCurrentModalPost={setCurrentModalPost}
                        setShowMenu={setShowMenu}
                        filteredPosts={filteredPosts}
                        selectedPostType={selectedPostType}
                        selectedPostCategory={selectedPostCategory}
                        selectedTimePeriod={selectedTimePeriod}
                        selectedSortOrder={selectedSortOrder}
                        setSelectedPostType={setSelectedPostType}
                        setSelectedPostCategory={setSelectedPostCategory}
                        setSelectedTimePeriod={setSelectedTimePeriod}
                        setSelectedSortOrder={setSelectedSortOrder}
                    />
                ) : activeTab === 'Collections' ? (
                    <CollectionsTab />
                ) : activeTab === 'Chat' ? (
                    <ChatTab />
                ) : activeTab === 'Shop' ? (
                    <ShopTab />
                ) : activeTab === 'Memberships' ? (
                    <MembershipsTab />
                ) : activeTab === 'About' ? (
                    <AboutTab />
                ) : activeTab === 'Recommendation' ? (
                    <RecommendationTab />
                ) : (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }} />
                )}
            </ScrollView>
            
            {/* Bottom Sheet for kebab menu */}
            <Modal
                visible={bottomSheetVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setBottomSheetVisible(false)}
            >
                <Pressable style={sheetStyles.overlay} onPress={() => setBottomSheetVisible(false)}>
                    <Pressable style={[sheetStyles.sheet, { backgroundColor: colors.background }]} onPress={e => e.stopPropagation()}>
                        <TouchableOpacity style={[sheetStyles.row, { marginBottom: 4 }]} onPress={() => {}}>
                            <Text style={[sheetStyles.iconCell, { color: colors.textPrimary, fontFamily: fonts.medium, marginRight: 12 }]}>✎</Text>
                            <Text style={[sheetStyles.label, { color: colors.textPrimary, fontFamily: fonts.medium }]}>Edit page</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[sheetStyles.row, { marginBottom: 4 }]} onPress={() => {}}>
                            <Text style={[sheetStyles.iconCell, { color: colors.textPrimary, fontFamily: fonts.medium, marginRight: 12 }]}>🎨</Text>
                            <Text style={[sheetStyles.label, { color: colors.textPrimary, fontFamily: fonts.medium }]}>Color</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[sheetStyles.row, { marginBottom: 4 }]} onPress={() => {}}>
                            <Text style={[sheetStyles.iconCell, { color: colors.textPrimary, fontFamily: fonts.medium, marginRight: 12 }]}>⤴️</Text>
                            <Text style={[sheetStyles.label, { color: colors.textPrimary, fontFamily: fonts.medium }]}>Share</Text>
                        </TouchableOpacity>
                        <View style={sheetStyles.row}> 
                            <Text style={[sheetStyles.iconCell, { color: colors.textPrimary, fontFamily: fonts.medium, marginRight: 12 }]}>🌐</Text>
                            <Text style={[sheetStyles.label, { color: colors.textPrimary, fontFamily: fonts.medium }]}>Social links</Text>
                            <View style={{ flexDirection: 'row', marginLeft: 8, gap: 6 }}>
                                {[Instagram, Facebook, Twitter, Youtube, LinkIcon].map((Icon, idx) => (
                                    <View
                                        key={idx}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 16,
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'transparent',
                                            marginRight: idx !== 4 ? 6 : 0,
                                        }}
                                    >
                                        <Icon size={18} color={colors.textPrimary} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Completion Modal */}
            <Modal
                visible={showCompleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => { setShowCompleteModal(false); setShowAnalytics(true); }}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: 32, alignItems: 'center', width: 320, maxWidth: '90%' }}>
                        <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 12, textAlign: 'center' }}>
                            You're ready to go!
                        </Text>
                        <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.textSecondary, marginBottom: 24, textAlign: 'center' }}>
                            All steps are complete. You can now continue.
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 }} onPress={() => { setShowCompleteModal(false); setShowAnalytics(true); }}>
                            <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.md }}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Attachments Modal */}
            <Modal
                visible={!!showAttachmentsForPost}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAttachmentsForPost(null)}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }} onPress={() => setShowAttachmentsForPost(null)}>
                    <Pressable style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' }} onPress={e => e.stopPropagation()}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 8 }} onPress={() => setShowAttachmentsForPost(null)}>
                            <Text style={{ color: '#3B82F6', fontWeight: '600', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                        {showAttachmentsForPost && (() => {
                            const post = posts.find(p => p.id === showAttachmentsForPost);
                            if (!post || !post.attachments || post.attachments.length === 0) {
                                return <Text style={{ color: '#64748B' }}>No attachments found.</Text>;
                            }
                            return (
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Attachments</Text>
                                    {post.attachments.map(att => (
                                        <View key={att.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                            <Text style={{ fontWeight: '600', marginRight: 8 }}>{att.name}</Text>
                                            <Text style={{ color: '#64748B' }}>({att.type})</Text>
                                        </View>
                                    ))}
                                </View>
                            );
                        })()}
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Filter Bottom Sheet */}
            <Modal
                visible={showFilterSheet}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilterSheet(false)}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }} onPress={() => setShowFilterSheet(false)}>
                    <Pressable style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' }} onPress={e => e.stopPropagation()}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 8 }} onPress={() => setShowFilterSheet(false)}>
                            <Text style={{ color: '#3B82F6', fontWeight: '600', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Filter Recent Activity</Text>
                        {/* Post type dropdown */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8 }}>Post type</Text>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'space-between' }}
                                onPress={() => setShowPostTypeDropdown(true)}
                            >
                                <Text style={{ color: selectedPostType === 'All' ? '#64748B' : '#181919' }}>{selectedPostType || 'Select option...'}</Text>
                                <ChevronDown size={18} color="#64748B" />
                            </TouchableOpacity>
                            {/* Dropdown options modal */}
                            <Modal
                                visible={showPostTypeDropdown}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowPostTypeDropdown(false)}
                            >
                                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowPostTypeDropdown(false)}>
                                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, minWidth: 220 }}>
                                        {postTypeOptions.map(option => (
                                            <TouchableOpacity
                                                key={option}
                                                style={{ paddingVertical: 12, paddingHorizontal: 8, borderRadius: 6, backgroundColor: selectedPostType === option ? '#e5e7eb' : 'transparent' }}
                                                onPress={() => {
                                                    setSelectedPostType(option);
                                                    setShowPostTypeDropdown(false);
                                                }}
                                            >
                                                <Text style={{ color: '#181919', fontWeight: selectedPostType === option ? 'bold' : 'normal' }}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </Pressable>
                            </Modal>
                        </View>
                        {/* Post categories dropdown */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8 }}>Post categories</Text>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'space-between' }}
                                onPress={() => setShowPostCategoryDropdown(true)}
                            >
                                <Text style={{ color: selectedPostCategory === 'All posts' ? '#64748B' : '#181919' }}>{selectedPostCategory || 'Select option...'}</Text>
                                <ChevronDown size={18} color="#64748B" />
                            </TouchableOpacity>
                            {/* Dropdown options modal */}
                            <Modal
                                visible={showPostCategoryDropdown}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowPostCategoryDropdown(false)}
                            >
                                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowPostCategoryDropdown(false)}>
                                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, minWidth: 220 }}>
                                        {postCategoryOptions.map(option => (
                                            <TouchableOpacity
                                                key={option}
                                                style={{ paddingVertical: 12, paddingHorizontal: 8, borderRadius: 6, backgroundColor: selectedPostCategory === option ? '#e5e7eb' : 'transparent' }}
                                                onPress={() => {
                                                    setSelectedPostCategory(option);
                                                    setShowPostCategoryDropdown(false);
                                                }}
                                            >
                                                <Text style={{ color: '#181919', fontWeight: selectedPostCategory === option ? 'bold' : 'normal' }}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </Pressable>
                            </Modal>
                        </View>
                        {/* Time period dropdown */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8 }}>Time period</Text>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'space-between' }}
                                onPress={() => setShowTimePeriodDropdown(true)}
                            >
                                <Text style={{ color: selectedTimePeriod === 'All time' ? '#64748B' : '#181919' }}>{selectedTimePeriod || 'Select option...'}</Text>
                                <ChevronDown size={18} color="#64748B" />
                            </TouchableOpacity>
                            {/* Dropdown options modal */}
                            <Modal
                                visible={showTimePeriodDropdown}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowTimePeriodDropdown(false)}
                            >
                                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowTimePeriodDropdown(false)}>
                                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, minWidth: 220 }}>
                                        {timePeriodOptions.map(option => (
                                            <TouchableOpacity
                                                key={option}
                                                style={{ paddingVertical: 12, paddingHorizontal: 8, borderRadius: 6, backgroundColor: selectedTimePeriod === option ? '#e5e7eb' : 'transparent' }}
                                                onPress={() => {
                                                    setSelectedTimePeriod(option);
                                                    setShowTimePeriodDropdown(false);
                                                }}
                                            >
                                                <Text style={{ color: '#181919', fontWeight: selectedTimePeriod === option ? 'bold' : 'normal' }}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </Pressable>
                            </Modal>
                        </View>
                        {/* Sort order dropdown */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8 }}>Sort order</Text>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'space-between' }}
                                onPress={() => setShowSortOrderDropdown(true)}
                            >
                                <Text style={{ color: selectedSortOrder === 'Newest to oldest' ? '#64748B' : '#181919' }}>{selectedSortOrder || 'Select option...'}</Text>
                                <ChevronDown size={18} color="#64748B" />
                            </TouchableOpacity>
                            {/* Dropdown options modal */}
                            <Modal
                                visible={showSortOrderDropdown}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowSortOrderDropdown(false)}
                            >
                                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowSortOrderDropdown(false)}>
                                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, minWidth: 220 }}>
                                        {sortOrderOptions.map(option => (
                                            <TouchableOpacity
                                                key={option}
                                                style={{ paddingVertical: 12, paddingHorizontal: 8, borderRadius: 6, backgroundColor: selectedSortOrder === option ? '#e5e7eb' : 'transparent' }}
                                                onPress={() => {
                                                    setSelectedSortOrder(option);
                                                    setShowSortOrderDropdown(false);
                                                }}
                                            >
                                                <Text style={{ color: '#181919', fontWeight: selectedSortOrder === option ? 'bold' : 'normal' }}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </Pressable>
                            </Modal>
                        </View>
                        {/* Confirm button */}
                        <TouchableOpacity
                            style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 12 }}
                            onPress={() => setShowFilterSheet(false)}
                        >
                            <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.md }}>Confirm</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const sheetStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.18)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 18,
        paddingBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    iconCell: {
        width: 32,
        textAlign: 'center',
        fontSize: 18,
    },
    label: {
        flex: 1,
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        marginLeft: 8,
    },
    closeBtn: {
        marginLeft: 8,
        padding: 4,
    },
});