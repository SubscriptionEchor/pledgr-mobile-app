import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SubHeader } from '@/components/SubHeader';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ImageIcon, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

// Mock data for the other user
const otherUser = {
  id: '2',
  name: 'Jane Creator',
  avatar: 'https://placehold.co/40x40',
};

const messages = [
  {
    id: '1',
    user: otherUser,
    text: 'Hey! How are you?',
    isMe: false,
    timestamp: '10:01 AM',
    edited: false,
    deleted: false,
  },
  {
    id: '2',
    user: {
      id: 'me',
      name: 'You',
      avatar: 'https://placehold.co/40x40?text=Me',
    },
    text: 'I am good! How about you?',
    isMe: true,
    timestamp: '10:02 AM',
    edited: false,
    deleted: false,
  },
];

export default function DirectChatScreen() {
  const { id, user } = useLocalSearchParams();
  const { colors, fonts, fontSize } = useTheme();
  const [input, setInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState(messages);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const currentUser = 'me';

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    setChatMessages(prevMsgs => [
      ...prevMsgs,
      {
        id: (prevMsgs.length + 1).toString(),
        user: {
          id: 'me',
          name: 'You',
          avatar: 'https://placehold.co/40x40?text=Me',
        },
        text: input,
        isMe: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        edited: false,
        deleted: false,
        image: selectedImage || null,
      }
    ]);
    setInput('');
    setSelectedImage(null);
  };

  const renderMessage = ({ item }: { item: any }) => {
    if (item.deleted) {
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
    return (
      <View style={{ marginBottom: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: item.isMe ? 'flex-end' : 'flex-start', position: 'relative' }}>
          {!item.isMe && (
            <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />
          )}
          <View style={{ maxWidth: '85%', marginLeft: item.isMe ? 0 : 4, marginRight: item.isMe ? 4 : 0, alignItems: item.isMe ? 'flex-end' : 'flex-start', position: 'relative' }}>
            <View style={[
              styles.messageBubble,
              {
                backgroundColor: item.isMe ? colors.primary : colors.surface,
                alignSelf: item.isMe ? 'flex-end' : 'flex-start',
              },
            ]}>
              <Text style={{ color: item.isMe ? '#fff' : colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{item.text}</Text>
              {item.edited && (
                <Text style={{ color: item.isMe ? '#fff' : colors.textSecondary, fontFamily: fonts.regular, fontSize: 10, marginTop: 2, opacity: 0.7 }}>
                  (edited)
                </Text>
              )}
            </View>
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
          </View>
          {item.isMe && (
            <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <SubHeader
        title={
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Image source={{ uri: otherUser.avatar }} style={styles.messageAvatar} />
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.xl, marginLeft: 10 }} numberOfLines={1} ellipsizeMode="tail">
              {otherUser.name}
            </Text>
          </View>
        }
      />
      <View style={[styles.content, { paddingHorizontal: 0, paddingTop: 8, paddingBottom: 0, flex: 1 }]} pointerEvents="box-none"> 
        <FlatList
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24, paddingHorizontal: 12 }}
          style={{ zIndex: 2 }}
        />
      </View>
      {/* Image preview above footer */}
      {selectedImage && (
        <View style={{ marginHorizontal: 16, marginBottom: 4, alignItems: 'flex-start' }}>
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 4 }}
          />
          <TouchableOpacity onPress={() => setSelectedImage(null)}>
            <Text style={{ color: colors.error, fontSize: 13 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}> 
        <TouchableOpacity style={styles.footerIcon} onPress={handlePickImage}>
          <ImageIcon size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }]}
          placeholder={"Type a message..."}
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.footerIcon} onPress={handleSend}>
          <Send size={22} color={input.trim() || selectedImage ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
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
}); 