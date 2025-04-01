import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Image, Platform, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Search, Check, ChevronDown } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';

interface TeamMemberSuggestion {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  accessLevel: 'view' | 'edit' | null;
  enabled: boolean;
  group?: string;
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

const INITIAL_PERMISSIONS: Permission[] = [
  // My Page group
  {
    id: 'home',
    name: 'Home',
    description: 'View and manage home page content',
    accessLevel: null,
    enabled: false,
    group: 'My Page'
  },
  {
    id: 'collections',
    name: 'Collections',
    description: 'Access and manage content collections',
    accessLevel: null,
    enabled: false,
    group: 'My Page'
  },
  {
    id: 'chats',
    name: 'Chats',
    description: 'View and respond to chat messages',
    accessLevel: null,
    enabled: false,
    group: 'My Page'
  },
  {
    id: 'shop',
    name: 'Shop',
    description: 'Manage shop and products',
    accessLevel: null,
    enabled: false,
    group: 'My Page'
  },
  {
    id: 'memberships',
    name: 'Memberships',
    description: 'View and manage membership tiers',
    accessLevel: null,
    enabled: false,
    group: 'My Page'
  },
  {
    id: 'about',
    name: 'About',
    description: 'Edit page information and settings',
    accessLevel: null,
    enabled: false,
    group: 'My Page'
  },
  {
    id: 'recommendations',
    name: 'Recommendations',
    description: 'Manage content recommendations',
    accessLevel: null,
    enabled: false,
    group: 'My Page'
  },
  // Other permissions
  {
    id: 'chat',
    name: 'Chat',
    description: 'Access and manage chat messages',
    accessLevel: null,
    enabled: false,
  },
  {
    id: 'create',
    name: 'Create',
    description: 'Create and publish new content',
    accessLevel: null,
    enabled: false,
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Access and manage content library',
    accessLevel: null,
    enabled: false,
  },
  {
    id: 'audience',
    name: 'Audience',
    description: 'View audience analytics and insights',
    accessLevel: null,
    enabled: false,
  },
  {
    id: 'insights',
    name: 'Insights',
    description: 'View analytics and insights',
    accessLevel: null,
    enabled: false,
  },
  {
    id: 'moderation',
    name: 'Moderation Hub',
    description: 'Manage content moderation and user reports',
    accessLevel: null,
    enabled: false,
  },
  {
    id: 'promotions',
    name: 'Promotions',
    description: 'Manage promotional campaigns',
    accessLevel: null,
    enabled: false,
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
  const [permissions, setPermissions] = useState<Permission[]>(INITIAL_PERMISSIONS);
  const [showPermissions, setShowPermissions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return [];

    return MOCK_SUGGESTIONS.filter(member =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const groupedPermissions = useMemo(() => {
    const groups: { [key: string]: Permission[] } = {
      'My Page': [],
      'Other': []
    };

    permissions.forEach(permission => {
      if (permission.group === 'My Page') {
        groups['My Page'].push(permission);
      } else {
        groups['Other'].push(permission);
      }
    });

    return groups;
  }, [permissions]);

  const handleSelectMember = (member: TeamMemberSuggestion) => {
    setSelectedMember(member);
    setShowPermissions(true);
  };

  const handleTogglePermission = (permissionId: string) => {
    setPermissions(prev => prev.map(permission => 
      permission.id === permissionId
        ? { 
            ...permission, 
            enabled: !permission.enabled,
            accessLevel: !permission.enabled ? 'view' : null 
          }
        : permission
    ));
  };

  const handleAccessLevelChange = (permissionId: string, level: 'view' | 'edit') => {
    setPermissions(prev => prev.map(permission =>
      permission.id === permissionId
        ? { ...permission, accessLevel: level }
        : permission
    ));
    setActiveDropdown(null);
  };

  const canSendInvite = permissions.some(p => p.enabled && p.accessLevel);

  const handleSendInvite = () => {
    if (!selectedMember) return;

    showToast.success(
      'Invitation sent',
      `Team invitation has been sent to ${selectedMember.email}`
    );

    // Reset state
    setSearch('');
    setSelectedMember(null);
    setShowPermissions(false);
    setPermissions(INITIAL_PERMISSIONS);
    onClose();
  };

  const handleClose = () => {
    setSearch('');
    setSelectedMember(null);
    setShowPermissions(false);
    setPermissions(INITIAL_PERMISSIONS);
    onClose();
  };

  const renderPermissionGroup = (groupName: string, groupPermissions: Permission[]) => (
    <View key={groupName} style={styles.permissionGroup}>
      <Text style={[
        styles.groupTitle,
        {
          color: colors.textPrimary,
          fontFamily: fonts.bold,
          fontSize: fontSize.lg,
          includeFontPadding: false
        }
      ]}>
        {groupName}
      </Text>
      <View style={styles.permissionsList}>
        {groupPermissions.map(permission => (
          <View
            key={permission.id}
            style={[
              styles.permissionItem,
              { backgroundColor: colors.surface }
            ]}>
            <View style={styles.permissionHeader}>
              <View style={styles.permissionInfo}>
                <Text style={[
                  styles.permissionName,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  {permission.name}
                </Text>
                <Text style={[
                  styles.permissionDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  {permission.description}
                </Text>
              </View>
              <Switch
                value={permission.enabled}
                onValueChange={() => handleTogglePermission(permission.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={permission.enabled ? colors.buttonText : colors.surface}
              />
            </View>

            {permission.enabled && (
              <TouchableOpacity
                style={[
                  styles.accessLevelButton,
                  { backgroundColor: `${colors.primary}15` }
                ]}
                onPress={() => setActiveDropdown(activeDropdown === permission.id ? null : permission.id)}>
                <Text style={[
                  styles.accessLevelText,
                  {
                    color: colors.primary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  {permission.accessLevel === 'edit' ? 'Can Edit' : 'Can View'}
                </Text>
                <ChevronDown
                  size={16}
                  color={colors.primary}
                  style={{ transform: [{ rotate: activeDropdown === permission.id ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>
            )}

            {activeDropdown === permission.id && (
              <View style={[styles.dropdown, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    permission.accessLevel === 'view' && { backgroundColor: `${colors.primary}15` }
                  ]}
                  onPress={() => handleAccessLevelChange(permission.id, 'view')}>
                  <Text style={[
                    styles.dropdownOptionText,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.medium,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    Can View
                  </Text>
                  {permission.accessLevel === 'view' && (
                    <Check size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    permission.accessLevel === 'edit' && { backgroundColor: `${colors.primary}15` }
                  ]}
                  onPress={() => handleAccessLevelChange(permission.id, 'edit')}>
                  <Text style={[
                    styles.dropdownOptionText,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.medium,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    Can Edit
                  </Text>
                  {permission.accessLevel === 'edit' && (
                    <Check size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

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
              fontFamily: fonts.bold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
            {showPermissions ? 'Set Permissions' : 'Add Team Member'}
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
          {showPermissions ? (
            <>
              <View style={[styles.selectedMember, { backgroundColor: colors.surface }]}>
                <Image
                  source={{ uri: selectedMember?.avatar }}
                  style={styles.selectedAvatar}
                />
                <View style={styles.selectedInfo}>
                  <Text style={[
                    styles.selectedName,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    {selectedMember?.name}
                  </Text>
                  <Text style={[
                    styles.selectedEmail,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    {selectedMember?.email}
                  </Text>
                </View>
              </View>

              {Object.entries(groupedPermissions).map(([groupName, groupPermissions]) =>
                renderPermissionGroup(groupName, groupPermissions)
              )}
            </>
          ) : (
            <>
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
                        backgroundColor: colors.surface,
                        borderColor: selectedMember?.id === member.id ? colors.primary : 'transparent',
                      }
                    ]}
                    onPress={() => handleSelectMember(member)}>
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
              </View>
            </>
          )}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          {showPermissions ? (
            <>
              <TouchableOpacity
                onPress={() => setShowPermissions(false)}
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
                  Back
                </Text>
              </TouchableOpacity>
              <View style={styles.sendButton}>
                <Button
                  label="Send Invite"
                  onPress={handleSendInvite}
                  variant="primary"
                  disabled={!canSendInvite}
                />
              </View>
            </>
          ) : (
            <>
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
              <View style={styles.continueButton}>
                <Button
                  label="Continue"
                  onPress={() => setShowPermissions(true)}
                  variant="primary"
                  disabled={!selectedMember}
                />
              </View>
            </>
          )}
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
    gap: 16,
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
    borderWidth: 2,
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
  selectedMember: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    marginBottom: 4,
  },
  selectedEmail: {
    fontSize: 14,
  },
  permissionGroup: {
    gap: 12,
    marginBottom: 24,
  },
  groupTitle: {
    marginBottom: 8,
  },
  permissionsList: {
    gap: 12,
  },
  permissionItem: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  permissionInfo: {
    flex: 1,
    marginRight: 12,
  },
  permissionName: {
    marginBottom: 4,
  },
  permissionDescription: {
    lineHeight: 20,
  },
  accessLevelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  accessLevelText: {
    marginRight: 8,
  },
  dropdown: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  dropdownOptionText: {
    marginRight: 8,
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
  continueButton: {
    flex: 2,
  },
  sendButton: {
    flex: 2,
  },
});