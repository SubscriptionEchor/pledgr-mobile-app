import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react-native';
import { showToast } from '@/components/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';
import { useRouter } from 'expo-router';

function convertToUrlFriendly(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim(); // Remove leading/trailing spaces
}

export default function CreatePageScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const { updateUserRole, isLoading, setIsCreatorCreated } = useAuth();
    const router = useRouter();
    const [pageName, setPageName] = useState('');
    const [pageUrl, setPageUrl] = useState('');
    const [logo, setLogo] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        // Update page URL whenever page name changes
        setPageUrl(convertToUrlFriendly(pageName));
    }, [pageName]);

    const handleLogoUpload = () => {
        // Implement logo upload logic
    };

    const handleCreatePage = async () => {
        if (!pageName.trim()) {
            showToast.error('Required field', 'Please enter a page name');
            return;
        }

        if (!pageUrl.trim()) {
            showToast.error('Required field', 'Please enter a page URL');
            return;
        }

        setIsCreating(true);

        try {
            // Update user role to creator
            await updateUserRole(UserRole.CREATOR);
            // Set creator created flag
            await setIsCreatorCreated(true);

            showToast.success(
                'Page created successfully',
                'Welcome to your creator journey!'
            );

            // Navigate back to home screen
            router.replace('/creator/home');
        } catch (error) {
            showToast.error(
                'Error',
                'Failed to create page. Please try again.'
            );
            setIsCreating(false);
        }
    };

    // Show loading state while auth context is loading
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Create a page" />

            <View style={styles.mainContainer}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[
                        styles.subtitle,
                        {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.lg,
                        }
                    ]}>
                        Fill in some details for your fans
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.logoSection}>
                            <Text style={[
                                styles.logoLabel,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                }
                            ]}>
                                Add page logo
                            </Text>
                            <TouchableOpacity
                                onPress={handleLogoUpload}
                                style={[styles.logoUpload, { backgroundColor: colors.surface }]}
                                disabled={isCreating}
                            >
                                {logo ? (
                                    <Image source={{ uri: logo }} style={styles.logoImage} />
                                ) : (
                                    <View style={styles.logoPlaceholder}>
                                        <ImageIcon size={24} color={colors.textSecondary} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                }
                            ]}>
                                Page name
                            </Text>
                            <TextInput
                                value={pageName}
                                onChangeText={setPageName}
                                placeholder="Enter a name for your page"
                                placeholderTextColor={colors.textSecondary}
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.surface,
                                        color: colors.textPrimary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                    }
                                ]}
                                editable={!isCreating}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[
                                styles.label,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                }
                            ]}>
                                Page URL
                            </Text>
                            <View style={[
                                styles.urlInput,
                                { backgroundColor: colors.surface }
                            ]}>
                                <Text style={[
                                    styles.urlPrefix,
                                    {
                                        color: colors.textSecondary,
                                        fontFamily: fonts.regular,
                                        fontSize: fontSize.md,
                                    }
                                ]}>
                                    pledgr.com/
                                </Text>
                                <TextInput
                                    value={pageUrl}
                                    onChangeText={setPageUrl}
                                    placeholder="your-page-name"
                                    placeholderTextColor={colors.textSecondary}
                                    style={[
                                        styles.urlField,
                                        {
                                            color: colors.textPrimary,
                                            fontFamily: fonts.regular,
                                            fontSize: fontSize.md,
                                        }
                                    ]}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={false}
                                />
                            </View>
                            <Text style={[
                                styles.urlHint,
                                {
                                    color: colors.textSecondary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.sm,
                                }
                            ]}>
                                This URL will be used to access your creator page
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        style={[
                            styles.createButton,
                            {
                                backgroundColor: colors.primary,
                                opacity: (!pageName.trim() || !pageUrl.trim() || isCreating) ? 0.5 : 1,
                            }
                        ]}
                        onPress={handleCreatePage}
                        disabled={!pageName.trim() || !pageUrl.trim() || isCreating}
                    >
                        {isCreating ? (
                            <ActivityIndicator color={colors.buttonText} />
                        ) : (
                            <Text style={[
                                styles.createButtonText,
                                {
                                    color: colors.buttonText,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.md,
                                }
                            ]}>
                                Create page
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        gap: 32,
        paddingBottom: 100, // Add padding to account for the sticky button
    },
    subtitle: {
        textAlign: 'center',
    },
    form: {
        gap: 24,
    },
    logoSection: {
        alignItems: 'center',
        gap: 12,
    },
    logoLabel: {
        textAlign: 'center',
    },
    logoUpload: {
        width: 120,
        height: 120,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    logoPlaceholder: {
        alignItems: 'center',
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        marginLeft: 4,
    },
    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    urlInput: {
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    urlPrefix: {
        opacity: 0.5,
    },
    urlField: {
        flex: 1,
        height: '100%',
    },
    urlHint: {
        marginLeft: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    createButton: {
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});