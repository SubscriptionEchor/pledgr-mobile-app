import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { Feed } from '@/components/Feed';

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

export default function HomeScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}> 
            <Header />
            <Feed
                ListHeaderComponent={
                    <View style={[styles.filtersContainer, { backgroundColor: colors.background }]}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filtersScrollContent}
                        >
                            {/* First card: 2x2 grid with 'All' label */}
                            <View style={styles.cardWrapper}>
                              <TouchableOpacity style={[
                                styles.filterCard,
                                { 
                                  backgroundColor: colors.surface,
                                  shadowColor: colors.textPrimary,
                                  borderWidth: 2,
                                  borderColor: colors.primary
                                }
                              ]}
                                activeOpacity={0.8}
                              >
                                <View style={styles.allGridContainer}>
                                  {[0, 1, 2, 3].map((idx) => (
                                    <Image
                                      key={idx}
                                      source={{ uri: creatorImages[idx] }}
                                      style={styles.allGridImage}
                                    />
                                  ))}
                                </View>
                                <View style={styles.allLabelCenterContainer}>
                                  <Text style={[styles.allLabelText, { backgroundColor: colors.primary }]}>All</Text>
                                </View>
                              </TouchableOpacity>
                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                  styles.filterText,
                                  {
                                    color: colors.textPrimary,
                                    fontFamily: fonts.semibold,
                                    fontSize: fontSize.sm,
                                    includeFontPadding: false,
                                    marginTop: 6,
                                    textAlign: 'center',
                                    maxWidth: CARD_WIDTH,
                                  },
                                ]}
                              >
                                All
                              </Text>
                            </View>
                            {/* Other creator cards */}
                            {mockCreators.map((creator, idx) => (
                              <View key={creator.id} style={styles.cardWrapper}>
                                <TouchableOpacity style={[
                                  styles.filterCard,
                                  { 
                                    backgroundColor: colors.surface,
                                    shadowColor: colors.textPrimary
                                  }
                                ]}
                                  activeOpacity={0.8}
                                >
                                  <Image source={{ uri: creator.image }} style={styles.filterImage} />
                                </TouchableOpacity>
                                <Text
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                                  style={[
                                    styles.filterText,
                                    {
                                      color: colors.textPrimary,
                                      fontFamily: fonts.semibold,
                                      fontSize: fontSize.sm,
                                      includeFontPadding: false,
                                      marginTop: 6,
                                      textAlign: 'center',
                                      maxWidth: CARD_WIDTH,
                                    },
                                  ]}
                                >
                                  {creator.name}
                                </Text>
                              </View>
                            ))}
                        </ScrollView>
                    </View>
                }
            />
        </View>
    );
}

const CARD_WIDTH = 120;
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
});