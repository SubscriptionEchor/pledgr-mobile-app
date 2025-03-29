import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Crown, Sparkles, UserPlus, Send, Clock } from 'lucide-react-native';
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
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isUpgraded, setIsUpgraded] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<{
        visible: boolean;
        type: 'resend' | 'remove';
        member?: TeamMember;
    }>({
        visible: false,
        type: 'remove',
    });

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUpgraded(true);
        setIsUpgrading(false);
    };

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
                            }
                        ]}>
                            Joined {member.joinedDate}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    if (!isUpgraded) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <SubHeader title="Team" />
                <View style={styles.centeredContainer}>
                    <View style={[styles.upgradeCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.iconWrapper}>
                            <Crown size={32} color={colors.primary} />
                        </View>

                        <Text style={[
                            styles.title,
                            {
                                color: colors.textPrimary,
                                fontFamily: fonts.bold,
                                fontSize: fontSize['2xl'],
                            }
                        ]}>
                            Upgrade to Pro
                        </Text>

                        <Text style={[
                            styles.subtitle,
                            {
                                color: colors.textSecondary,
                                fontFamily: fonts.regular,
                                fontSize: fontSize.md,
                            }
                        ]}>
                            Unlock team collaboration features and invite team members to help manage your creator page
                        </Text>

                        <View style={styles.features}>
                            <View style={styles.featureItem}>
                                <Sparkles size={20} color={colors.primary} />
                                <Text style={[
                                    styles.featureText,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                    }
                                ]}>
                                    Add unlimited team members
                                </Text>
                            </View>

                            <View style={styles.featureItem}>
                                <Sparkles size={20} color={colors.primary} />
                                <Text style={[
                                    styles.featureText,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                    }
                                ]}>
                                    Assign custom roles and permissions
                                </Text>
                            </View>

                            <View style={styles.featureItem}>
                                <Sparkles size={20} color={colors.primary} />
                                <Text style={[
                                    styles.featureText,
                                    {
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                    }
                                ]}>
                                    Track team activity and manage access
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
                            onPress={handleUpgrade}
                            disabled={isUpgrading}
                        >
                            {isUpgrading ? (
                                <ActivityIndicator color={colors.buttonText} />
                            ) : (
                                <Text style={[
                                    styles.upgradeButtonText,
                                    {
                                        color: colors.buttonText,
                                        fontFamily: fonts.semibold,
                                        fontSize: fontSize.md,
                                    }
                                ]}>
                                    Upgrade to Pro
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

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
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    upgradeCard: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        padding: 24,
    },
    scrollView: {
        flex: 1,
    },
    upgradeContent: {
        padding: 20,
        alignItems: 'center',
    },
    membersList: {
        padding: 12,
        gap: 8,
    },
    iconWrapper: {
        marginBottom: 8,
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
    },
    features: {
        width: '100%',
        gap: 20,
        marginBottom: 24,
        marginTop: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        flex: 1,
    },
    upgradeButton: {
        height: 44,
        width: 170,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    upgradeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
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