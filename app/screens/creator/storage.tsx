import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { HardDrive } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { StorageUpgradeModal } from '@/components/StorageUpgradeModal';

export default function StorageScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Storage" />

            <View style={styles.content}>
                <View style={styles.header}>
                    <HardDrive size={32} color={colors.primary} />
                    <Text style={[
                        styles.title,
                        {
                            color: colors.textPrimary,
                            fontFamily: fonts.bold,
                            fontSize: fontSize['2xl'],
                        }
                    ]}>
                        4.3GB available
                    </Text>
                    <Text style={[
                        styles.subtitle,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.md,
                        }
                    ]}>
                        You've used 15.7GB of storage space, out of 20GB total storage available.
                    </Text>
                </View>

                <View style={[styles.usageBar, { backgroundColor: colors.surface }]}>
                    <View
                        style={[
                            styles.usageProgress,
                            {
                                backgroundColor: colors.primary,
                                width: '78.5%',
                            }
                        ]}
                    />
                </View>
            </View>

            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                    label="Get more storage"
                    onPress={() => setShowUpgradeModal(true)}
                    variant="primary"
                />
            </View>

            <StorageUpgradeModal
                visible={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        gap: 24,
    },
    header: {
        alignItems: 'center',
        gap: 12,
    },
    title: {
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    subtitle: {
        lineHeight: 24,
        textAlign: 'center',
    },
    usageBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    usageProgress: {
        height: '100%',
        borderRadius: 4,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
});