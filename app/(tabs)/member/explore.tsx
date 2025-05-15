import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Search, ArrowLeft, X } from 'lucide-react-native';

const CATEGORIES = [
  'All categories',
  'Game mods & tools',
  'Crypto',
  'Video games',
  'Investing',
  'Lifestyle',
  'Finance',
  'Pop culture',
  'Movies and shows',
  'Podcasts',
  'Entertainment',
  'Comedy',
  'Role playing games',
  'Fitness',
  'Therapy',
];

const MOCK_CREATORS = [
  {
    id: '1',
    name: 'Paul Davison',
    headline: 'Cofounder at Clubhouse with @roh...',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    isFree: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    headline: 'Crypto Enthusiast',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    isFree: false,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    headline: 'Game Modder',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isFree: true,
  },
  {
    id: '4',
    name: 'Emily Clark',
    headline: 'Podcast Host',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isFree: false,
  },
];

export default function ExploreScreen() {
  const { colors, fonts, fontSize, isDark } = useTheme();
  const [selected, setSelected] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  // Filter creators by search text
  const filteredCreators = searchText.trim().length === 0
    ? []
    : MOCK_CREATORS.filter(c =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.headline.toLowerCase().includes(searchText.toLowerCase())
      );

  // Focus input when entering search state
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchActive]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>  
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Header */}
      {!searchActive ? (
        <View style={[styles.header, { backgroundColor: colors.background }]}> 
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize['2xl'] }}>Explore</Text>
          <TouchableOpacity onPress={() => setSearchActive(true)} style={styles.headerIconBtn}>
            <Search size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.header, { backgroundColor: colors.background }]}> 
          <TouchableOpacity onPress={() => { setSearchActive(false); setSearchText(''); }} style={styles.headerIconBtn}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.searchInputWrapper}>
            <TextInput
              ref={searchInputRef}
              style={[
                styles.searchInput,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.md,
                  backgroundColor: colors.surface,
                },
              ]}
              placeholder="Search creators..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              returnKeyType="search"
            />
            {!!searchText && (
              <Pressable onPress={() => setSearchText('')} style={styles.clearBtn}>
                <X size={18} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Main Content or Search Results */}
      {!searchActive ? (
        <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((cat, idx) => {
              const isSelected = idx === selected;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: isSelected ? colors.surfaceHover : colors.surface,
                      borderColor: isSelected ? colors.primary : 'transparent',
                    },
                    isSelected && { shadowColor: colors.primary, shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
                  ]}
                  onPress={() => setSelected(idx)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: isSelected ? colors.textPrimary : colors.textSecondary,
                      fontFamily: isSelected ? fonts.bold : fonts.regular,
                      fontSize: fontSize.md,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Featured Creators Section */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.lg, marginTop: 16, marginLeft: 16 }]}>Featured Creators</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredCreatorsContainer}
          >
            {MOCK_CREATORS.map((creator) => (
              <View key={creator.id} style={[styles.creatorCard, { backgroundColor: colors.surface }]}> 
                <Image source={{ uri: creator.avatar }} style={[styles.avatar, { backgroundColor: `${colors.primary}15` }]} />
                <View style={styles.creatorInfo}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md }} numberOfLines={1} ellipsizeMode="tail">{creator.name}</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }} numberOfLines={1} ellipsizeMode="tail">{creator.headline}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary, alignSelf: 'stretch', marginTop: 12 }]}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.sm, textAlign: 'center' }} numberOfLines={1} ellipsizeMode="tail">
                    {creator.isFree ? 'Join Now' : 'Subscribe'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* New Creators Section */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.lg, marginTop: 24, marginLeft: 16 }]}>New Creators</Text>
          <View style={styles.newCreatorsContainer}>
            {MOCK_CREATORS.map((creator) => (
              <View key={creator.id} style={[styles.creatorListCard, { backgroundColor: colors.surface }]}> 
                <Image source={{ uri: creator.avatar }} style={[styles.avatar, { backgroundColor: `${colors.primary}15` }]} />
                <View style={styles.creatorListInfo}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md, textAlign: 'left' }} numberOfLines={1} ellipsizeMode="tail">{creator.name}</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm, textAlign: 'left' }} numberOfLines={1} ellipsizeMode="tail">{creator.headline}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.sm }}>
                    {creator.isFree ? 'Join Now' : 'Subscribe'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.searchResultsContainer} keyboardShouldPersistTaps="handled">
          {filteredCreators.length === 0 && searchText.trim().length > 0 ? (
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md, textAlign: 'center', marginTop: 32 }}>No creators found.</Text>
          ) : (
            filteredCreators.map((creator) => (
              <View key={creator.id} style={[styles.creatorListCard, { backgroundColor: colors.surface }]}> 
                <Image source={{ uri: creator.avatar }} style={[styles.avatar, { backgroundColor: `${colors.primary}15` }]} />
                <View style={styles.creatorListInfo}>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.md, textAlign: 'left' }} numberOfLines={1} ellipsizeMode="tail">{creator.name}</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm, textAlign: 'left' }} numberOfLines={1} ellipsizeMode="tail">{creator.headline}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: colors.buttonText, fontFamily: fonts.bold, fontSize: fontSize.sm }}>
                    {creator.isFree ? 'Join Now' : 'Subscribe'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 2,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    marginBottom: 8,
  },
  featuredCreatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    gap: 12,
    marginBottom: 8,
  },
  creatorCard: {
    width: 180,
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 10,
  },
  creatorInfo: {
    alignItems: 'center',
    gap: 2,
  },
  newCreatorsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  creatorListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  creatorListInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    gap: 2,
  },
  actionButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
    marginBottom: 4,
  },
  headerIconBtn: {
    padding: 6,
    borderRadius: 20,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  clearBtn: {
    padding: 8,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultsContainer: {
    padding: 16,
    gap: 10,
  },
  pageContent: {
    paddingBottom: 24,
  },
});