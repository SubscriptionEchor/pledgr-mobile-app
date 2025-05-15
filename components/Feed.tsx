import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Pressable, Modal, Animated, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { ReportPostModal } from './ReportPostModal';
import { BlockUserModal } from './BlockUserModal';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/hooks/useTheme';
import { ShareModal } from './ShareModal';
import { useDownload } from '@/lib/context/DownloadContext';

// Add PollOption type
type PollOption = {
  id: string;
  text: string;
  votes: number;
  voted: boolean;
};

// Update Poll type to include selection type
type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endTime?: string;
  hasVoted: boolean;
  selectionType: 'single' | 'multiple';
};

// Add new types for comments
type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  time: string;
  likes: number;
  replies: Comment[];
};

// Add to existing types at the top
type ImagePost = {
  id: string;
  type: 'image';
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  time: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  shares: number;
};

// Add to existing types
type Attachment = {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  name: string;
  size?: string;
  thumbnail?: string;
};

// Add to existing types
type Post = {
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
  isLocked?: boolean;
  attachments?: Attachment[];
  // ... other existing properties
};

// Add sample attachments data
const sampleAttachments = [
  {
    id: 'att1',
    type: 'document',
    url: 'https://example.com/doc1.pdf',
    name: 'Project Plan.pdf',
    size: '2.5 MB'
  },
  {
    id: 'att2',
    type: 'image',
    url: 'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png',
    name: 'Screenshot.png',
    thumbnail: 'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png'
  },
  {
    id: 'att3',
    type: 'video',
    url: 'https://example.com/video1.mp4',
    name: 'Demo.mp4',
    thumbnail: 'https://cdn.midjourney.com/e6d46adc-55ad-46a8-9306-7b558aadd2a3/0_2.png'
  },
  {
    id: 'att4',
    type: 'audio',
    url: 'https://example.com/audio1.mp3',
    name: 'Interview.mp3',
    size: '5.2 MB'
  },
  {
    id: 'att5',
    type: 'document',
    url: 'https://example.com/doc2.pdf',
    name: 'Research Paper.pdf',
    size: '1.8 MB'
  },
  {
    id: 'att6',
    type: 'image',
    url: 'https://cdn.midjourney.com/e6d46adc-55ad-46a8-9306-7b558aadd2a3/0_0.png',
    name: 'Design.png',
    thumbnail: 'https://cdn.midjourney.com/e6d46adc-55ad-46a8-9306-7b558aadd2a3/0_0.png'
  }
];

// Update mockPosts to include random attachments
const mockPosts = [
  {
    id: '1',
    type: 'text',
    creator: {
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      verified: true,
    },
    time: '30 minutes ago',
    title: 'The Future of Music',
    content: 'Music is evolving at an unprecedented pace. With the rise of AI and new technologies, we\'re seeing a revolution in how music is created, distributed, and consumed. What do you think about these changes?',
    attachments: [sampleAttachments[0], sampleAttachments[1], sampleAttachments[2]],
    likes: 1200,
    comments: 450,
    shares: 200,
  },
  {
    id: '2',
    type: 'text',
    creator: {
      name: 'Sarah Smith',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      verified: true,
    },
    time: '1 hour ago',
    title: 'My Journey in Music Production',
    content: 'Started my journey in music production 5 years ago. The learning curve was steep, but the rewards have been incredible. Here are some key lessons I\'ve learned along the way...',
    attachments: [sampleAttachments[3], sampleAttachments[4]],
    likes: 800,
    comments: 150,
    shares: 75,
  },
  {
    id: '3',
    type: 'video',
    creator: {
      name: 'Music Channel',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
    },
    time: '1 hour ago',
    title: 'Amazing Performance',
    content: 'Check out this incredible live performance!',
    videoUrl: 'https://youtu.be/ayI4maYu_jQ?si=hjFaOC99mKUodo_v',
    attachments: [sampleAttachments[5], sampleAttachments[0], sampleAttachments[1], sampleAttachments[2]],
    likes: 5000,
    comments: 1200,
    shares: 800,
  },
  {
    id: '4',
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
    attachments: [sampleAttachments[3], sampleAttachments[4], sampleAttachments[5]],
    likes: 3200,
    comments: 800,
    shares: 400,
  },
  {
    id: '5',
    type: 'video',
    creator: {
      name: 'Music Producer',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      verified: true,
    },
    time: '3 hours ago',
    title: 'Behind the Scenes',
    content: 'See how we made this track!',
    videoUrl: 'https://youtu.be/OTov04ChgZ8?si=c9u7c3e1zaQbQ8_Y',
    attachments: [sampleAttachments[0], sampleAttachments[1]],
    likes: 4100,
    comments: 950,
    shares: 600,
  },
  {
    id: '6',
    type: 'video',
    creator: {
      name: 'Live Performance',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      verified: true,
    },
    time: '4 hours ago',
    title: 'Live Concert',
    content: 'Full concert recording from last night!',
    videoUrl: 'https://youtu.be/Lb6v6AUFWrM?si=wAvnrzEKW5CD4-x1',
    attachments: [sampleAttachments[2], sampleAttachments[3], sampleAttachments[4], sampleAttachments[5]],
    likes: 2900,
    comments: 700,
    shares: 350,
  },
  {
    id: '7',
    type: 'video',
    creator: {
      name: 'Music Channel',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      verified: true,
    },
    time: '5 hours ago',
    title: 'New Music Video',
    content: 'Premiere of our latest music video!',
    videoUrl: 'https://youtu.be/DVqFyinDgE4?si=N8MWX8pVp5fZUOZA',
    attachments: [sampleAttachments[0], sampleAttachments[1], sampleAttachments[2], sampleAttachments[3], sampleAttachments[4]],
    likes: 6100,
    comments: 2100,
    shares: 1200,
  },
  {
    id: '8',
    type: 'audio',
    creator: {
      name: 'DJ Mix Master',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      verified: true,
    },
    time: '20 minutes ago',
    title: 'Summer Vibes Mix 2024',
    content: 'My latest summer mix featuring the hottest tracks of the season. Perfect for your beach party!',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '45:30',
    attachments: [sampleAttachments[5], sampleAttachments[0]],
    likes: 2500,
    comments: 320,
    shares: 450,
  },
  {
    id: '9',
    type: 'audio',
    creator: {
      name: 'Podcast Host',
      avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
      verified: true,
    },
    time: '1 hour ago',
    title: 'Music Industry Insights',
    content: 'In this episode, we discuss the latest trends in the music industry and what\'s coming next.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '32:15',
    attachments: [sampleAttachments[1], sampleAttachments[2], sampleAttachments[3]],
    likes: 1800,
    comments: 240,
    shares: 180,
  },
  {
    id: '10',
    type: 'poll',
    creator: {
      name: 'Music Community',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      verified: true,
    },
    time: '2 hours ago',
    title: 'Music Genre Poll',
    content: 'What\'s your favorite music genre for summer 2024?',
    poll: {
      id: 'poll1',
      question: 'What\'s your favorite music genre for summer 2024?',
      options: [
        { id: 'opt1', text: 'Hip Hop', votes: 450, voted: false },
        { id: 'opt2', text: 'Electronic', votes: 320, voted: false },
        { id: 'opt3', text: 'Rock', votes: 280, voted: false },
        { id: 'opt4', text: 'Pop', votes: 390, voted: false },
      ],
      totalVotes: 1440,
      endTime: '2024-06-01T00:00:00Z',
      hasVoted: false,
      selectionType: 'single' as const,
    },
    attachments: [sampleAttachments[4], sampleAttachments[5]],
    likes: 1200,
    comments: 450,
    shares: 200,
  },
  {
    id: '11',
    type: 'poll',
    creator: {
      name: 'Music Festival',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      verified: true,
    },
    time: '3 hours ago',
    title: 'Festival Preferences',
    content: 'Select all the features you\'d like to see at our next festival!',
    poll: {
      id: 'poll2',
      question: 'Select all the features you\'d like to see at our next festival!',
      options: [
        { id: 'opt1', text: 'Food Trucks', votes: 780, voted: false },
        { id: 'opt2', text: 'Art Installations', votes: 650, voted: false },
        { id: 'opt3', text: 'Camping Area', votes: 920, voted: false },
        { id: 'opt4', text: 'Silent Disco', votes: 540, voted: false },
        { id: 'opt5', text: 'Workshop Zone', votes: 480, voted: false },
      ],
      totalVotes: 3370,
      endTime: '2024-06-15T00:00:00Z',
      hasVoted: false,
      selectionType: 'multiple' as const,
    },
    attachments: [sampleAttachments[0], sampleAttachments[1], sampleAttachments[2], sampleAttachments[3]],
    likes: 1800,
    comments: 240,
    shares: 180,
  },
  {
    id: '12',
    type: 'image',
    creator: {
      name: 'Photography Pro',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
    },
    time: '2 hours ago',
    title: 'Nature Photography',
    content: 'Captured these beautiful moments during my morning hike. Nature never fails to amaze me!',
    images: [
      'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png',
      'https://cdn.midjourney.com/e6d46adc-55ad-46a8-9306-7b558aadd2a3/0_2.png',
      'https://cdn.midjourney.com/e6d46adc-55ad-46a8-9306-7b558aadd2a3/0_0.png'
    ],
    attachments: [sampleAttachments[4], sampleAttachments[5]],
    likes: 1200,
    comments: 450,
    shares: 200,
  },
  {
    id: '13',
    type: 'image',
    creator: {
      name: 'Travel Enthusiast',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
    },
    time: '3 hours ago',
    title: 'City Views',
    content: 'The city looks magical at sunset!',
    images: [
      'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png'
    ],
    attachments: [sampleAttachments[0], sampleAttachments[1], sampleAttachments[2]],
    likes: 800,
    comments: 150,
    shares: 75,
  },
  {
    id: '14',
    type: 'image',
    creator: {
      name: 'Premium Content',
      avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
      verified: true,
    },
    time: '1 hour ago',
    title: 'Exclusive Photos',
    content: 'Check out these exclusive behind-the-scenes photos!',
    images: [
      'https://cdn.midjourney.com/99433f36-ab90-435d-a6d1-67ea13e5fd8a/0_3.png',
      'https://cdn.midjourney.com/e6d46adc-55ad-46a8-9306-7b558aadd2a3/0_2.png'
    ],
    isLocked: true,
    attachments: [sampleAttachments[3], sampleAttachments[4], sampleAttachments[5]],
    likes: 500,
    comments: 120,
    shares: 50,
  },
  {
    id: '15',
    type: 'video',
    creator: {
      name: 'Premium Creator',
      avatar: 'https://randomuser.me/api/portraits/men/66.jpg',
      verified: true,
    },
    time: '2 hours ago',
    title: 'Exclusive Video',
    content: 'Watch this exclusive video content!',
    videoUrl: 'https://youtu.be/ayI4maYu_jQ?si=hjFaOC99mKUodo_v',
    isLocked: true,
    attachments: [sampleAttachments[0], sampleAttachments[1], sampleAttachments[2], sampleAttachments[3]],
    likes: 800,
    comments: 200,
    shares: 100,
  }
];

// Function to extract YouTube video ID from URL
function getYoutubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Function to get YouTube thumbnail URL
function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function formatCount(count: number) {
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
}

// Add VideoPlayer component
const VideoPlayer = ({ videoId, isVisible, onClose }: { videoId: string; isVisible: boolean; onClose: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.videoPlayerModal}>
        <View style={styles.videoPlayerContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
          <YoutubePlayer
            height={300}
            width={Dimensions.get('window').width - 32}
            play={isPlaying}
            videoId={videoId}
            onChangeState={(state: 'playing' | 'paused' | 'ended' | 'buffering' | 'unstarted') => {
              if (state === 'ended') {
                setIsPlaying(false);
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

// Update LockedContentOverlay component
const LockedContentOverlay = ({ onUnlock }: { onUnlock: () => void }) => (
  <View style={styles.lockedOverlay}>
    <Feather name="lock" size={32} color="#fff" />
    <Text style={styles.lockedText}>Locked Content</Text>
    <TouchableOpacity 
      style={styles.unlockButton}
      onPress={onUnlock}
    >
      <Text style={styles.unlockButtonText}>Unlock Content</Text>
    </TouchableOpacity>
  </View>
);

// Update getFileTypeIcon function to use theme colors
const getFileTypeIcon = (fileName: string, colors: any): { icon: keyof typeof Feather.glyphMap; color: string; bgColor: string } => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return { icon: 'file-text', color: '#EF4444', bgColor: '#F1F5F9' };
    case 'doc':
    case 'docx':
      return { icon: 'file-text', color: '#3B82F6', bgColor: '#F1F5F9' };
    case 'xls':
    case 'xlsx':
      return { icon: 'file-text', color: '#10B981', bgColor: '#F1F5F9' };
    case 'ppt':
    case 'pptx':
      return { icon: 'file-text', color: '#F59E0B', bgColor: '#F1F5F9' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return { icon: 'image', color: '#8B5CF6', bgColor: '#F1F5F9' };
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'wmv':
      return { icon: 'video', color: '#EC4899', bgColor: '#F1F5F9' };
    case 'mp3':
    case 'wav':
    case 'ogg':
      return { icon: 'music', color: '#6366F1', bgColor: '#F1F5F9' };
    case 'zip':
    case 'rar':
    case '7z':
      return { icon: 'archive', color: '#F97316', bgColor: '#F1F5F9' };
    default:
      return { icon: 'file', color: '#64748B', bgColor: '#F1F5F9' };
  }
};

// Update AttachmentsList component
const AttachmentsList = ({ attachments }: { attachments: Attachment[] }) => {
  const { colors } = useTheme();
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const displayAttachments = attachments;

  const handleDownload = async (attachment: Attachment) => {
    try {
      setDownloading(prev => ({ ...prev, [attachment.id]: true }));
      const fileUri = attachment.url;
      const downloadResult = await FileSystem.downloadAsync(
        fileUri,
        FileSystem.documentDirectory + attachment.name
      );

      if (downloadResult.status === 200) {
        await Sharing.shareAsync(downloadResult.uri);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setDownloading(prev => ({ ...prev, [attachment.id]: false }));
    }
  };

  return (
    <View style={styles.attachmentsContainer}>
      <View style={styles.attachmentsHeader}>
        <Text style={styles.attachmentsTitle}>
          Attachments ({attachments.length})
        </Text>
      </View>
      <View style={styles.attachmentsList}>
        {displayAttachments.map((attachment) => {
          const fileType = getFileTypeIcon(attachment.name, colors);
          const isDownloading = downloading[attachment.id];
          
          return (
            <TouchableOpacity 
              key={attachment.id}
              style={styles.attachmentItem}
              onPress={() => handleDownload(attachment)}
            >
              <View style={[styles.attachmentIcon, { backgroundColor: '#F1F5F9' }]}>
                <Feather name={fileType.icon} size={24} color={fileType.color} />
              </View>
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {attachment.name}
                </Text>
                {attachment.size && (
                  <Text style={styles.attachmentSize}>{attachment.size}</Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownload(attachment)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#64748B" />
                ) : (
                  <Feather name="download" size={20} color="#64748B" />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const Feed = ({ ListHeaderComponent }: { ListHeaderComponent?: React.ReactElement | null }) => {
  const [showMenu, setShowMenu] = useState<{ visible: boolean; x: number; y: number } | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPostAuthor, setReportPostAuthor] = useState<string>('');
  const [reportPostId, setReportPostId] = useState<string>('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockUserName, setBlockUserName] = useState<string>('');
  const [blockUserId, setBlockUserId] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; videoId: string } | null>(null);
  const [currentAudio, setCurrentAudio] = useState<{ id: string; sound: Audio.Sound | null } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [polls, setPolls] = useState<Record<string, Poll>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [replyTo, setReplyTo] = useState<{ postId: string; commentId: string | null } | null>(null);
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
  const [editingComment, setEditingComment] = useState<{ id: string; text: string } | null>(null);
  const [showCommentMenu, setShowCommentMenu] = useState<{ id: string; isReply: boolean } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; isReply: boolean } | null>(null);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [unlockedPosts, setUnlockedPosts] = useState<Record<string, boolean>>({});
  const [currentModalPost, setCurrentModalPost] = useState<any | null>(null);
  const [showAttachmentsForPost, setShowAttachmentsForPost] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { downloadItem, isDownloading, downloadProgress } = useDownload();
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize audio
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };
    setupAudio();

    // Initialize polls from mock data
    const initialPolls: Record<string, Poll> = {};
    mockPosts.forEach(post => {
      if (post.type === 'poll' && post.poll) {
        initialPolls[post.poll.id] = post.poll;
      }
    });
    setPolls(initialPolls);

    // Initialize post likes from mock data
    const initialLikes: Record<string, number> = {};
    mockPosts.forEach(post => {
      initialLikes[post.id] = post.likes;
    });
    setPostLikes(initialLikes);

    return () => {
      // Cleanup audio when component unmounts
      if (currentAudio?.sound) {
        currentAudio.sound.unloadAsync();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentAudio]);

  const handleReportPress = (post: any) => {
    setReportPostAuthor(post.creator.name);
    setReportPostId(post.id);
    setShowReportModal(true);
  };

  const handleReportSubmit = (reason: string, description?: string) => {
    // You can handle the report logic here (e.g., send to API)
    // postId: reportPostId, author: reportPostAuthor, reason, description
    setShowReportModal(false);
    setReportPostAuthor('');
    setReportPostId('');
  };

  const handleBlockPress = (post: any) => {
    setBlockUserName(post.creator.name);
    setBlockUserId(post.id);
    setShowBlockModal(true);
  };

  const handleBlockSubmit = (reason: string, description?: string) => {
    // You can handle the block logic here (e.g., send to API)
    // userId: blockUserId, userName: blockUserName, reason, description
    setShowBlockModal(false);
    setBlockUserName('');
    setBlockUserId('');
  };

  const handleAudioPress = async (item: any) => {
    try {
      setAudioError(null);
      
      if (currentAudio && currentAudio.id === item.id) {
        const sound = currentAudio.sound;
        if (!sound) return;

        // Toggle play/pause for current audio
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
        } else {
          await sound.playAsync();
          setIsPlaying(true);
          startProgressTracking();
        }
      } else {
        // Stop current audio if any
        if (currentAudio?.sound) {
          await currentAudio.sound.unloadAsync();
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
        }

        // Load and play new audio
        const { sound } = await Audio.Sound.createAsync(
          { uri: item.audioUrl },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        
        setCurrentAudio({ id: item.id, sound });
        setIsPlaying(true);
        setAudioProgress(0);
        startProgressTracking();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioError('Failed to play audio. Please try again.');
      setIsPlaying(false);
      setAudioProgress(0);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setAudioProgress(0);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
    } else if (status.error) {
      console.error('Playback error:', status.error);
      setAudioError('Error playing audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(async () => {
      if (currentAudio?.sound) {
        try {
          const status = await currentAudio.sound.getStatusAsync();
          if (status.isLoaded && status.durationMillis) {
            const progress = status.positionMillis / status.durationMillis;
            setAudioProgress(progress);
          }
        } catch (error) {
          console.error('Error getting playback status:', error);
        }
      }
    }, 100);
  };

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prevPolls => {
      const poll = prevPolls[pollId];
      if (!poll) return prevPolls;

      const updatedOptions = poll.options.map(opt => {
        if (opt.id === optionId) {
          // Toggle the voted state
          const newVotedState = !opt.voted;
          return { 
            ...opt, 
            votes: newVotedState ? opt.votes + 1 : opt.votes - 1,
            voted: newVotedState 
          };
        }
        // For single selection polls, uncheck other options when selecting a new one
        if (poll.selectionType === 'single' && opt.voted) {
          return { ...opt, votes: opt.votes - 1, voted: false };
        }
        return opt;
      });

      // Calculate new total votes
      const newTotalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);

      return {
        ...prevPolls,
        [pollId]: {
          ...poll,
          options: updatedOptions,
          totalVotes: newTotalVotes,
        },
      };
    });
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const isLiked = prev[postId];
      // Update like count
      setPostLikes(prevLikes => ({
        ...prevLikes,
        [postId]: prevLikes[postId] + (isLiked ? -1 : 1)
      }));
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  const handleCommentPress = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText[postId]?.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      text: commentText[postId],
      time: 'Just now',
      likes: 0,
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const handleReply = (postId: string, commentId: string) => {
    setReplyTo({ postId, commentId });
  };

  const handleAddReply = (postId: string, commentId: string) => {
    if (!commentText[`reply-${commentId}`]?.trim()) return;

    const newReply: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      text: commentText[`reply-${commentId}`],
      time: 'Just now',
      likes: 0,
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    }));
    setCommentText(prev => ({ ...prev, [`reply-${commentId}`]: '' }));
    setReplyTo(null);
  };

  const handleCommentLike = (commentId: string) => {
    setLikedComments(prev => {
      const isLiked = prev[commentId];
      // Update like count
      setCommentLikes(prevLikes => ({
        ...prevLikes,
        [commentId]: (prevLikes[commentId] || 0) + (isLiked ? -1 : 1)
      }));
      return {
        ...prev,
        [commentId]: !isLiked
      };
    });
  };

  const handleEditComment = (commentId: string, text: string) => {
    setEditingComment({ id: commentId, text });
  };

  const handleUpdateComment = (postId: string, commentId: string) => {
    if (!editingComment?.text.trim()) return;

    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].map(comment => 
        comment.id === commentId 
          ? { ...comment, text: editingComment.text }
          : comment
      )
    }));
    setEditingComment(null);
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].filter(comment => comment.id !== commentId)
    }));
  };

  const handleCommentMenuPress = (commentId: string, isReply: boolean) => {
    setShowCommentMenu(prev => 
      prev?.id === commentId ? null : { id: commentId, isReply }
    );
  };

  const handleUnlock = (postId: string) => {
    setUnlockedPosts(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  const handleDownload = async (post: any) => {
    if (post.type === 'audio' && post.audioUrl) {
      await downloadItem({
        id: `audio_${post.id}`,
        postId: post.id,
        type: 'audio',
        url: post.audioUrl,
        name: post.title,
        size: post.duration,
        creator: {
          name: post.creator.name,
          avatar: post.creator.avatar,
          verified: post.creator.verified
        }
      });
    } else if (post.type === 'image' && post.images?.length > 0) {
      for (const imageUrl of post.images) {
        await downloadItem({
          id: `image_${post.id}_${imageUrl}`,
          postId: post.id,
          type: 'image',
          url: imageUrl,
          name: `${post.title}_${post.images.indexOf(imageUrl) + 1}`,
          thumbnail: imageUrl,
          creator: {
            name: post.creator.name,
            avatar: post.creator.avatar,
            verified: post.creator.verified
          }
        });
      }
    }
  };

  const renderMenu = () => {
    if (!showMenu) return null;

    const hasDownloadableContent = currentModalPost?.type === 'audio' || 
      (currentModalPost?.type === 'image' && currentModalPost?.images?.length > 0);

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
            {hasDownloadableContent && (
              <TouchableOpacity 
                style={styles.menuOption} 
                onPress={() => {
                  handleDownload(currentModalPost);
                  setShowMenu(null);
                }}
              >
                <Feather name="download" size={20} color="#3B82F6" />
                <Text style={[styles.menuOptionText, { color: '#3B82F6' }]}>Download</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.menuOption} 
              onPress={() => {
                handleReportPress(currentModalPost);
                setShowMenu(null);
              }}
            >
              <Feather name="flag" size={20} color="#EF4444" />
              <Text style={[styles.menuOptionText, { color: '#EF4444' }]}>Report post</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuOption} 
              onPress={() => {
                handleBlockPress(currentModalPost);
                setShowMenu(null);
              }}
            >
              <Feather name="user-x" size={20} color="#18181B" />
              <Text style={styles.menuOptionText}>Block</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    );
  };

  function renderPostContent(item: any) {
    const handleVideoPress = (videoUrl: string) => {
      const videoId = getYoutubeVideoId(videoUrl);
      if (videoId) {
        setSelectedVideo({ id: videoUrl, videoId });
      }
    };

    const renderLockedContent = (content: React.ReactNode, postId: string) => {
      if (!item.isLocked || unlockedPosts[postId]) return content;
      
      return (
        <View style={styles.lockedContainer}>
          <View style={styles.blurredContent}>
            {content}
          </View>
          <LockedContentOverlay onUnlock={() => handleUnlock(postId)} />
        </View>
      );
    };

    const renderContent = () => {
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
              <Text style={styles.content}>{displayContent}</Text>
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
        case 'audio':
          const isCurrentAudio = currentAudio?.id === item.id;
          return (
            <View style={styles.audioPlayer}>
              <View style={styles.audioInfo}>
                <Feather name="music" size={24} color="#3B82F6" />
                <View style={styles.audioDetails}>
                  <Text style={styles.audioTitle}>{item.title}</Text>
                  <Text style={styles.audioDuration}>{item.duration}</Text>
                  {audioError && isCurrentAudio && (
                    <Text style={styles.errorText}>{audioError}</Text>
                  )}
                </View>
              </View>
              <View style={styles.audioControls}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => handleAudioPress(item)}
                >
                  <Feather 
                    name={isCurrentAudio && isPlaying ? "pause" : "play"} 
                    size={20} 
                    color="#fff" 
                  />
                </TouchableOpacity>
                <View style={styles.progressBar}>
                  <View style={[styles.progress, { width: `${audioProgress * 100}%` }]} />
                </View>
              </View>
            </View>
          );
        case 'image':
          return (
            <View style={styles.imagePostContainer}>
              {item.images.length === 1 ? (
                <Image 
                  source={{ uri: item.images[0] }} 
                  style={styles.singleImage} 
                  resizeMode="cover"
                />
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScrollView}
                >
                  {item.images.map((imageUrl: string, index: number) => (
                    <View key={index} style={styles.multipleImageContainer}>
                      <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.multipleImage} 
                        resizeMode="cover"
                      />
                      {index < item.images.length - 1 && (
                        <View style={styles.imageDivider} />
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          );
        case 'video':
          const videoId = getYoutubeVideoId(item.videoUrl);
          if (!videoId) return null;
          return (
            <TouchableOpacity 
              style={styles.videoContainer} 
              onPress={() => handleVideoPress(item.videoUrl)}
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
        case 'poll':
          const poll = polls[item.poll.id];
          if (!poll) return null;
          return (
            <View style={styles.pollContainer}>
              <Text style={styles.pollType}>
                {poll.selectionType === 'single' ? 'Select one option' : 'Select multiple options'}
              </Text>
              <View style={styles.pollOptions}>
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes > 0 
                    ? (option.votes / poll.totalVotes) * 100 
                    : 0;
                  
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.pollOption,
                        option.voted && styles.pollOptionVoted
                      ]}
                      onPress={() => handleVote(poll.id, option.id)}
                    >
                      <View style={styles.pollOptionContent}>
                        <View style={styles.pollOptionLeft}>
                          <View style={[
                            styles.checkbox,
                            option.voted && styles.checkboxChecked
                          ]}>
                            {option.voted && (
                              <Feather 
                                name={poll.selectionType === 'single' ? 'check' : 'check-square'} 
                                size={16} 
                                color="#fff" 
                              />
                            )}
                          </View>
                          <Text style={styles.pollOptionText}>{option.text}</Text>
                        </View>
                        <Text style={styles.pollOptionVotes}>
                          {option.votes} votes ({percentage.toFixed(1)}%)
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.pollTotalVotes}>
                {poll.totalVotes} total votes
                {poll.endTime && ` • Ends ${new Date(poll.endTime).toLocaleDateString()}`}
              </Text>
            </View>
          );
        default:
          return (
            <Text style={styles.content}>{item.content}</Text>
          );
      }
    };

    return renderLockedContent(renderContent(), item.id);
  }

  return (
    <>
      <FlatList
        data={mockPosts}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.feedContainer]}
        renderItem={({ item }) => {
          const isLiked = likedPosts[item.id];
          const postComments = comments[item.id] || [];
          const isCommentsVisible = showComments[item.id];

          return (
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.headerRow}>
                <Image source={{ uri: item.creator.avatar }} style={styles.avatar} />
                <View style={styles.headerTextGroup}>
                  <View style={styles.headerNameRow}>
                    <Text style={styles.creatorName}>{item.creator.name}</Text>
                    {item.isLocked && (
                      <View style={styles.lockedBadge}>
                        <Feather name="lock" size={12} color="#fff" />
                        <Text style={styles.lockedBadgeText}>Locked</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity 
                  onPress={(event) => {
                    const { pageY } = event.nativeEvent;
                    setCurrentModalPost(item);
                    setShowMenu({ visible: true, x: 0, y: pageY });
                  }}
                >
                  <Feather name="more-vertical" size={20} color="#A1A1AA" />
                </TouchableOpacity>
              </View>

              {/* Title */}
              <Text style={[styles.title, { marginLeft: 56 }]}>{item.title}</Text>

              {/* Content (type-based) */}
              <View style={{ marginLeft: 56 }}>
                {renderPostContent(item)}
              </View>

              {/* Attachments Button */}
              {item.attachments && item.attachments.length > 0 && (
                <TouchableOpacity
                  style={{ alignSelf: 'flex-start', backgroundColor: '#F1F5F9', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginLeft: 56, marginBottom: 8 }}
                  onPress={() => setShowAttachmentsForPost(item.id)}
                >
                  <Text style={{ color: '#3B82F6', fontWeight: '600' }}>Show Attachments ({item.attachments.length})</Text>
                </TouchableOpacity>
              )}

              {/* Footer */}
              <View style={[styles.footerRow, { marginLeft: 56 }]}>
                <TouchableOpacity 
                  style={styles.footerItem} 
                  onPress={() => handleLike(item.id)}
                >
                  <Feather 
                    name={isLiked ? "heart" : "heart"} 
                    size={20} 
                    color={isLiked ? "#EF4444" : "#52525B"} 
                    style={[
                      styles.heartIcon,
                      isLiked && styles.likedIcon
                    ]}
                  />
                  <Text style={styles.footerText}>
                    {formatCount(postLikes[item.id] || 0)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.footerItem}
                  onPress={() => handleCommentPress(item.id)}
                >
                  <Feather name="message-circle" size={20} color="#52525B" />
                  <Text style={styles.footerText}>{formatCount(item.comments)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.footerItem}
                  onPress={() => setShowShareModal(true)}
                >
                  <Feather name="share-2" size={20} color="#52525B" />
                  <Text style={styles.footerText}>{formatCount(item.shares)}</Text>
                </TouchableOpacity>
              </View>

              {/* Comments Section */}
              {isCommentsVisible && (
                <View style={[styles.commentsSection, { marginTop: 16 }]}>
                  {/* Comments List */}
                  {postComments.map(comment => {
                    const isCommentLiked = likedComments[comment.id];
                    const commentLikeCount = commentLikes[comment.id] || comment.likes;
                    const isCurrentUser = comment.userId === 'current-user';
                    const isEditing = editingComment?.id === comment.id;
                    const isMenuVisible = showCommentMenu?.id === comment.id && !showCommentMenu.isReply;
                    
                    return (
                      <View key={comment.id} style={styles.commentContainer}>
                        <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
                        <View style={styles.commentContent}>
                          <View style={styles.commentHeader}>
                            <Text style={styles.commentUserName}>{comment.userName}</Text>
                            <Text style={styles.commentTime}>{comment.time}</Text>
                            {isCurrentUser && !isEditing && (
                              <TouchableOpacity 
                                style={styles.commentMenuButton}
                                onPress={() => handleCommentMenuPress(comment.id, false)}
                              >
                                <Feather name="more-vertical" size={16} color="#64748B" />
                              </TouchableOpacity>
                            )}
                          </View>
                          {isEditing ? (
                            <View style={styles.editCommentContainer}>
                              <TextInput
                                style={styles.editCommentInput}
                                value={editingComment.text}
                                onChangeText={(text) => setEditingComment(prev => ({ ...prev!, text }))}
                                multiline
                              />
                              <View style={styles.editCommentActions}>
                                <TouchableOpacity 
                                  style={styles.editCommentButton}
                                  onPress={() => handleUpdateComment(item.id, comment.id)}
                                >
                                  <Feather name="check" size={16} color="#3B82F6" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                  style={styles.editCommentButton}
                                  onPress={() => setEditingComment(null)}
                                >
                                  <Feather name="x" size={16} color="#64748B" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <Text style={styles.commentText}>{comment.text}</Text>
                          )}
                          <View style={styles.commentActions}>
                            <TouchableOpacity 
                              style={styles.commentAction}
                              onPress={() => handleCommentLike(comment.id)}
                            >
                              <Feather 
                                name="heart" 
                                size={14} 
                                color={isCommentLiked ? "#EF4444" : "#64748B"} 
                                style={[
                                  styles.heartIcon,
                                  isCommentLiked && styles.likedIcon
                                ]}
                              />
                              <Text style={[
                                styles.commentActionText,
                                isCommentLiked && styles.likedActionText
                              ]}>
                                {formatCount(commentLikeCount)}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.commentAction}
                              onPress={() => handleReply(item.id, comment.id)}
                            >
                              <Feather name="message-circle" size={14} color="#64748B" />
                              <Text style={styles.commentActionText}>Reply</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Comment Menu */}
                          {isMenuVisible && (
                            <View style={styles.commentMenu}>
                              <TouchableOpacity 
                                style={styles.commentMenuItem}
                                onPress={() => {
                                  handleEditComment(comment.id, comment.text);
                                  setShowCommentMenu(null);
                                }}
                              >
                                <Feather name="edit-2" size={16} color="#64748B" />
                                <Text style={styles.commentMenuItemText}>Edit</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={styles.commentMenuItem}
                                onPress={() => {
                                  setShowDeleteConfirm({ id: comment.id, isReply: false });
                                  setShowCommentMenu(null);
                                }}
                              >
                                <Feather name="trash-2" size={16} color="#EF4444" />
                                <Text style={[styles.commentMenuItemText, { color: '#EF4444' }]}>Delete</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                          
                          {/* Replies */}
                          {comment.replies.map(reply => {
                            const isReplyLiked = likedComments[reply.id];
                            const replyLikeCount = commentLikes[reply.id] || reply.likes;
                            const isCurrentUserReply = reply.userId === 'current-user';
                            const isReplyMenuVisible = showCommentMenu?.id === reply.id && showCommentMenu.isReply;
                            
                            return (
                              <View key={reply.id} style={styles.replyContainer}>
                                <Image source={{ uri: reply.userAvatar }} style={styles.replyAvatar} />
                                <View style={styles.replyContent}>
                                  <View style={styles.replyHeader}>
                                    <Text style={styles.replyUserName}>{reply.userName}</Text>
                                    <Text style={styles.replyTime}>{reply.time}</Text>
                                    {isCurrentUserReply && (
                                      <TouchableOpacity 
                                        style={styles.replyMenuButton}
                                        onPress={() => handleCommentMenuPress(reply.id, true)}
                                      >
                                        <Feather name="more-vertical" size={14} color="#64748B" />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                  <Text style={styles.replyText}>{reply.text}</Text>
                                  <View style={styles.replyActions}>
                                    <TouchableOpacity 
                                      style={styles.replyAction}
                                      onPress={() => handleCommentLike(reply.id)}
                                    >
                                      <Feather 
                                        name="heart" 
                                        size={12} 
                                        color={isReplyLiked ? "#EF4444" : "#64748B"} 
                                        style={[
                                          styles.heartIcon,
                                          isReplyLiked && styles.likedIcon
                                        ]}
                                      />
                                      <Text style={[
                                        styles.replyActionText,
                                        isReplyLiked && styles.likedActionText
                                      ]}>
                                        {formatCount(replyLikeCount)}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>

                                  {/* Reply Menu */}
                                  {isReplyMenuVisible && (
                                    <View style={styles.replyMenu}>
                                      <TouchableOpacity 
                                        style={styles.replyMenuItem}
                                        onPress={() => {
                                          setShowDeleteConfirm({ id: reply.id, isReply: true });
                                          setShowCommentMenu(null);
                                        }}
                                      >
                                        <Feather name="trash-2" size={14} color="#EF4444" />
                                        <Text style={[styles.replyMenuItemText, { color: '#EF4444' }]}>Delete</Text>
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              </View>
                            );
                          })}

                          {/* Reply Input */}
                          {replyTo?.commentId === comment.id && (
                            <View style={styles.replyInputContainer}>
                              <TextInput
                                style={styles.replyInput}
                                placeholder="Write a reply..."
                                value={commentText[`reply-${comment.id}`] || ''}
                                onChangeText={(text) => setCommentText(prev => ({ ...prev, [`reply-${comment.id}`]: text }))}
                              />
                              <TouchableOpacity 
                                style={styles.replyButton}
                                onPress={() => handleAddReply(item.id, comment.id)}
                              >
                                <Feather name="send" size={20} color="#3B82F6" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}

                  {/* Comment Input */}
                  <View style={styles.commentInputContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Write a comment..."
                      value={commentText[item.id] || ''}
                      onChangeText={(text) => setCommentText(prev => ({ ...prev, [item.id]: text }))}
                    />
                    <TouchableOpacity 
                      style={styles.commentButton}
                      onPress={() => handleAddComment(item.id)}
                    >
                      <Feather name="send" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent || null}
      />
      {renderMenu()}
      <ReportPostModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        postAuthor={reportPostAuthor}
      />
      <BlockUserModal
        visible={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onSubmit={handleBlockSubmit}
        userName={blockUserName}
      />
      <VideoPlayer
        videoId={selectedVideo?.videoId || ''}
        isVisible={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={!!showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteConfirmModal}>
            <Text style={styles.deleteConfirmTitle}>Delete Comment</Text>
            <Text style={styles.deleteConfirmText}>
              Are you sure you want to delete this comment? This action cannot be undone.
            </Text>
            <View style={styles.deleteConfirmActions}>
              <TouchableOpacity 
                style={[styles.deleteConfirmButton, styles.cancelButton]}
                onPress={() => setShowDeleteConfirm(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.deleteConfirmButton, styles.deleteButton]}
                onPress={() => {
                  if (showDeleteConfirm && currentPostId) {
                    handleDeleteComment(currentPostId, showDeleteConfirm.id);
                    setShowDeleteConfirm(null);
                  }
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Attachments Bottom Sheet/Modal */}
      <Modal
        visible={!!showAttachmentsForPost}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAttachmentsForPost(null)}
      >
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }} onPress={() => setShowAttachmentsForPost(null)}>
          <Pressable style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' }} onPress={(e) => e.stopPropagation()}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 8 }} onPress={() => setShowAttachmentsForPost(null)}>
              <Text style={{ color: '#3B82F6', fontWeight: '600', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
            {showAttachmentsForPost && (
              <AttachmentsList attachments={mockPosts.find(p => p.id === showAttachmentsForPost)?.attachments as Attachment[] || []} />
            )}
          </Pressable>
        </Pressable>
      </Modal>
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={(type) => {
          // Implement your share logic here
          if (type === 'copy') {
            // Copy link to clipboard
          } else if (type === 'twitter') {
            // Share to Twitter
          } else if (type === 'facebook') {
            // Share to Facebook
          } else if (type === 'whatsapp') {
            // Share to WhatsApp
          }
          setShowShareModal(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 32,
    backgroundColor: '#F8FAFC',
  },
  card: {
    backgroundColor: '#fff',
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
    flexShrink: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  creatorName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#18181B',
  },
  timeText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#18181B',
    marginBottom: 4,
  },
  content: {
    color: '#18181B',
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  audioPlayer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  audioDetails: {
    marginLeft: 12,
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: 14,
    color: '#64748B',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#18181B',
  },
  videoPlayerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerContainer: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
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
  textContent: {
    marginBottom: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  pollContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pollType: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  pollOptions: {
    gap: 12,
  },
  pollOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pollOptionVoted: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#94A3B8',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pollOptionText: {
    fontSize: 15,
    color: '#18181B',
    fontWeight: '500',
  },
  pollOptionVotes: {
    fontSize: 13,
    color: '#64748B',
  },
  pollTotalVotes: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
    textAlign: 'center',
  },
  heartIcon: {
    opacity: 0.5
  },
  likedIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }]
  },
  commentsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#18181B',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#64748B',
  },
  commentText: {
    fontSize: 14,
    color: '#18181B',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  likedActionText: {
    color: '#EF4444',
  },
  replyContainer: {
    flexDirection: 'row',
    marginLeft: 44,
    marginTop: 12,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  replyUserName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#18181B',
    marginRight: 8,
  },
  replyTime: {
    fontSize: 11,
    color: '#64748B',
  },
  replyText: {
    fontSize: 13,
    color: '#18181B',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 44,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  replyInput: {
    flex: 1,
    fontSize: 13,
    color: '#18181B',
    paddingVertical: 6,
    minHeight: 36,
  },
  replyButton: {
    padding: 6,
    marginLeft: 8,
  },
  replyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  replyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  replyActionText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#18181B',
    paddingVertical: 8,
    minHeight: 40,
  },
  commentButton: {
    padding: 8,
    marginLeft: 8,
  },
  editCommentContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  editCommentInput: {
    fontSize: 14,
    color: '#18181B',
    minHeight: 40,
    textAlignVertical: 'top',
  },
  editCommentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editCommentButton: {
    padding: 4,
    marginLeft: 8,
  },
  commentMenuButton: {
    padding: 4,
    marginLeft: 'auto',
  },
  commentMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  commentMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  commentMenuItemText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  replyMenuButton: {
    padding: 2,
    marginLeft: 'auto',
  },
  replyMenu: {
    position: 'absolute',
    right: 0,
    top: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  replyMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  replyMenuItemText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
  deleteConfirmModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteConfirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 12,
  },
  deleteConfirmText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteConfirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  deleteConfirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  imagePostContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  singleImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  imageScrollView: {
    flexGrow: 0,
  },
  multipleImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multipleImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
  },
  imageDivider: {
    width: 8,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  lockedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  lockedContainer: {
    position: 'relative',
  },
  blurredContent: {
    opacity: 0.5,
    filter: 'blur(8px)',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  lockedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  unlockButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  attachmentsContainer: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  attachmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButtonText: {
    fontSize: 13,
    color: '#3B82F6',
    marginRight: 4,
  },
  attachmentsList: {
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    color: '#18181B',
    marginBottom: 2,
    fontWeight: '500',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#64748B',
  },
  downloadButton: {
    padding: 8,
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
  menuOptionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#18181B',
  },
}); 