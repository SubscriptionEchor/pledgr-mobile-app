import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Image, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Search, Check } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';

interface TeamMemberSuggestion {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const MOCK_SUGGESTIONS: TeamMemberSuggestion[] = [
  {
    id: '1',
    name: 'Sarah Anderson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: '2',
    name: 'David Chen',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  },
];

interface AddTeamMemberModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddTeamMemberModal({ visible, onClose }: AddTeamMemberModalProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMemberSuggestion | null>(null);

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return [];

    return MOCK_SUGGESTIONS.filter(member =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelectMember = (member: TeamMemberSuggestion) => {
    setSelectedMember(member);
  };

  const handleSendInvite = () => {
    if (!selectedMember) return;

    showToast.success(
      'Invitation sent',
      `Team invitation has been sent to ${selectedMember.email}`
    );

    // Reset state
    setSearch('');
    setSelectedMember(null);
    onClose();
  };

  const handleClose = () => {
    setSearch('');
    setSelectedMember(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
            Add Team Member
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Search and select team members to invite
          </Text>

          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name or email"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.searchInput,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}
              autoFocus
            />
          </View>

          <View style={styles.resultsList}>
            {filteredSuggestions.map(member => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.resultItem,
                  {
                    backgroundColor: selectedMember?.id === member.id
                      ? `${colors.primary}15`
                      : colors.surface,
                  }
                ]}
                onPress={() => handleSelectMember(member)}
              >
                <View style={styles.resultContent}>
                  <Image
                    source={{ uri: member.avatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={[
                      styles.memberName,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      {member.name}
                    </Text>
                    <Text style={[
                      styles.memberEmail,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      {member.email}
                    </Text>
                  </View>
                </View>
                {selectedMember?.id === member.id && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Check size={16} color={colors.buttonText} />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {search.trim() && filteredSuggestions.length === 0 && (
              <View style={[styles.noResults, { backgroundColor: colors.surface }]}>
                <Text style={[
                  styles.noResultsText,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  No results found for "{search}"
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.cancelButton, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.cancelButtonText,
              {
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <View style={styles.sendButton}>
            <Button
              label="Send Invite"
              onPress={handleSendInvite}
              variant="primary"
              disabled={!selectedMember}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  subtitle: {
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  resultsList: {
    gap: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
  },
});