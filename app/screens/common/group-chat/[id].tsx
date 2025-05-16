import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Pressable, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Info, Image as ImageIcon, Send, MoreVertical, Smile, CornerUpLeft, X, Search, LogOut } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type Reaction = { emoji: string; users: string[] };
type ChatMessage = {
  id: string;
  user: { name: string; avatar: string };
  text: string;
  isMe: boolean;
  reactions: Reaction[];
  timestamp: string;
  edited: boolean;
  deleted: boolean;
  image?: string | null;
  replies?: ChatMessage[];
  replyToId?: string | null;
};

const messages: ChatMessage[] = [
  {
    id: '1',
    user: {
      name: 'Jane Creator',
      avatar: 'https://placehold.co/40x40',
    },
    text: 'Hey everyone! Welcome to the group chat.',
    isMe: false,
    reactions: [
      { emoji: '👍', users: ['alex'] },
      { emoji: '😂', users: ['me'] },
    ],
    timestamp: '10:01 AM',
    edited: false,
    deleted: false,
  },
  {
    id: '2',
    user: {
      name: 'You',
      avatar: 'https://placehold.co/40x40?text=Me',
    },
    text: 'Hi Jane! Excited to be here.',
    isMe: true,
    reactions: [],
    timestamp: '10:02 AM',
    edited: false,
    deleted: false,
  },
  {
    id: '3',
    user: {
      name: 'Alex',
      avatar: 'https://placehold.co/40x40?text=A',
    },
    text: "Let's plan our next project.",
    isMe: false,
    reactions: [
      { emoji: '🔥', users: ['me', 'alex'] },
    ],
    timestamp: '10:03 AM',
    edited: false,
    deleted: false,
  },
  {
    id: '4',
    user: {
      name: 'You',
      avatar: 'https://placehold.co/40x40?text=Me',
    },
    text: 'Sounds good! Any ideas?',
    isMe: true,
    reactions: [],
    timestamp: '10:04 AM',
    edited: false,
    deleted: false,
  },
];

export default function GroupChatScreen() {
  const { id, group } = useLocalSearchParams();
  const { colors, fonts, fontSize } = useTheme();
  const [input, setInput] = React.useState('');
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null);
  const [emojiPickerFor, setEmojiPickerFor] = React.useState<string | null>(null);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>(messages);
  const currentUser = 'me';
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [editingImageMessage, setEditingImageMessage] = React.useState<ChatMessage | null>(null);
  const [replyThreadFor, setReplyThreadFor] = React.useState<ChatMessage | null>(null);
  const [replyInput, setReplyInput] = React.useState('');
  const [replyImage, setReplyImage] = React.useState<string | null>(null);
  const [membersModalVisible, setMembersModalVisible] = React.useState(false);
  const [memberKebabFor, setMemberKebabFor] = React.useState<string | null>(null);
  const [memberSearch, setMemberSearch] = React.useState('');
  const [leaveModalVisible, setLeaveModalVisible] = React.useState(false);
  const [groupMenuVisible, setGroupMenuVisible] = React.useState(false);
  const [infoModalVisible, setInfoModalVisible] = React.useState(false);
  let groupData = null;
  try {
    groupData = group ? JSON.parse(group as string) : null;
  } catch (e) {
    groupData = null;
  }

  const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  // Style for selected message
  const selectedStyle = (isMe: boolean) =>
    isMe
      ? {
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }
      : {
          backgroundColor: colors.surface + '55',
          borderColor: colors.primary,
          borderWidth: 1,
        };

  const [actionSheetFor, setActionSheetFor] = React.useState<string | null>(null);

  // Use mock members if groupData.members is not present
  const groupMembers = groupData?.members || [
    { id: '1', name: 'Jane Creator', avatar: 'https://placehold.co/40x40', role: 'Admin' },
    { id: '2', name: 'Alex', avatar: 'https://placehold.co/40x40?text=A', role: 'Member' },
    { id: '3', name: 'You', avatar: 'https://placehold.co/40x40?text=Me', role: 'Member' },
  ];

  // Handle emoji reaction
  const handleReact = (messageId: string, emoji: string) => {
    setChatMessages(prevMsgs => prevMsgs.map((msg: ChatMessage) => {
      if (msg.id !== messageId) return msg;
      let found = false;
      const newReactions = (msg.reactions || []).map((r: Reaction) => {
        if (r.emoji === emoji) {
          found = true;
          // Toggle reaction for current user
          if (r.users.includes(currentUser)) {
            return { ...r, users: r.users.filter((u: string) => u !== currentUser) };
          } else {
            return { ...r, users: [...r.users, currentUser] };
          }
        }
        return r;
      }).filter((r: Reaction) => r.users.length > 0);
      if (!found) {
        newReactions.push({ emoji, users: [currentUser] });
      }
      return { ...msg, reactions: newReactions };
    }));
    setEmojiPickerFor(null);
    setSelectedMessageId(null);
  };

  // Handle edit message
  const handleEdit = () => {
    if (!editingMessageId) return;
    setChatMessages(prevMsgs => prevMsgs.map(msg =>
      msg.id === editingMessageId ? { ...msg, text: input, edited: true } : msg
    ));
    setEditingMessageId(null);
    setInput('');
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setShowImageModal(true);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    setChatMessages(prevMsgs => [
      ...prevMsgs,
      {
        id: (prevMsgs.length + 1).toString(),
        user: {
          name: 'You',
          avatar: 'https://placehold.co/40x40?text=Me',
        },
        text: input,
        isMe: true,
        reactions: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        edited: false,
        deleted: false,
        image: selectedImage || null,
      }
    ]);
    setInput('');
    setSelectedImage(null);
  };

  const handleSendImage = () => {
    if (!input.trim() && !selectedImage) return;
    if (editingImageMessage) {
      setChatMessages(prevMsgs => prevMsgs.map(msg =>
        msg.id === editingImageMessage.id
          ? { ...msg, text: input, image: selectedImage, edited: true }
          : msg
      ));
      setEditingImageMessage(null);
    } else {
      setChatMessages(prevMsgs => [
        ...prevMsgs,
        {
          id: (prevMsgs.length + 1).toString(),
          user: {
            name: 'You',
            avatar: 'https://placehold.co/40x40?text=Me',
          },
          text: input,
          isMe: true,
          reactions: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          edited: false,
          deleted: false,
          image: selectedImage || null,
        }
      ]);
    }
    setInput('');
    setSelectedImage(null);
    setShowImageModal(false);
  };

  const handleSendReply = () => {
    if (!replyInput.trim() && !replyImage) return;
    if (!replyThreadFor) return;
    const newReply: ChatMessage = {
      id: `${replyThreadFor.id}-r${(replyThreadFor.replies?.length || 0) + 1}`,
      user: {
        name: 'You',
        avatar: 'https://placehold.co/40x40?text=Me',
      },
      text: replyInput,
      isMe: true,
      reactions: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      edited: false,
      deleted: false,
      image: replyImage || null,
      replyToId: replyThreadFor.id,
    };
    setChatMessages(prevMsgs => prevMsgs.map(msg =>
      msg.id === replyThreadFor.id
        ? { ...msg, replies: [...(msg.replies || []), newReply] }
        : msg
    ));
    setReplyInput('');
    setReplyImage(null);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if ((item as any).deleted) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: item.isMe ? 'flex-end' : 'flex-start', marginBottom: 18 }}>
          {!item.isMe && <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />}
          <View style={[
            styles.messageBubble,
            { backgroundColor: colors.surface, alignSelf: item.isMe ? 'flex-end' : 'flex-start', opacity: 0.7, maxWidth: '85%' }
          ]}>
            <Text style={{ color: colors.textSecondary, fontStyle: 'italic', fontFamily: fonts.regular }}>
              This message was deleted
            </Text>
          </View>
          {item.isMe && <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />}
        </View>
      );
    }
    const isSelected = selectedMessageId === item.id;
    const showEmojiPicker = emojiPickerFor === item.id;
    const reactions: Reaction[] = item.reactions || [];
    return (
      <Pressable
        onLongPress={() => setSelectedMessageId(item.id)}
        onPress={() => {
          if (!isSelected) {
            setSelectedMessageId(null);
            setEmojiPickerFor(null);
          }
          // If editing, cancel edit
          if (editingMessageId) {
            setEditingMessageId(null);
            setInput('');
          }
        }}
        style={{ marginBottom: 18 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: item.isMe ? 'flex-end' : 'flex-start', position: 'relative' }}>
          {!item.isMe && (
            <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />
          )}
          <View style={{ maxWidth: '85%', marginLeft: item.isMe ? 0 : 4, marginRight: item.isMe ? 4 : 0, alignItems: item.isMe ? 'flex-end' : 'flex-start', position: 'relative' }}>
            {showEmojiPicker && (
              <>
                <View style={[styles.emojiBar, { zIndex: 20 }]}> 
                  {EMOJIS.map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      style={styles.emojiBtn}
                      onPress={() => handleReact(item.id, emoji)}
                    >
                      <Text style={{ fontSize: 28 }}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Overlay to close emoji bar when tapping outside */}
                <Pressable
                  style={{ position: 'absolute', top: 0, left: -1000, right: -1000, bottom: 0, zIndex: 19 }}
                  onPress={() => { setEmojiPickerFor(null); setSelectedMessageId(null); }}
                />
              </>
            )}
            {!item.isMe && (
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.medium, fontSize: fontSize.sm, marginBottom: 2, marginLeft: 2 }}>{item.user.name}</Text>
            )}
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{ width: 180, height: 180, borderRadius: 12, marginBottom: item.text ? 6 : 2 }}
              />
            )}
            {item.text ? (
              <View style={[
                styles.messageBubble,
                {
                  backgroundColor: item.isMe ? colors.primary : colors.surface,
                  alignSelf: item.isMe ? 'flex-end' : 'flex-start',
                },
                isSelected && selectedStyle(item.isMe),
              ]}>
                <Text style={{ color: item.isMe ? '#fff' : colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{item.text}</Text>
                {item.edited && (
                  <Text style={{ color: item.isMe ? '#fff' : colors.textSecondary, fontFamily: fonts.regular, fontSize: 10, marginTop: 2, opacity: 0.7 }}>
                    (edited)
                  </Text>
                )}
              </View>
            ) : null}
            {/* Timestamp below message bubble */}
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: 12,
                marginTop: 2,
                alignSelf: item.isMe ? 'flex-end' : 'flex-start',
                opacity: 0.7,
              }}
            >
              {item.timestamp}
            </Text>
            {reactions.length > 0 && (
              <View style={styles.reactionsBar}>
                {reactions.map((r: Reaction) => (
                  <TouchableOpacity
                    key={r.emoji}
                    style={styles.reaction}
                    onPress={() => handleReact(item.id, r.emoji)}
                  >
                    <Text style={{ fontSize: 18 }}>{r.emoji}</Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, marginLeft: 4 }}>{r.users.length}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {isSelected && (
              <>
                <View style={[styles.messageActions, { zIndex: 20 }] }>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setEmojiPickerFor(item.id)}>
                    <Smile size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => {
                    const msg = chatMessages.find(m => m.id === item.id);
                    if (msg) setReplyThreadFor(msg);
                    setSelectedMessageId(null);
                    setEmojiPickerFor(null);
                  }}>
                    <CornerUpLeft size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setActionSheetFor(item.id)}>
                    <MoreVertical size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {/* Overlay to close action bar when tapping outside */}
                <Pressable
                  style={{ position: 'absolute', top: 0, left: -1000, right: -1000, bottom: 0, zIndex: 19 }}
                  onPress={() => { setSelectedMessageId(null); setEmojiPickerFor(null); }}
                />
              </>
            )}
          </View>
          {item.isMe && (
            <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <SubHeader
        title={
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.xl }} numberOfLines={1} ellipsizeMode="tail">
              {groupData ? groupData.name : `Group Chat: ${id}`}
            </Text>
            {groupData && (
              <TouchableOpacity
                onPress={() => setMembersModalVisible(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginLeft: 8,
                  height: 22,
                }}
              >
                <Users size={14} color={colors.textSecondary} style={{ marginRight: 3 }} />
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: 13 }}>{groupData.totalMembers}</Text>
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => setGroupMenuVisible(true)}>
              <MoreVertical size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={[styles.content, { paddingHorizontal: 0, paddingTop: 8, paddingBottom: 0, flex: 1 }]} pointerEvents="box-none"> 
        <Pressable
          style={{ flex: 1 }}
          onPress={() => { setSelectedMessageId(null); setEmojiPickerFor(null); }}
        >
          <FlatList
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
            style={{ zIndex: 2 }}
          />
        </Pressable>
      </View>
      <Modal
        visible={showImageModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowImageModal(false);
          setSelectedImage(null);
          setInput('');
          setEditingImageMessage(null);
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          {/* Close button */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 48, right: 24, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 6 }}
            onPress={() => {
              setShowImageModal(false);
              setSelectedImage(null);
              setInput('');
              setEditingImageMessage(null);
            }}
          >
            <X size={28} color="#fff" />
          </TouchableOpacity>
          {/* Image preview */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: '90%', height: '60%', borderRadius: 16, resizeMode: 'contain', marginBottom: 16 }}
            />
          )}
          {/* Footer for message input and send */}
          <View style={{ width: '100%', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}> 
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }]}
                placeholder={"Add a message..."}
                placeholderTextColor={colors.textSecondary}
                value={input}
                onChangeText={setInput}
                multiline
              />
              <TouchableOpacity style={styles.footerIcon} onPress={handleSendImage}>
                <Send size={22} color={input.trim() || selectedImage ? colors.primary : colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.footerIcon} onPress={handlePickImage}>
          <ImageIcon size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }]}
          placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
        />
        {editingMessageId ? (
          <TouchableOpacity style={styles.footerIcon} onPress={handleEdit}>
            <Text style={{ color: input.trim() ? colors.primary : colors.textSecondary, fontFamily: fonts.medium, fontSize: fontSize.md }}>Update</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.footerIcon} onPress={handleSend}>
            <Send size={22} color={input.trim() || selectedImage ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {/* Message Action Bottom Sheet */}
      <Modal
        visible={!!actionSheetFor}
        transparent
        animationType="slide"
        onRequestClose={() => setActionSheetFor(null)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => setActionSheetFor(null)}
        />
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: 24,
          minHeight: 120,
          alignItems: 'center',
        }}>
          {(() => {
            const msg = chatMessages.find(m => m.id === actionSheetFor);
            if (msg && msg.isMe) {
              return <>
                <TouchableOpacity
                  style={{ paddingVertical: 16, width: '100%' }}
                  onPress={() => {
                    setActionSheetFor(null);
                    const msgHasImage = !!msg.image;
                    if (msgHasImage) {
                      setEditingImageMessage(msg);
                      setSelectedImage(msg.image!);
                      setInput(msg.text);
                      setShowImageModal(true);
                    } else {
                      setEditingMessageId(msg.id);
                      setInput(msg.text);
                    }
                  }}
                >
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 17, textAlign: 'center' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingVertical: 16, width: '100%' }}
                  onPress={() => {
                    setActionSheetFor(null);
                    setDeletingMessageId(msg.id);
                  }}
                >
                  <Text style={{ color: colors.error, fontFamily: fonts.medium, fontSize: 17, textAlign: 'center' }}>Delete</Text>
                </TouchableOpacity>
              </>;
            } else {
              return <>
                <TouchableOpacity
                  style={{ paddingVertical: 16, width: '100%' }}
                  onPress={() => { setActionSheetFor(null); /* TODO: handle report */ }}
                >
                  <Text style={{ color: colors.error, fontFamily: fonts.medium, fontSize: 17, textAlign: 'center' }}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingVertical: 16, width: '100%' }}
                  onPress={() => { setActionSheetFor(null); /* TODO: handle block */ }}
                >
                  <Text style={{ color: colors.error, fontFamily: fonts.medium, fontSize: 17, textAlign: 'center' }}>Block User</Text>
                </TouchableOpacity>
              </>;
            }
          })()}
        </View>
      </Modal>
      <Modal
        visible={!!deletingMessageId}
        transparent
        animationType="fade"
        onRequestClose={() => setDeletingMessageId(null)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => setDeletingMessageId(null)}
        />
        <View style={{
          position: 'absolute',
          left: 32,
          right: 32,
          top: '40%',
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 17, fontFamily: fonts.medium, color: colors.textPrimary, marginBottom: 16 }}>
            Delete this message?
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 24, textAlign: 'center' }}>
            This action cannot be undone.
          </Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, backgroundColor: colors.surface, marginRight: 8 }}
              onPress={() => setDeletingMessageId(null)}
            >
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, backgroundColor: colors.error }}
              onPress={() => {
                setChatMessages(prevMsgs => prevMsgs.map(msg =>
                  msg.id === deletingMessageId
                    ? { ...msg, text: '', deleted: true }
                    : msg
                ));
                setDeletingMessageId(null);
              }}
            >
              <Text style={{ color: '#fff', fontFamily: fonts.medium }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={!!replyThreadFor}
        transparent={false}
        animationType="slide"
        onRequestClose={() => {
          setReplyThreadFor(null);
          setReplyInput('');
          setReplyImage(null);
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Header with close button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.lg, color: colors.textPrimary }}>Replies</Text>
            <TouchableOpacity onPress={() => {
              setReplyThreadFor(null);
              setReplyInput('');
              setReplyImage(null);
            }}>
              <X size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {/* Original message */}
          {replyThreadFor && (
            <View style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.medium, fontSize: fontSize.sm }}>{replyThreadFor.user.name}</Text>
              {replyThreadFor.image && (
                <Image source={{ uri: replyThreadFor.image }} style={{ width: 120, height: 120, borderRadius: 12, marginVertical: 6 }} />
              )}
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{replyThreadFor.text}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>{replyThreadFor.timestamp}</Text>
            </View>
          )}
          {/* Replies list */}
          <FlatList
            data={replyThreadFor?.replies || []}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderColor: colors.border }}>
                <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.medium, fontSize: fontSize.sm }}>{item.user.name}</Text>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={{ width: 120, height: 120, borderRadius: 12, marginVertical: 6 }} />
                  )}
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{item.text}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>{item.timestamp}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={<Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 32 }}>No replies yet.</Text>}
          />
          {/* Footer for reply input */}
          <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}> 
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }]}
              placeholder={"Write a reply..."}
              placeholderTextColor={colors.textSecondary}
              value={replyInput}
              onChangeText={setReplyInput}
              multiline
            />
            <TouchableOpacity style={styles.footerIcon} onPress={handleSendReply}>
              <Send size={22} color={replyInput.trim() ? colors.primary : colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={membersModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setMembersModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.lg, color: colors.textPrimary }}>Group Members</Text>
            <TouchableOpacity onPress={() => setMembersModalVisible(false)}>
              <X size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {/* Search input */}
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Search size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search members..."
              placeholderTextColor={colors.textSecondary}
              value={memberSearch}
              onChangeText={setMemberSearch}
              style={{ backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 12, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md, height: 40, flex: 1 }}
            />
          </View>
          {/* Members list */}
          <FlatList
            data={groupMembers.filter((m: any) => m.name.toLowerCase().includes(memberSearch.toLowerCase()))}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: colors.border }}>
                <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: fontSize.md }}>{item.name}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.role}</Text>
                </View>
                <TouchableOpacity onPress={() => setMemberKebabFor(item.id)} style={{ padding: 8 }}>
                  <MoreVertical size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={<Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 32 }}>No members found.</Text>}
          />
          {/* Member kebab action sheet */}
          <Modal
            visible={!!memberKebabFor}
            transparent
            animationType="fade"
            onRequestClose={() => setMemberKebabFor(null)}
          >
            <Pressable
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
              onPress={() => setMemberKebabFor(null)}
            />
            <View style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 24,
              minHeight: 120,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <TouchableOpacity style={{ paddingVertical: 18, width: '100%', borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setMemberKebabFor(null); /* TODO: Report User */ }}>
                <Text style={{ color: colors.error, fontFamily: fonts.medium, fontSize: 18, textAlign: 'center' }}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ paddingVertical: 18, width: '100%' }} onPress={() => { setMemberKebabFor(null); /* TODO: Block User */ }}>
                <Text style={{ color: colors.error, fontFamily: fonts.medium, fontSize: 18, textAlign: 'center' }}>Block User</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </Modal>
      <Modal
        visible={leaveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLeaveModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => setLeaveModalVisible(false)}
        />
        <View style={{
          position: 'absolute',
          left: 32,
          right: 32,
          top: '40%',
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 17, fontFamily: fonts.medium, color: colors.textPrimary, marginBottom: 16 }}>
            Leave this group?
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 24, textAlign: 'center' }}>
            Are you sure you want to leave this group? You will no longer receive messages or updates.
          </Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, backgroundColor: colors.surface, marginRight: 8 }}
              onPress={() => setLeaveModalVisible(false)}
            >
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, backgroundColor: colors.error }}
              onPress={() => {
                setLeaveModalVisible(false);
                // TODO: Actually leave the group (navigate away, update state, etc.)
                alert('You have left the group.');
              }}
            >
              <Text style={{ color: '#fff', fontFamily: fonts.medium }}>Leave</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={groupMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupMenuVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => setGroupMenuVisible(false)}
        />
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: 24,
          minHeight: 120,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <TouchableOpacity style={{ paddingVertical: 18, width: '100%', borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setGroupMenuVisible(false); setInfoModalVisible(true); }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 18, textAlign: 'center' }}>Chat Guidelines / Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingVertical: 18, width: '100%' }} onPress={() => { setGroupMenuVisible(false); setLeaveModalVisible(true); }}>
            <Text style={{ color: colors.error, fontFamily: fonts.medium, fontSize: 18, textAlign: 'center' }}>Leave Group</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => setInfoModalVisible(false)}
        />
        <View style={{
          position: 'absolute',
          left: 32,
          right: 32,
          top: '30%',
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 18, fontFamily: fonts.semibold, color: colors.textPrimary, marginBottom: 16 }}>
            Chat Guidelines / Info
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 24, textAlign: 'center' }}>
            Here you can display group chat guidelines, rules, or info. (Replace this placeholder with your actual content.)
          </Text>
          <TouchableOpacity
            style={{ paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, backgroundColor: colors.primary }}
            onPress={() => setInfoModalVisible(false)}
          >
            <Text style={{ color: '#fff', fontFamily: fonts.medium }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    marginTop: 4,
    gap: 8,
  },
  footerIcon: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    minHeight: 44,
    maxHeight: 120,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  messageBubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 2,
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'flex-start',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  emojiBtn: {
    padding: 4,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  reactionsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
    maxWidth: '80%',
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
}); 