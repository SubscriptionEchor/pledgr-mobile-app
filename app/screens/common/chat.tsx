import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Search, Filter, Users, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';

interface Group {
  id: string;
  name: string;
  profilePhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  totalMembers: number;
  unread: boolean;
}

interface DirectMessage {
  id: string;
  name: string;
  profilePhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

export default function ChatScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'groups' | 'direct'>('groups');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [filterOption, setFilterOption] = useState<'all' | 'unread'>('all');
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const isCreator = user?.role === UserRole.CREATOR || user?.role === UserRole.CREATOR_ASSOCIATE;

  // Placeholder data for groups and direct messages
  const groups: Group[] = [
    {
      id: '1',
      name: 'Creator Group Alpha',
      profilePhoto: 'https://placehold.co/48x48',
      lastMessage: 'Welcome to the group!',
      lastMessageTime: '1 min ago',
      totalMembers: 12,
      unread: true,
    },
    {
      id: '2',
      name: 'Beta Creators',
      profilePhoto: 'https://placehold.co/48x48',
      lastMessage: "Let's start our next project.",
      lastMessageTime: '5 min ago',
      totalMembers: 8,
      unread: false,
    },
  ];
  const directMessages: DirectMessage[] = [
    {
      id: '1',
      name: 'Jane Creator',
      profilePhoto: 'https://placehold.co/48x48',
      lastMessage: 'See you tomorrow!',
      lastMessageTime: '2 min ago',
      unread: true,
    },
    {
      id: '2',
      name: 'John Creator',
      profilePhoto: 'https://placehold.co/48x48',
      lastMessage: 'Thanks for your support!',
      lastMessageTime: '10 min ago',
      unread: false,
    },
  ];

  // Filter logic
  const filteredGroups = filterOption === 'all' ? groups : groups.filter(g => g.unread);
  const filteredDirectMessages = filterOption === 'all' ? directMessages : directMessages.filter(dm => dm.unread);

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={[styles.chatItem, { borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: `/screens/common/group-chat/${item.id}`,
        params: { group: JSON.stringify(item) }
      } as any)}
    >
      <Image source={{ uri: item.profilePhoto }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          <Text style={[styles.chatName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>{item.name}</Text>
          <View style={[styles.memberPill, { borderColor: colors.border, backgroundColor: colors.surface, marginLeft: 8 }]}> 
            <Users size={14} color={colors.textSecondary} style={{ marginRight: 3 }} />
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: 13 }}>{item.totalMembers}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[styles.lastMessage, { color: colors.textSecondary, fontFamily: fonts.regular, flex: 1 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary, fontFamily: fonts.regular, marginLeft: 8 }]} numberOfLines={1} ellipsizeMode="tail">{item.lastMessageTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDirectItem = ({ item }: { item: DirectMessage }) => (
    <TouchableOpacity
      style={[styles.chatItem, { borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: `/screens/common/direct-chat/${item.id}`,
        params: { user: JSON.stringify(item) }
      } as any)}
    >
      <Image source={{ uri: item.profilePhoto }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.chatName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[styles.lastMessage, { color: colors.textSecondary, fontFamily: fonts.regular, flex: 1 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary, fontFamily: fonts.regular, marginLeft: 8 }]} numberOfLines={1} ellipsizeMode="tail">{item.lastMessageTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <SubHeader title="Chat">
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
            <View style={{ borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, flex: 1, height: 44 }}>
              <Search size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search messages..."
                placeholderTextColor={colors.textSecondary}
                value={search}
                onChangeText={setSearch}
                style={{ flex: 1, height: '100%', color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md, paddingVertical: 0 }}
                accessibilityLabel="Search messages"
              />
            </View>
            <View style={{ position: 'relative', marginLeft: 12 }}>
              <TouchableOpacity
                style={{ borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setFilterSheetVisible(true)}
              >
                <Filter size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </SubHeader>
        <View style={styles.tabsContainer}>
          <View style={[styles.tabs, { backgroundColor: colors.surface }]}> 
            <TouchableOpacity
              style={[styles.tab, activeTab === 'groups' && styles.activeTab, { borderBottomColor: colors.primary }]}
              onPress={() => setActiveTab('groups')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'groups' ? colors.primary : '#666', fontFamily: fonts.medium, fontSize: fontSize.md }]}>Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'direct' && styles.activeTab, { borderBottomColor: colors.primary }]}
              onPress={() => setActiveTab('direct')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'direct' ? colors.primary : '#666', fontFamily: fonts.medium, fontSize: fontSize.md }]}>Direct Messages</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={activeTab === 'groups' ? filteredGroups : filteredDirectMessages as any[]}
          renderItem={activeTab === 'groups' ? (renderGroupItem as any) : (renderDirectItem as any)}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        {selectedImage && (
          <View style={{ marginBottom: 8, alignItems: 'flex-start' }}>
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 4 }}
            />
            <TouchableOpacity onPress={() => setSelectedImage(null)}>
              <Text style={{ color: colors.error, fontSize: 13 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Floating Action Button - only visible for creators */}
        {isCreator && (
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={() => {
              // Navigate to create group chat screen or show options
              router.push('/screens/creator/create-group' as any);
            }}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={filterSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterSheetVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onPress={() => setFilterSheetVisible(false)}
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
          <Pressable
            style={{ paddingVertical: 16, width: '100%' }}
            onPress={() => { setFilterOption('all'); setFilterSheetVisible(false); }}
          >
            <Text style={{ color: filterOption === 'all' ? colors.primary : colors.textPrimary, fontFamily: fonts.medium, fontSize: 17, textAlign: 'center' }}>All</Text>
          </Pressable>
          <Pressable
            style={{ paddingVertical: 16, width: '100%' }}
            onPress={() => { setFilterOption('unread'); setFilterSheetVisible(false); }}
          >
            <Text style={{ color: filterOption === 'unread' ? colors.primary : colors.textPrimary, fontFamily: fonts.medium, fontSize: 17, textAlign: 'center' }}>Unread</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flexGrow: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  chatName: {
    fontSize: 16,
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    fontSize: 13,
    textAlign: 'right',
    flexShrink: 0,
    maxWidth: 70,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    height: 22,
  },
  footerIcon: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
}); 