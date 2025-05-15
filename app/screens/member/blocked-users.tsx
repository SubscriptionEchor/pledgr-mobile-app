import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubHeader } from '@/components/SubHeader';
import { useTheme } from '@/hooks/useTheme';
import { AlertCircle, Filter, ChevronDown, UserX } from 'lucide-react-native';

const MOCK_BLOCKED_USERS = [
  {
    id: '1',
    name: 'Blocked User 6',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    blockedOn: 'Today',
    reason: 'Unwanted contact',
  },
  {
    id: '2',
    name: 'Blocked User 10',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    blockedOn: 'Yesterday',
    reason: 'Other',
  },
  {
    id: '3',
    name: 'Blocked User 1',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    blockedOn: '2 weeks ago',
    reason: 'Unwanted contact',
  },
  {
    id: '4',
    name: 'Blocked User 15',
    avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
    blockedOn: '3 weeks ago',
    reason: 'Other',
  },
  {
    id: '5',
    name: 'Blocked User 3',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    blockedOn: '3 weeks ago',
    reason: 'Inappropriate content',
  },
];

export default function BlockedUsersScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [users, setUsers] = useState(MOCK_BLOCKED_USERS);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <SubHeader title="Blocked Users" />
      <View style={styles.infoBoxWrapper}>
        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <AlertCircle size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>About blocking users</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>When you block someone, they won't be able to follow you, view your content, or interact with you. They won't be notified that you've blocked them.</Text>
          </View>
        </View>
      </View>
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <TextInput
            placeholder="Search blocked users..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}
            accessibilityLabel="Search blocked users"
          />
        </View>
        <TouchableOpacity style={[styles.filterBtn, { borderColor: colors.border }]}>
          <Filter size={18} color={colors.textPrimary} />
          <Text style={[styles.filterText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>Filter</Text>
          <ChevronDown size={16} color={colors.textSecondary} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sortBtn, { borderColor: colors.border }]} onPress={() => setSortNewest(s => !s)}>
          <Text style={[styles.sortText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>{sortNewest ? 'Newest first' : 'Oldest first'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, textAlign: 'center', marginTop: 48 }}>
            No blocked users found.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>{item.name}</Text>
              <Text style={[styles.blockedOn, { color: colors.textSecondary, fontFamily: fonts.regular }]}>{item.blockedOn}</Text>
            </View>
            <View style={styles.reasonPillWrapper}>
              <Text style={[styles.reasonPill, { backgroundColor: colors.background, color: colors.textSecondary, fontFamily: fonts.medium }]}>{item.reason}</Text>
            </View>
            <TouchableOpacity style={[styles.unblockBtn, { backgroundColor: colors.primary }]}>
              <UserX size={18} color={colors.buttonText} />
              <Text style={[styles.unblockText, { color: colors.buttonText, fontFamily: fonts.bold }]}>Unblock</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoBoxWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  infoTitle: {
    fontSize: 15,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    backgroundColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    marginLeft: 4,
  },
  sortBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    marginLeft: 2,
  },
  sortText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  blockedOn: {
    fontSize: 13,
  },
  reasonPillWrapper: {
    marginRight: 8,
  },
  reasonPill: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  unblockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 4,
    gap: 4,
  },
  unblockText: {
    fontSize: 14,
    marginLeft: 4,
  },
}); 