import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState, useEffect } from 'react';
import { Settings, FileText, MessageSquare, Store, Plus, X } from 'lucide-react-native';
import { BasicInformation } from '@/components/BasicInformation';
import { PageSettings } from '@/components/PageSettings';
import { WelcomeNote } from '@/components/WelcomeNote';
import { PostAndProduct } from '@/components/PostAndProduct';
import { useCreatorSettings } from '@/hooks/useCreatorSettings';

type TabType = 'basics' | 'settings' | 'welcome' | 'content';

interface Tab {
    id: TabType;
    label: string;
    icon: any;
}

interface TagModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (tags: string[]) => void;
    selectedTags: string[];
}

const TABS: Tab[] = [
    { id: 'basics', label: 'Basics', icon: FileText },
    { id: 'settings', label: 'Page Settings', icon: Settings },
    { id: 'welcome', label: 'Welcome Note', icon: MessageSquare },
    { id: 'content', label: 'Posts & Products', icon: Store },
];

const AVAILABLE_TAGS = [
    'Manga',
    'Action',
    'Fantasy',
    'Adventure',
    'Drama',
    'Comedy',
];

function TagModal({ visible, onClose, onSelect, selectedTags }: TagModalProps) {
    const { colors, fonts, fontSize } = useTheme();
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        setSelected(selectedTags);
    }, [selectedTags]);

    const handleSelect = (tag: string) => {
        setSelected(prev => {
            if (prev.includes(tag)) {
                return prev.filter(t => t !== tag);
            }
            return [...prev, tag];
        });
    };

    const handleAddTags = () => {
        onSelect(selected);
        onClose();
    };

    if (!visible) return null;

    return (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <View style={styles.modalHeader}>
                    <Text style={[
                        styles.modalTitle,
                        {
                            color: colors.textPrimary,
                            fontFamily: fonts.bold,
                            fontSize: fontSize.xl,
                            includeFontPadding: false
                        }
                    ]}>
                        Add Featured Tags
                    </Text>
                </View>

                <ScrollView style={styles.tagList}>
                    {AVAILABLE_TAGS.map(tag => (
                        <TouchableOpacity
                            key={tag}
                            style={[
                                styles.tagOption,
                                { backgroundColor: colors.surface }
                            ]}
                            onPress={() => handleSelect(tag)}>
                            <View style={[
                                styles.checkbox,
                                {
                                    borderColor: selected.includes(tag) ? colors.primary : colors.border,
                                    backgroundColor: selected.includes(tag) ? colors.primary : 'transparent',
                                }
                            ]}>
                                {selected.includes(tag) && (
                                    <View style={[styles.checkmark, { borderColor: colors.buttonText }]} />
                                )}
                            </View>
                            <Text style={[
                                styles.tagOptionText,
                                {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.regular,
                                    fontSize: fontSize.md,
                                    includeFontPadding: false
                                }
                            ]}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={[styles.cancelButton, { backgroundColor: colors.surface }]}
                        onPress={onClose}>
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
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                        onPress={handleAddTags}>
                        <Text style={[
                            styles.addButtonText,
                            {
                                color: colors.buttonText,
                                fontFamily: fonts.semibold,
                                fontSize: fontSize.md,
                                includeFontPadding: false
                            }
                        ]}>
                            Add selected tags
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function EditPageScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [activeTab, setActiveTab] = useState<TabType>('basics');
    const [showTagModal, setShowTagModal] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { fetchCreatorSettings } = useCreatorSettings();

    useEffect(() => {
        fetchCreatorSettings();
    }, []);

    const handleTagSelect = (tags: string[]) => {
        setSelectedTags(tags);
    };

    const handleTagRemove = (tagToRemove: string) => {
        setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basics':
                return <BasicInformation />;
            case 'settings':
                return <PageSettings />;
            case 'welcome':
                return <WelcomeNote />;
            case 'content':
                return (
                    <PostAndProduct
                        onAddTags={() => setShowTagModal(true)}
                        selectedTags={selectedTags}
                        onRemoveTag={handleTagRemove}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Edit Page" />

            <View style={[styles.pillContainer, { borderBottomColor: colors.border }]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pillsScroll}
                >
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <TouchableOpacity
                                key={tab.id}
                                style={[
                                    styles.pill,
                                    { backgroundColor: isActive ? colors.primary : 'rgba(0, 0, 0, 0.03)' },
                                    isActive && styles.activePill
                                ]}
                                onPress={() => setActiveTab(tab.id)}
                            >
                                <tab.icon
                                    size={18}
                                    color={isActive ? colors.buttonText : colors.textSecondary}
                                    style={styles.pillIcon}
                                />
                                <Text style={[
                                    styles.pillLabel,
                                    {
                                        color: isActive ? colors.buttonText : colors.textSecondary,
                                        fontFamily: fonts.medium,
                                        fontSize: fontSize.sm,
                                        includeFontPadding: false
                                    }
                                ]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>

            <TagModal
                visible={showTagModal}
                onClose={() => setShowTagModal(false)}
                onSelect={handleTagSelect}
                selectedTags={selectedTags}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pillContainer: {
        paddingVertical: 12,
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
        borderBottomWidth: 1,
    },
    pillsScroll: {
        gap: 8,
        paddingRight: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        gap: 6,
    },
    activePill: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    pillIcon: {
        marginRight: 2,
    },
    pillLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        width: '90%',
        maxWidth: 500,
        borderRadius: 16,
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
    },
    tagList: {
        maxHeight: 400,
    },
    tagOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: 10,
        height: 5,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        transform: [{ rotate: '-45deg' }],
    },
    tagOptionText: {
        fontSize: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
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
    },
    addButton: {
        flex: 2,
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
    },
});