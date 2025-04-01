import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Send, Check, UserPlus, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { AddTeamMemberModal } from '@/components/AddTeamMemberModal';
import { showToast } from '@/components/Toast';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: 'active' | 'pending';
    joinedDate?: string;
}

const MOCK_MEMBERS: TeamMember[] = [
    {
        id: '1',
        name: 'Sarah Anderson',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        status: 'active',
        joinedDate: '3/15/2024',
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        status: 'pending',
    },
];

export default function TeamScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<{
        visible: boolean;
        type: 'resend' | 'remove';
        member?: TeamMember;
    }>({
        visible: false,
        type: 'remove',
    });

    const handleResend = (member: TeamMember) => {
        setConfirmationModal({
            visible: true,
            type: 'resend',
            member,
        });
    };

    const handleRemove = (member: TeamMember) => {
        setConfirmationModal({
            visible: true,
            type: 'remove',
            member,
        });
    };

    const handleConfirmAction = () => {
        const { type, member } = confirmationModal;
        if (!member) return;

        if (type === 'resend') {
            showToast.success(
                'Invitation resent',
                `Invitation has been resent to ${member.email}`
            );
        } else {
            showToast.success(
                'Member removed',
                `${member.name} has been removed from the team`
            );
        }

        setConfirmationModal({ visible: false, type: 'remove' });
    };

    const renderMemberCard = (member: TeamMember) => (
        <View
            key={member.id}
            style={[styles.memberCard, { backgroundColor: colors.surface }]}
        >
            <View style={styles.memberMain}>
                <Image
                    source={{ uri: member.avatar }}
                    style={styles.avatar}
                    defaultSource={{ uri: 'https://via.placeholder.com/40' }}
                />
                <View style={styles.memberContent}>
                    <View style={styles.memberHeader}>
                        <Text
                            numberOfLines={1}
                            style={[
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
                        <View style={[
                            styles.statusBadge,
                            {
                                backgroundColor: member.status === 'active'
                                    ? `${colors.success}15`
                                    : `${colors.warning}15`
                            }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                {
                                    color: member.status === 'active' ? colors.success : colors.warning,
                                    fontFamily: fonts.medium,
                                    fontSize: fontSize.xs,
                                    includeFontPadding: false
                                }
                            ]}>
                                {member.status === 'active' ? 'Active' : 'Pending'}
                            </Text>
                        </View>
                    </View>

                    <Text
                        numberOfLines={1}
                        style={[
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

            <View style={styles.memberFooter}>
                <View style={styles.memberActions}>
                    {member.status === 'pending' ? (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: `${colors.primary}15` }]}
                            onPress={() => handleResend(member)}
                        >
                            <Send size={14} color={colors.primary} />
                            <Text style={[
                                styles.actionText,
                                {
                                    color: colors.primary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.xs,
                                    includeFontPadding: false
                                }
                            ]}>
                                Resend
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: `${colors.error}15` }]}
                        onPress={() => handleRemove(member)}
                    >
                        <Text style={[
                            styles.actionText,
                            {
                                color: colors.error,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.xs,
                                includeFontPadding: false
                            }
                        ]}>
                            Remove
                        </Text>
                    </TouchableOpacity>
                </View>

                {member.joinedDate && (
                    <View style={styles.joinedDateContainer}>
                        <Clock size={12} color={colors.textSecondary} />
                        <Text style={[
                            styles.joinedDateText,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.xs,
                                includeFontPadding: false
                            }
                        ]}>
                            Joined {member.joinedDate}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Team" />

            <View style={styles.header}>
                <Text style={[
                    styles.headerTitle,
                    {
                        color: colors.textPrimary,
                        fontFamily: fonts.bold,
                        fontSize: fontSize.xl,
                        includeFontPadding: false
                    }
                ]}>
                    Team Members
                </Text>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={() => setShowAddMemberModal(true)}
                >
                    <UserPlus size={16} color={colors.buttonText} />
                    <Text style={[
                        styles.addButtonText,
                        {
                            color: colors.buttonText,
                            fontFamily: fonts.semibold,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                        }
                    ]}>
                        Add Member
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.membersList}
                showsVerticalScrollIndicator={false}
            >
                {MOCK_MEMBERS.map(renderMemberCard)}
            </ScrollView>

            <ConfirmationModal
                visible={confirmationModal.visible}
                onClose={() => setConfirmationModal({ visible: false, type: 'remove' })}
                onConfirm={handleConfirmAction}
                title={confirmationModal.type === 'resend' ? 'Resend Invitation' : 'Remove Team Member'}
                description={
                    confirmationModal.type === 'resend'
                        ? `Would you like to resend the invitation to ${confirmationModal.member?.email}?`
                        : `Are you sure you want to remove ${confirmationModal.member?.name} from the team? This action cannot be undone.`
                }
                confirmLabel={confirmationModal.type === 'resend' ? 'Resend Invite' : 'Remove'}
                confirmVariant={confirmationModal.type === 'resend' ? 'primary' : 'error'}
            />

            <AddTeamMemberModal
                visible={showAddMemberModal}
                onClose={() => setShowAddMemberModal(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addButtonText: {
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 7,
    },
    membersList: {
        padding: 12,
        gap: 8,
    },
    memberCard: {
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    memberMain: {
        flexDirection: 'row',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    memberContent: {
        flex: 1,
        gap: 4,
    },
    memberHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    memberName: {
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        textTransform: 'capitalize',
    },
    memberEmail: {
        fontSize: 13,
    },
    memberFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    memberActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    actionText: {
        fontSize: 12,
    },
    joinedDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    joinedDateText: {
        fontSize: 12,
    },
});