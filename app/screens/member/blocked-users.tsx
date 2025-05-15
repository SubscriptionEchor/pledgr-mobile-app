import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubHeader } from '@/components/SubHeader';
import { useTheme } from '@/hooks/useTheme';
import { AlertCircle, Filter, ChevronDown, UserX, Search, MoreVertical } from 'lucide-react-native';
import { BlockedUsersFilterSheet } from '@/components/BlockedUsersFilterSheet';

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
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('All reasons');
  const [sortNewest, setSortNewest] = useState(true);
  const [users, setUsers] = useState(MOCK_BLOCKED_USERS);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [unblockModalUser, setUnblockModalUser] = useState<null | { id: string; name: string }>(null);

  // Filter and sort users
  let filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedReason === 'All reasons' || (u.reason && u.reason.toLowerCase() === selectedReason.toLowerCase()))
  );
  if (!sortNewest) {
    filteredUsers = [...filteredUsers].reverse();
  }

  const handleUnblock = (userId: string, userName: string) => {
    setUnblockModalUser({ id: userId, name: userName });
    setMenuUserId(null);
  };

  const confirmUnblock = () => {
    if (unblockModalUser) {
      setUsers(prev => prev.filter(u => u.id !== unblockModalUser.id));
      setUnblockModalUser(null);
      // Show a themed toast or message here if you have a Toast component
      // showToast.success('User unblocked', 'The user has been unblocked.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <SubHeader title="Blocked Users">
        <View style={styles.subHeaderRow}> 
          <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.surface, flex: 1 }]}> 
            <Search size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search blocked users..."
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, height: '100%', color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md, paddingVertical: 0 }}
              accessibilityLabel="Search blocked users"
            />
          </View>
          <TouchableOpacity
            style={{ marginLeft: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => setFilterSheetOpen(true)}
          >
            <Filter size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </SubHeader>
      <View style={{ flex: 1 }}>
        {/* Overlay to close kebab menu when clicking outside */}
        {menuUserId && (
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
            activeOpacity={1}
            onPress={() => setMenuUserId(null)}
          />
        )}
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
            <View style={[styles.userCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>{item.name}</Text>
                {item.reason && (
                  <Text style={{
                    color: colors.textSecondary,
                    fontFamily: fonts.medium,
                    fontSize: 13,
                    backgroundColor: colors.surface + '33',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    alignSelf: 'flex-start',
                    marginTop: 2,
                    overflow: 'hidden',
                  }}>{item.reason}</Text>
                )}
              </View>
              <TouchableOpacity
                style={{ padding: 8, marginLeft: 8 }}
                onPress={() => setMenuUserId(menuUserId === item.id ? null : item.id)}
              >
                <MoreVertical size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              {/* Kebab menu popover */}
              {menuUserId === item.id && (
                <View style={{ position: 'absolute', top: 54, right: 16, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, zIndex: 100 }}>
                  <TouchableOpacity
                    style={{ paddingVertical: 12, paddingHorizontal: 24 }}
                    onPress={() => handleUnblock(item.id, item.name)}
                  >
                    <Text style={{ color: colors.error, fontFamily: fonts.medium, fontSize: 15 }}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </View>
      {/* Custom unblock modal */}
      <Modal
        visible={!!unblockModalUser}
        transparent
        animationType="fade"
        onRequestClose={() => setUnblockModalUser(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: 28, alignItems: 'center', width: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.lg, marginBottom: 12, textAlign: 'center' }}>Unblock {unblockModalUser?.name}?</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md, marginBottom: 24, textAlign: 'center' }}>
              Are you sure you want to unblock this user?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginRight: 4 }}
                onPress={() => setUnblockModalUser(null)}
              >
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.error, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginLeft: 4 }}
                onPress={confirmUnblock}
              >
                <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.md }}>Unblock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <BlockedUsersFilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        selectedReason={selectedReason}
        onSelectReason={reason => setSelectedReason(reason)}
        sortNewest={sortNewest}
        onToggleSort={() => setSortNewest(s => !s)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    // visually connects to header
    // no border here, handled by headerContainer if needed
  },
  searchBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    height: 44,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    marginRight: 8,
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
  },
  sortText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: 16,
  },
  userCard: {
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
    marginRight: 10,
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
  },
  unblockText: {
    fontSize: 14,
    marginLeft: 4,
  },
}); 