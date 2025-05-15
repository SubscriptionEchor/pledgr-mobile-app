import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ViewStyle, Modal, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { MessageCircle, ChevronDown, SlidersHorizontal, X } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { Feed } from '@/components/Feed';
import React, { useState } from 'react';

const creatorImages = [
  'https://cdn.midjourney.com/318d28b2-a5b0-4b5a-abed-6c92244eee04/0_0.png',
  'https://cdn.midjourney.com/d53070af-49ec-4405-a4a1-3895aa1b70ce/0_0.png',
  'https://cdn.midjourney.com/52ff3edc-747d-4523-8dc5-acbd3517b482/0_0.png',
  'https://cdn.midjourney.com/d53070af-49ec-4405-a4a1-3895aa1b70ce/0_2.png',
  'https://cdn.midjourney.com/95acf581-8165-4b59-83d4-3f7e5a7d57fe/0_3.png',
  'https://cdn.midjourney.com/95acf581-8165-4b59-83d4-3f7e5a7d57fe/0_0.png',
  'https://cdn.midjourney.com/f1ebc2b8-3f8f-4f1d-92ec-f166632b8f74/0_1.png',
];

const mockCreators = [
  {
    id: '1',
    name: 'Resolving your Trust',
    image: creatorImages[0],
  },
  {
    id: '2',
    name: 'Amed Bali Community',
    image: creatorImages[1],
  },
  {
    id: '3',
    name: 'Airport History',
    image: creatorImages[2],
  },
  {
    id: '4',
    name: 'Toronto Rentals',
    image: creatorImages[3],
  },
  {
    id: '5',
    name: 'Creative Studio',
    image: creatorImages[4],
  },
  {
    id: '6',
    name: 'Artisan Collective',
    image: creatorImages[5],
  },
  {
    id: '7',
    name: 'Music Makers',
    image: creatorImages[6],
  },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'music', label: 'Music' },
  { key: 'podcasts', label: 'Podcasts' },
  { key: 'audiobooks', label: 'Audiobooks' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * 3) / 2; // 2 columns, 3 gaps (left, middle, right)

// Helper style for 1:1 square card content
const squareCardContent: ViewStyle = { aspectRatio: 1, width: '100%', justifyContent: 'center', alignItems: 'center' };

const CATEGORIES = [
  'All',
  'Game mods & tools',
  'Crypto',
  'Video Games',
  'Investing',
  'Lifestyle',
  'Finance',
  'Pop culture',
  'Movies & shows',
  'Podcasts',
  'Entertainment',
  'Comedy',
];

const CONTENT_TYPES = [
  'All',
  'Text',
  'Link',
  'Image',
  'Livestream',
  'Audio',
  'Poll',
];

export default function HomeScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();
    const [openFilter, setOpenFilter] = useState<null | 'categories' | 'type'>(null);
    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedContentType, setSelectedContentType] = useState('All');
    const [tempCategory, setTempCategory] = useState(selectedCategory);
    const [tempContentType, setTempContentType] = useState(selectedContentType);

    // Add a filter card as the first item
    const creatorListWithFilter = [{ id: 'filter', isFilter: true }, ...mockCreators];

    const renderHeader = () => (
        <>
            <Header />
            {/* Creators horizontal row with filter card */}
            <View style={{ backgroundColor: '#fff', paddingVertical: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 }}>
                <FlatList
                    data={creatorListWithFilter}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}
                    renderItem={({ item }) => (
                        <>
                            {'isFilter' in item && item.isFilter ? (
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center', marginRight: CARD_GAP }}
                                    activeOpacity={0.85}
                                    onPress={() => setShowFilterSheet(true)}
                                >
                                    <SlidersHorizontal size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.gridCardWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.gridCard,
                                            { backgroundColor: colors.surface },
                                        ]}
                                        activeOpacity={0.85}
                                    >
                                        <View style={styles.rowCardContent}>
                                            {'image' in item && (
                                                <View style={styles.rowImageContainer}>
                                                    <Image source={{ uri: item.image }} style={styles.rowImage} />
                                                </View>
                                            )}
                                            {'name' in item && (
                                                <View style={styles.rowTextContainer}>
                                                    <Text
                                                        numberOfLines={2}
                                                        ellipsizeMode="tail"
                                                        style={[
                                                            styles.gridCardText,
                                                            {
                                                                color: colors.textPrimary,
                                                                fontFamily: fonts.semibold,
                                                                fontSize: fontSize.sm,
                                                                includeFontPadding: false,
                                                                textAlign: 'left',
                                                            },
                                                        ]}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                />
            </View>
            <View style={{ height: 1, backgroundColor: '#E5E5E5', width: '100%' }} />
            {/* Selected filter badges row */}
            {(selectedCategory !== 'All' || selectedContentType !== 'All') && (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8, gap: 8 }}>
                    {selectedCategory !== 'All' && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 }}>
                            <Text style={{ color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.sm, marginRight: 4 }}>{selectedCategory}</Text>
                            <TouchableOpacity onPress={() => { setSelectedCategory('All'); setTempCategory('All'); }} hitSlop={8}>
                                <X size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {selectedContentType !== 'All' && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 }}>
                            <Text style={{ color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.sm, marginRight: 4 }}>{selectedContentType}</Text>
                            <TouchableOpacity onPress={() => { setSelectedContentType('All'); setTempContentType('All'); }} hitSlop={8}>
                                <X size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </>
    );

    return (
        <View style={[styles.container, { backgroundColor: 'oklch(0.928 0.006 264.531)' }]}>
            <FlatList
                data={[{ id: 'feed' }]}
                renderItem={() => <Feed />}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            />
            {/* Filter Bottom Sheet/Modal */}
            <Modal
                visible={showFilterSheet}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFilterSheet(false)}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }} onPress={() => setShowFilterSheet(false)}>
                    <Pressable style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 24, paddingTop: 32 }} onPress={e => e.stopPropagation()}>
                        {/* Close button (fixed) */}
                        <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }} onPress={() => setShowFilterSheet(false)}>
                            <X size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '100%' }}>
                            <Text style={{ color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.lg, marginBottom: 24, textAlign: 'center' }}>Filter</Text>
                            {/* Categories */}
                            <View style={{ backgroundColor: '#F6F6F6', borderRadius: 14, padding: 16, marginBottom: 24 }}>
                                <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md, marginBottom: 12 }}>Categories</Text>
                                {CATEGORIES.map(cat => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                                        onPress={() => setTempCategory(cat)}
                                    >
                                        <View style={{
                                            width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: cat === tempCategory ? colors.primary : colors.border,
                                            marginRight: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: cat === tempCategory ? colors.primary : 'transparent',
                                        }}>
                                            {cat === tempCategory && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' }} />}
                                        </View>
                                        <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Content Types */}
                            <View style={{ backgroundColor: '#F6F6F6', borderRadius: 14, padding: 16, marginBottom: 32 }}>
                                <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md, marginBottom: 12 }}>Content Types</Text>
                                {CONTENT_TYPES.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                                        onPress={() => setTempContentType(type)}
                                    >
                                        <View style={{
                                            width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: type === tempContentType ? colors.primary : colors.border,
                                            marginRight: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: type === tempContentType ? colors.primary : 'transparent',
                                        }}>
                                            {type === tempContentType && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' }} />}
                                        </View>
                                        <Text style={{ color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Done button */}
                            <TouchableOpacity
                                style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16 }}
                                onPress={() => {
                                    setSelectedCategory(tempCategory);
                                    setSelectedContentType(tempContentType);
                                    setShowFilterSheet(false);
                                }}
                            >
                                <Text style={{ color: '#fff', fontFamily: fonts.semibold, fontSize: fontSize.md }}>Done</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const CARD_HEIGHT = 80;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerIconBtn: {
        padding: 6,
        borderRadius: 20,
    },
    filtersContainer: {
        paddingVertical: 16,
    },
    filtersScrollContent: {
        alignItems: 'center',
        paddingRight: 16,
        paddingLeft: 16,
    },
    filterCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'flex-end',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
        overflow: 'hidden',
        padding: 0,
    },
    filterImage: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
    },
    filterText: {
        width: '100%',
    },
    content: {
        flex: 1,
    },
    title: {
        marginBottom: 20,
    },
    cardWrapper: {
        alignItems: 'center',
        width: CARD_WIDTH,
        marginRight: 16,
        minHeight: CARD_HEIGHT + 38,
        justifyContent: 'flex-start',
    },
    allGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
    },
    allGridImage: {
        width: '50%',
        height: '50%',
        aspectRatio: CARD_WIDTH / (CARD_HEIGHT / 2),
    },
    allLabelCenterContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -24 }, { translateY: -24 }],
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    allLabelText: {
        color: '#fff',
        borderRadius: 24,
        width: 48,
        height: 48,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 48,
        overflow: 'hidden',
    },
    filterOptionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        gap: 12,
    },
    filterOptionBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 22,
        borderWidth: 1.5,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterOptionText: {
        fontWeight: '600',
    },
    gridContent: {
        paddingHorizontal: 12,
        paddingBottom: 24,
    },
    gridRow: {
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    gridCardWrapper: {
        width: CARD_WIDTH,
        alignItems: 'stretch',
        marginRight: CARD_GAP,
        marginBottom: 0,
    },
    gridCard: {
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 0,
        marginBottom: 0,
        marginRight: CARD_GAP,
    },
    rowCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 80,
    },
    rowImageContainer: {
        width: 56,
        height: 56,
        borderRadius: 10,
        overflow: 'hidden',
        marginLeft: 12,
        marginRight: 12,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    rowTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 12,
    },
    gridCardText: {
        fontWeight: '600',
        paddingVertical: 8,
        paddingHorizontal: 8,
        maxWidth: '100%',
    },
    bottomSheetBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
        zIndex: 100,
    },
    bottomSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 220,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
});