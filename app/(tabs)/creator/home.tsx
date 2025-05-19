import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, Modal, StyleSheet, Pressable, findNodeHandle, ScrollView, TextInput } from 'react-native';
import type { View as RNView, ScrollView as RNScrollView, GestureResponderEvent } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { TabBar } from '@/components/TabBar';
import { Pencil, Instagram, Facebook, Twitter, Youtube, Link as LinkIcon, Rocket, CheckCircle, Info, Gift, ChevronRight, FileText, Share2, ChevronDown, X, MessageCircle, Bell, User, Lock, Folder } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecentPostsFeed } from '@/components/RecentPostsFeed';
import { Audio } from 'expo-av';
import { CreatorSteps } from '@/app/components/CreatorSteps';
import { PostPreview } from '@/app/components/PostPreview';
import { PostCard, type Post } from '@/app/components/PostCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProfileSheet } from '@/lib/context/ProfileSheetContext';

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
    const posts = !stepCompleted.every(Boolean) ? [] : [
        {
            id: 'video1',
            type: 'video' as const,
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
            membership: undefined,
        },
        {
            id: 'video2',
            type: 'video' as const,
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
            membership: undefined,
        },
        {
            id: 'video3',
            type: 'video' as const,
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
            membership: undefined,
        },
        {
            id: 'video4',
            type: 'video' as const,
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
            membership: undefined,
        },
        {
            id: 'video5',
            type: 'video' as const,
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
            membership: undefined,
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
                                    onPress={() => handleStepComplete(2)}
                                    activeOpacity={0.8}
                                >
                                    <Rocket size={16} color={colors.buttonText} style={{ marginRight: 7 }} />
                                    <Text style={{ color: colors.buttonText, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
                                        Publish page
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        
                        <FlatList
                            data={stepCompleted.every(Boolean) ? filteredPosts : []}
                            renderItem={stepCompleted.every(Boolean)
                                ? ({ item }) => (
                                    <View style={{ backgroundColor: '#e5e5e5' }}>
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
                                            style={{ backgroundColor: '#ffffff', marginBottom: 8, borderRadius: 0 }}
                                            {...(typeof item.attachments !== 'undefined' ? { onShowAttachments: setShowAttachmentsForPost } : {})}
                                        />
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
                                )
                                : undefined
                            }
                            ListHeaderComponent={
                                <>
                                    {/* First Main Section - White Background */}
                                    <View style={{ backgroundColor: '#ffffff' }}>
                                        {!stepCompleted.every(Boolean) ? (
                                            <View style={{ paddingHorizontal: 20, marginTop: 12, paddingBottom: 32 }}>
                                                <CreatorSteps
                                                    stepCompleted={stepCompleted}
                                                    onStepComplete={handleStepComplete}
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
                                                                    <X size={14} color="#64748B" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                        {selectedPostCategory !== 'All posts' && (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4, flexShrink: 1, maxWidth: '90%' }}>
                                                                <Text style={{ color: '#181919', fontSize: fontSize.sm, marginRight: 4 }}>{selectedPostCategory}</Text>
                                                                <TouchableOpacity onPress={() => setSelectedPostCategory('All posts')} hitSlop={8}>
                                                                    <X size={14} color="#64748B" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                        {selectedTimePeriod !== 'All time' && (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4, flexShrink: 1, maxWidth: '90%' }}>
                                                                <Text style={{ color: '#181919', fontSize: fontSize.sm, marginRight: 4 }}>{selectedTimePeriod}</Text>
                                                                <TouchableOpacity onPress={() => setSelectedTimePeriod('All time')} hitSlop={8}>
                                                                    <X size={14} color="#64748B" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                        {selectedSortOrder !== 'Newest to oldest' && (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 4, flexShrink: 1, maxWidth: '90%' }}>
                                                                <Text style={{ color: '#181919', fontSize: fontSize.sm, marginRight: 4 }}>{selectedSortOrder}</Text>
                                                                <TouchableOpacity onPress={() => setSelectedSortOrder('Newest to oldest')} hitSlop={8}>
                                                                    <X size={14} color="#64748B" />
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
                                </>
                            }
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            style={{ backgroundColor: '#e5e5e5' }}
                            ListEmptyComponent={stepCompleted.every(Boolean) ? (
                                <View style={{ padding: 32, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.medium, fontSize: fontSize.lg }}>
                                        No posts found matching your filters.
                                    </Text>
                                </View>
                            ) : null}
                        />
                    </View>
                ) : activeTab === 'Collections' ? (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {/* Collections Section */}
                            <View style={{ marginTop: 0, marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 8,
                                        paddingVertical: 14,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => { /* handle create collection */ }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Create</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Vertically stacked collection cards */}
                            {(() => {
                                const collections = [
                                    {
                                        id: 'col1',
                                        name: 'You have an upcoming session.',
                                        description: 'Make Your Own Emoji',
                                        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                                        price: '9.99',
                                        postCount: 12,
                                    },
                                    {
                                        id: 'col2',
                                        name: 'Choreography Workshop',
                                        description: 'Hip-Hop Basics',
                                        image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                                        price: '14.99',
                                        postCount: 8,
                                    },
                                    {
                                        id: 'col3',
                                        name: 'Behind the Scenes',
                                        description: 'Exclusive rehearsal content',
                                        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
                                        price: '7.99',
                                        postCount: 5,
                                    },
                                ];
                                if (collections.length === 0) {
                                    return <Text style={{ color: colors.textSecondary }}>No collections yet.</Text>;
                                }
                                // Split collections into rows of 2
                                const rows = [];
                                for (let i = 0; i < collections.length; i += 2) {
                                    rows.push(collections.slice(i, i + 2));
                                }
                                return (
                                    <View style={{ marginBottom: 24 }}>
                                        {rows.map((row, rowIdx) => (
                                            <View key={rowIdx} style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                                                {row.map(col => (
                                                    <View
                                                        key={col.id}
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: '#fff',
                                                            padding: 0,
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {/* Image with badges */}
                                                        <View style={{ width: '100%', aspectRatio: 1.2, position: 'relative', backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' }}>
                                                            <Image
                                                                source={{ uri: col.image }}
                                                                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                                                resizeMode="cover"
                                                            />
                                                            {/* Title and description */}
                                                            <View>
                                                                {/* Post count badge above title */}
                                                                <View style={{
                                                                    alignSelf: 'flex-start',
                                                                    marginTop: 8,
                                                                    marginBottom: 4,
                                                                    backgroundColor: priceBadgeBg,
                                                                    borderRadius: 8,
                                                                    paddingHorizontal: 8,
                                                                    paddingVertical: 3,
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    gap: 4,
                                                                }}>
                                                                    <Folder size={15} color="#B0B3B8" style={{ marginRight: 3 }} />
                                                                    <Text style={{
                                                                        color: colors.textPrimary,
                                                                        fontFamily: fonts.bold,
                                                                        fontSize: 13,
                                                                        marginRight: 2,
                                                                    }}>{col.postCount}</Text>
                                                                    <Text style={{
                                                                        color: colors.textSecondary,
                                                                        fontFamily: fonts.medium,
                                                                        fontSize: 12,
                                                                    }}>posts</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        {/* Title and description */}
                                                        <View>
                                                            <Text
                                                                style={{
                                                                    color: colors.textPrimary,
                                                                    fontFamily: fonts.medium,
                                                                    fontSize: 16,
                                                                    marginBottom: 2,
                                                                    marginTop: 8,
                                                                }}
                                                                numberOfLines={1}
                                                                ellipsizeMode="tail"
                                                            >
                                                                {col.name}
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: colors.textSecondary,
                                                                    fontFamily: fonts.medium,
                                                                    fontSize: 14,
                                                                }}
                                                                numberOfLines={2}
                                                                ellipsizeMode="tail"
                                                            >
                                                                {col.description}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                {/* If row has only one item, add a spacer to keep grid alignment */}
                                                {row.length === 1 && <View style={{ flex: 1 }} />}
                                            </View>
                                        ))}
                                    </View>
                                );
                            })()}
                            {/* Divider */}
                            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 20, width: '100%' }} />
                            {/* Tags Section */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 16 }}>
                                <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>
                                    Tags
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        borderColor: colors.primary,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        paddingVertical: 14,
                                        paddingHorizontal: 24,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'transparent',
                                    }}
                                    onPress={() => { /* handle create collection with tags */ }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ color: colors.primary, fontFamily: fonts.medium, fontSize: 16 }}>Create with Tags</Text>
                                </TouchableOpacity>
                            </View>
                            {(() => {
                                const mockPosts = [
                                    { tags: ['dance', 'performance', 'live'] },
                                    { tags: ['tutorial', 'dance'] },
                                    { tags: ['behindthescenes', 'rehearsal', 'dance'] },
                                    { tags: ['workshop', 'community', 'learning'] },
                                    { tags: ['performance', 'contemporary'] },
                                ];
                                const tagCounts: Record<string, number> = {};
                                mockPosts.forEach(post => {
                                    if (post.tags && Array.isArray(post.tags)) {
                                        post.tags.forEach(tag => {
                                            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                                        });
                                    }
                                });
                                const tags = Object.entries(tagCounts) as [string, number][];
                                if (tags.length === 0) {
                                    return <Text style={{ color: colors.textSecondary }}>No tags yet.</Text>;
                                }
                                return (
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 6, rowGap: 6 }}>
                                        {tags.map(([tag, count]) => (
                                            <View
                                                key={tag}
                                                style={{
                                                    backgroundColor: '#f1f5f9',
                                                    borderRadius: 12,
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 14,
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    minWidth: 60,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text style={{ color: '#181919', fontWeight: '600', marginRight: 6 }}>{tag}</Text>
                                                <View style={{
                                                    backgroundColor: '#E5E7EB',
                                                    borderRadius: 8,
                                                    paddingHorizontal: 7,
                                                    paddingVertical: 2,
                                                    minWidth: 18,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Text style={{ color: '#64748B', fontWeight: '500', fontSize: 13 }}>{count}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })()}
                        </ScrollView>
                    </View>
                ) : activeTab === 'Chat' ? (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {/* Create Chat Group Button */}
                            <View style={{ marginTop: 0, marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 8,
                                        paddingVertical: 14,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => { /* handle create chat group */ }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Create</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Chat Groups List */}
                            {(() => {
                                const chatGroups = [
                                    {
                                        id: 'chat1',
                                        name: 'Hip-Hop Fans',
                                        description: 'Discuss all things hip-hop dance!',
                                        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                                        members: 34,
                                        access: 'all',
                                    },
                                    {
                                        id: 'chat2',
                                        name: 'Beginner Dancers',
                                        description: 'A place for newcomers to ask questions.',
                                        image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                                        members: 18,
                                        access: 'paid',
                                    },
                                    {
                                        id: 'chat3',
                                        name: 'Choreo Creators',
                                        description: 'Share your latest choreography ideas.',
                                        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
                                        members: 22,
                                        access: 'Gold Tier',
                                    },
                                ];
                                if (chatGroups.length === 0) {
                                    return <Text style={{ color: colors.textSecondary }}>No chat groups yet.</Text>;
                                }
                                return (
                                    <View style={{ marginBottom: 24 }}>
                                        {chatGroups.map((group) => (
                                            <View
                                                key={group.id}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: 10,
                                                    marginBottom: 20,
                                                    flexDirection: 'row',
                                                    overflow: 'hidden',
                                                    alignItems: 'stretch',
                                                }}
                                            >
                                                {/* Image */}
                                                <View style={{
                                                    width: 100,
                                                    aspectRatio: 1,
                                                    backgroundColor: '#eee',
                                                    borderRadius: 10,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                }}>
                                                    <Image
                                                        source={{ uri: group.image }}
                                                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                                {/* Info section */}
                                                <View style={{
                                                    flex: 1,
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 14,
                                                    borderTopRightRadius: 10,
                                                    borderBottomRightRadius: 10,
                                                    borderTopLeftRadius: 0,
                                                    borderBottomLeftRadius: 0,
                                                    backgroundColor: '#fff',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Text
                                                        style={{
                                                            color: colors.textPrimary,
                                                            fontFamily: fonts.medium,
                                                            fontSize: 16,
                                                            marginBottom: 2,
                                                            marginTop: 8,
                                                        }}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {group.name}
                        </Text>
                                                    <Text
                                                        style={{
                            color: colors.textSecondary,
                                                            fontFamily: fonts.medium,
                                                            fontSize: 14,
                                                        }}
                                                        numberOfLines={2}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {group.description}
                        </Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 }}>
                                                        {/* Members count badge */}
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                                                            <User size={15} color="#B0B3B8" style={{ marginRight: 5 }} />
                                                            <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: 13, marginRight: 2 }}>{group.members}</Text>
                                                            <Text style={{ color: colors.textSecondary, fontFamily: fonts.medium, fontSize: 12 }}>members</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })()}
                        </ScrollView>
                    </View>
                ) : activeTab === 'Shop' ? (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {/* Create Product Button */}
                            <View style={{ marginTop: 0, marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 8,
                                        paddingVertical: 14,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => { /* handle create product */ }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Add product</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Product Cards List */}
                            {(() => {
                                const products = [
                                    {
                                        id: 'prod1',
                                        name: 'Dance T-Shirt',
                                        description: 'High quality cotton t-shirt with dance logo.',
                                        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
                                        price: '$24.99',
                                        access: 'all',
                                    },
                                    {
                                        id: 'prod2',
                                        name: 'Workshop Pass',
                                        description: 'Access to the next online dance workshop.',
                                        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
                                        price: '$49.99',
                                        access: 'paid',
                                    },
                                    {
                                        id: 'prod3',
                                        name: 'Gold Hoodie',
                                        description: 'Exclusive hoodie for Gold Tier members.',
                                        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
                                        price: '$59.99',
                                        access: 'Gold Tier',
                                    },
                                ];
                                if (products.length === 0) {
                                    return <Text style={{ color: colors.textSecondary }}>No products in your shop yet.</Text>;
                                }
                                // Split products into rows of 2
                                const rows = [];
                                for (let i = 0; i < products.length; i += 2) {
                                    rows.push(products.slice(i, i + 2));
                                }
                                return (
                                    <View style={{ marginBottom: 24 }}>
                                        {rows.map((row, rowIdx) => (
                                            <View key={rowIdx} style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                                                {row.map(product => (
                                                    <View
                                                        key={product.id}
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: '#fff',
                                                            padding: 0,
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                            borderRadius: 10,
                                                        }}
                                                    >
                                                        {/* Image */}
                                                        <View style={{ width: '100%', aspectRatio: 1.2, position: 'relative', backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' }}>
                                                            <Image
                                                                source={{ uri: product.image }}
                                                                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                                                resizeMode="cover"
                                                            />
                                                        </View>
                                                        {/* Info section below image */}
                                                        <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12, minHeight: 90 }}>
                                                            <Text
                                                                style={{
                                                                    color: colors.textPrimary,
                                                                    fontFamily: fonts.medium,
                                                                    fontSize: 16,
                                                                    marginBottom: 2,
                                                                    marginTop: 8,
                                                                }}
                                                                numberOfLines={1}
                                                                ellipsizeMode="tail"
                                                            >
                                                                {product.name}
                                                            </Text>
                                                            <Text
                                                                style={{
                            color: colors.textSecondary,
                                                                    fontFamily: fonts.medium,
                                                                    fontSize: 14,
                            marginBottom: 8,
                                                                }}
                                                                numberOfLines={2}
                                                                ellipsizeMode="tail"
                                                            >
                                                                {product.description}
                        </Text>
                                                            {/* Edit and Kebab menu buttons below description, tightly spaced */}
                                                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 0, marginBottom: 0 }}>
                                                                <TouchableOpacity
                                                                    style={{
                                                                        backgroundColor: colors.primary,
                                                                        borderRadius: 8,
                                                                        paddingHorizontal: 14,
                                                                        paddingVertical: 6,
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                    onPress={() => { /* handle edit product */ }}
                                                                    activeOpacity={0.85}
                                                                >
                                                                    <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 13 }}>Edit</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity
                                                                    style={{
                                                                        backgroundColor: '#f1f5f9',
                                                                        borderRadius: 8,
                                                                        width: 36,
                                                                        height: 36,
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                    onPress={() => { /* handle kebab menu */ }}
                                                                    activeOpacity={0.85}
                                                                >
                                                                    <Text style={{ color: '#64748B', fontSize: 18, fontWeight: 'bold' }}>⋮</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                                {/* If row has only one item, add a spacer to keep grid alignment */}
                                                {row.length === 1 && <View style={{ flex: 1 }} />}
                                            </View>
                                        ))}
                                    </View>
                                );
                            })()}
                        </ScrollView>
                    </View>
                ) : activeTab === 'Memberships' ? (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {/* Create Membership Button */}
                            <View style={{ marginTop: 0, marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 8,
                                        paddingVertical: 14,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => { /* handle create membership */ }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Create tier</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Memberships Cards Grid (same as Collections) */}
                            {(() => {
                                const memberships = [
                                    {
                                        id: 'mem1',
                                        name: 'Gold Membership',
                                        description: 'Access to exclusive gold content and perks.',
                                        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                                        price: '19.99',
                                        postCount: 24,
                                        members: 120,
                                    },
                                    {
                                        id: 'mem2',
                                        name: 'Silver Membership',
                                        description: 'Special content for silver tier members.',
                                        image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                                        price: '9.99',
                                        postCount: 12,
                                        members: 80,
                                    },
                                    {
                                        id: 'mem3',
                                        name: 'Bronze Membership',
                                        description: 'Basic access to member-only posts.',
                                        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
                                        price: '4.99',
                                        postCount: 5,
                                        members: 40,
                                    },
                                ];
                                if (memberships.length === 0) {
                                    return <Text style={{ color: colors.textSecondary }}>No memberships created yet.</Text>;
                                }
                                return (
                                    <View style={{ marginBottom: 24 }}>
                                        <FlatList
                                            data={memberships}
                                            keyExtractor={item => item.id}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            pagingEnabled
                                            snapToAlignment="start"
                                            decelerationRate="fast"
                                            onScroll={e => {
                                                const idx = Math.round(e.nativeEvent.contentOffset.x / (e.nativeEvent.layoutMeasurement.width));
                                                setActiveMembershipIdx(idx);
                                            }}
                                            scrollEventThrottle={16}
                                            style={{ marginBottom: 16 }}
                                            renderItem={({ item: mem, index: idx }) => (
                                                <View
                                                    key={mem.id}
                                                    style={{
                                                        width: 300,
                                                        marginRight: 16,
                                                        backgroundColor: '#fff',
                                                        padding: 0,
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {/* Image with overlay badges and kebab menu */}
                                                    <View style={{ width: '100%', aspectRatio: 1.2, position: 'relative', backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' }}>
                                                        <Image
                                                            source={{ uri: mem.image }}
                                                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                                            resizeMode="cover"
                                                        />
                                                        {/* Overlay badges container */}
                                                        <View style={{
                                                            position: 'absolute',
                                                            top: 10,
                                                            left: 10,
                                                            zIndex: 3,
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start',
                                                            gap: 6,
                                                        }}>
                                                            {/* Free trial badge */}
                                                            <View style={{
                                                                backgroundColor: '#d1fae5',
                                                                borderRadius: 999,
                                                                paddingHorizontal: 12,
                                                                paddingVertical: 4,
                                                                marginBottom: 4,
                                                            }}>
                                                                <Text style={{ color: '#047857', fontWeight: '600', fontSize: 13 }}>Free trial - 7d</Text>
                                                            </View>
                                                            {/* Members count badge */}
                                                            <View style={{
                                                                backgroundColor: '#d1fae5',
                                                                borderRadius: 999,
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 4,
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                            }}>
                                                                <User size={15} color={'#047857'} style={{ marginRight: 4 }} />
                                                                <Text style={{ color: '#047857', fontWeight: '600', fontSize: 13 }}>{mem.members}</Text>
                                                            </View>
                                                        </View>
                                                        {/* Kebab menu button at top right */}
                                                        <TouchableOpacity
                                                            style={{
                                                                position: 'absolute',
                                                                top: 10,
                                                                right: 10,
                                                                backgroundColor: '#f1f5f9',
                                                                borderRadius: 8,
                                                                width: 36,
                                                                height: 36,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                zIndex: 2,
                                                            }}
                                                            onPress={() => { /* handle kebab menu */ }}
                                                            activeOpacity={0.85}
                                                        >
                                                            <Text style={{ color: '#64748B', fontSize: 18, fontWeight: 'bold' }}>⋮</Text>
                                                        </TouchableOpacity>
                                                        {/* Post count badge above title */}
                                                        <View style={{
                                                            alignSelf: 'flex-start',
                                                            marginTop: 8,
                                                            marginBottom: 4,
                                                            backgroundColor: priceBadgeBg,
                                                            borderRadius: 8,
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 3,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                        }}>
                                                            <Folder size={15} color="#B0B3B8" style={{ marginRight: 3 }} />
                                                            <Text style={{
                                                                color: colors.textPrimary,
                                                                fontFamily: fonts.bold,
                                                                fontSize: 13,
                                                                marginRight: 2,
                                                            }}>{mem.postCount}</Text>
                        <Text style={{
                            color: colors.textSecondary,
                                                                fontFamily: fonts.medium,
                                                                fontSize: 12,
                                                            }}>posts</Text>
                                                        </View>
                                                    </View>
                                                    {/* Title and description */}
                                                    <View>
                                                        <Text
                                                            style={{
                                                                color: colors.textPrimary,
                                                                fontFamily: fonts.medium,
                                                                fontSize: 16,
                                                                marginBottom: 2,
                                                                marginTop: 8,
                                                            }}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {mem.name}
                        </Text>
                                                        <Text
                                                            style={{
                            color: colors.textSecondary,
                                                                fontFamily: fonts.medium,
                                                                fontSize: 14,
                                                                marginBottom: 10,
                                                            }}
                                                            numberOfLines={2}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {mem.description}
                        </Text>
                                                        {/* View details button below description */}
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                borderColor: colors.primary,
                                                                borderWidth: 1.5,
                                                                borderRadius: 8,
                                                                paddingVertical: 10,
                                                                paddingHorizontal: 24,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginTop: 2,
                                                                alignSelf: 'flex-start',
                                                            }}
                                                            onPress={() => { /* handle view details */ }}
                                                            activeOpacity={0.85}
                                                        >
                                                            <Text style={{ color: colors.primary, fontFamily: fonts.medium, fontSize: 15 }}>View details</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                        {/* Pagination dots */}
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 18, gap: 8 }}>
                                            {memberships.map((_, idx) => (
                                                <View
                                                    key={idx}
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: idx === activeMembershipIdx ? colors.primary : '#e5e7eb',
                                                        marginHorizontal: 4,
                                                    }}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                );
                            })()}
                        </ScrollView>
                    </View>
                ) : activeTab === 'About' ? (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {/* Intro Video Section */}
                            <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
                                Introduction
                            </Text>
                            
                            {/* YouTube Video Embed */}
                            <View style={{ width: '100%', aspectRatio: 16/9, backgroundColor: '#eee', borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
                                <TouchableOpacity 
                                    style={{ width: '100%', height: '100%' }}
                                    onPress={() => {
                                        const videoId = 'BNEmDcQr6hk';
                                        // Normally we would open this video in a web view or using an external app
                                        console.log(`Opening YouTube video: ${videoId}`);
                                    }}
                                >
                                    <Image
                                        source={{ uri: `https://img.youtube.com/vi/BNEmDcQr6hk/maxresdefault.jpg` }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                    {/* Play button overlay */}
                                    <View style={{ 
                                        position: 'absolute', 
                                        top: 0, left: 0, right: 0, bottom: 0, 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.2)'
                                    }}>
                                        <View style={{
                                            width: 70,
                                            height: 70,
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            borderRadius: 35,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <View style={{
                                                width: 0,
                                                height: 0,
                                                borderStyle: 'solid',
                                                borderLeftWidth: 20,
                                                borderTopWidth: 12,
                                                borderBottomWidth: 12,
                                                borderLeftColor: colors.primary,
                                                borderTopColor: 'transparent',
                                                borderBottomColor: 'transparent',
                                                marginLeft: 5
                                            }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Description Section */}
                            <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
                                About Me
                            </Text>
                            <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 24, lineHeight: 24 }}>
                                Award-winning digital artist & creator with over 10 years of professional experience in contemporary dance. I specialize in creating compelling dance performances and tutorials that blend traditional techniques with modern innovation.
                                {'\n\n'}
                                My mission is to make dance accessible to everyone, from beginners to professionals. Through my tutorials, live performances, and behind-the-scenes content, I aim to inspire and educate dance enthusiasts worldwide.
                                {'\n\n'}
                                Join me on this creative journey as I share my passion for dance, movement, and artistic expression.
                            </Text>
                            
                            {/* Social Links Section */}
                            <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
                                Connect With Me
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, gap: 12 }}>
                                {[
                                    { Icon: Instagram, label: 'Instagram', url: 'https://instagram.com/dancestudio' },
                                    { Icon: Youtube, label: 'YouTube', url: 'https://youtube.com/dancestudio' },
                                    { Icon: Twitter, label: 'Twitter', url: 'https://twitter.com/dancestudio' },
                                    { Icon: Facebook, label: 'Facebook', url: 'https://facebook.com/dancestudio' },
                                    { Icon: LinkIcon, label: 'Website', url: 'https://dancestudio.com' }
                                ].map((item, idx) => (
                                    <TouchableOpacity 
                                        key={idx}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: colors.surface,
                                            borderRadius: 8,
                                            paddingVertical: 12,
                                            paddingHorizontal: 16,
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                        }}
                                        onPress={() => {
                                            // Handle opening social link
                                            console.log(`Opening ${item.url}`);
                                        }}
                                    >
                                        <item.Icon size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                                        <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary }}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            
                            {/* Stats Section */}
                            <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
                                Stats
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                                {[
                                    { label: 'Posts', value: '215', icon: 'FileText' },
                                    { label: 'Total Members', value: '523', icon: 'User' },
                                    { label: 'Paid Members', value: '128', icon: 'Lock' },
                                    { label: 'Monthly Revenue', value: '$2,840', icon: 'Gift' }
                                ].map((item, idx) => {
                                    const IconComponent = item.icon === 'FileText' ? FileText : 
                                                        item.icon === 'User' ? User : 
                                                        item.icon === 'Lock' ? Lock : Gift;
                                    
                                    return (
                                        <View 
                                            key={idx}
                                            style={{ 
                                                flex: 1, 
                                                minWidth: '45%', 
                                                backgroundColor: colors.surface,
                                                borderRadius: 12,
                                                padding: 16,
                                                borderWidth: 1,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                <IconComponent size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
                                                <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary }}>
                                                    {item.label}
                                                </Text>
                                            </View>
                                            <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary }}>
                                                {item.value}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                ) : activeTab === 'Recommendation' ? (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
                        <ScrollView 
                            contentContainerStyle={{ padding: 20 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Search and Add Recommendation Section */}
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
                                    Add Recommendation
                                </Text>
                                
                                {/* Search Bar */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.surface,
                                    borderRadius: 8,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    marginBottom: 16
                                }}>
                                    <TextInput
                                        placeholder="Search for creators to recommend..."
                                        style={{
                                            flex: 1,
                                            color: colors.textPrimary,
                                            fontFamily: fonts.regular,
                                            fontSize: fontSize.md,
                                        }}
                                        onChangeText={(text) => {
                                            // In a real app, this would trigger search as user types
                                            console.log('Searching for:', text);
                                        }}
                                    />
                                </View>
                                
                                {/* Mock Search Results */}
                                <View style={{ marginBottom: 24 }}>
                                    {[
                                        {
                                            id: 'c1',
                                            name: 'Emily Johnson',
                                            avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
                                            headline: 'Contemporary dance instructor & choreographer'
                                        },
                                        {
                                            id: 'c2',
                                            name: 'Michael Chen',
                                            avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
                                            headline: 'Filmmaker & visual storyteller'
                                        },
                                        {
                                            id: 'c3',
                                            name: 'Sarah Williams',
                                            avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
                                            headline: 'Digital artist & design educator'
                                        }
                                    ].map((creator, index) => (
                                        <TouchableOpacity
                                            key={creator.id}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                padding: 12,
                                                borderBottomWidth: 1,
                                                borderBottomColor: index === 2 ? 'transparent' : colors.border,
                                                backgroundColor: index === 0 ? `${colors.primary}10` : 'transparent',
                                                borderRadius: 8,
                                                marginBottom: 8,
                                            }}
                                            onPress={() => {
                                                // Select this creator
                                                console.log('Selected creator:', creator.name);
                                            }}
                                        >
                                            <Image
                                                source={{ uri: creator.avatar }}
                                                style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
                                            />
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 4 }}>
                                                    {creator.name}
                                                </Text>
                                                <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary }}>
                                                    {creator.headline}
                                                </Text>
                                            </View>
                                            {index === 0 && (
                                                <CheckCircle size={24} color={colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                
                                {/* Recommendation Form */}
                                <View style={{
                                    backgroundColor: colors.surface,
                                    borderRadius: 12,
                                    padding: 16,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    marginBottom: 24
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                        <Image
                                            source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }}
                                            style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 4 }}>
                                                Emily Johnson
                                            </Text>
                                            <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary }}>
                                                Contemporary dance instructor & choreographer
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 8 }}>
                                        Why are you recommending this creator?
                                    </Text>
                                    
                                    <TextInput
                                        placeholder="Write your recommendation here..."
                                        multiline
                                        numberOfLines={5}
                                        textAlignVertical="top"
                                        style={{
                                            backgroundColor: '#fff',
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                            borderRadius: 8,
                                            padding: 12,
                                            fontFamily: fonts.regular,
                                            fontSize: fontSize.md,
                                            color: colors.textPrimary,
                                            minHeight: 120,
                                            marginBottom: 16
                                        }}
                                    />
                                    
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                                        <TouchableOpacity
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 20,
                                                borderRadius: 8,
                                                backgroundColor: 'transparent'
                                            }}
                                        >
                                            <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary }}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 20,
                                                borderRadius: 8,
                                                backgroundColor: colors.primary
                                            }}
                                        >
                                            <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.buttonText }}>
                                                Add Recommendation
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Existing Recommendations Section */}
                            <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
                                Your Recommendations
                            </Text>
                            
                            {/* List of existing recommendations */}
                            {[
                                {
                                    id: 'r1',
                                    creator: {
                                        name: 'Emily Johnson',
                                        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
                                        headline: 'Contemporary dance instructor & choreographer'
                                    },
                                    text: "Emily's dance tutorials completely transformed my teaching methods. Her approach to combining traditional techniques with modern styles is revolutionary. I especially appreciate her emphasis on proper form and the cultural context of different dance styles. Highly recommend to any dance educator!",
                                    date: '2 days ago'
                                },
                                {
                                    id: 'r2',
                                    creator: {
                                        name: 'Michael Chen',
                                        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
                                        headline: 'Filmmaker & visual storyteller'
                                    },
                                    text: "Michael's film techniques and storytelling workshops have been incredibly valuable for my own creative projects. His eye for composition and lighting is unmatched, and he shares his knowledge in a way that's accessible to creators at any level.",
                                    date: '1 week ago'
                                }
                            ].map((recommendation) => (
                                <View 
                                    key={recommendation.id}
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderRadius: 12,
                                        padding: 16,
                                        borderWidth: 1,
                                        borderColor: colors.border,
                                        marginBottom: 16
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                                        <Image
                                            source={{ uri: recommendation.creator.avatar }}
                                            style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 2 }}>
                                                {recommendation.creator.name}
                                            </Text>
                                            <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 2 }}>
                                                {recommendation.creator.headline}
                                            </Text>
                                            <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary }}>
                                                {recommendation.date}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.textPrimary, lineHeight: 22 }}>
                                        {recommendation.text}
                                    </Text>
                                    
                                    <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                padding: 8,
                                                backgroundColor: '#f1f5f9',
                                                borderRadius: 8
                                            }}
                                        >
                                            <Pencil size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                                            <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.textSecondary }}>
                                                Edit
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }} />
                )}

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
            </ScrollView>
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