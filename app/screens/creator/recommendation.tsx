import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal, Dimensions, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Search, X, Info, Pencil } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { showToast } from '@/components/Toast';
import { Button } from '@/components/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Creator {
  id: string;
  name: string;
  avatar: string;
  title: string;
  verified?: boolean;
  recommendation?: string;
}

const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Sarah Anderson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    title: 'Digital artist and creative technologist',
    verified: true,
    recommendation: 'added'
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    title: 'Web3 educator & community builder',
    recommendation: 'New one'
  },
  {
    id: '3',
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    title: 'Tech writer & blockchain enthusiast'
  }
];

export default function RecommendationScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recommendations, setRecommendations] = useState<Creator[]>(
    MOCK_CREATORS.filter(creator => creator.recommendation)
  );
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendationText, setRecommendationText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    setShowSuggestions(text.length > 0);
  };

  const handleCreatorSelect = (creator: Creator) => {
    setSelectedCreator(creator);
    setRecommendationText(creator.recommendation || '');
    setIsEditing(!!creator.recommendation);
    setModalVisible(true);
  };

  const handleSaveRecommendation = () => {
    if (!selectedCreator) return;

    if (isEditing) {
      // Update existing recommendation
      setRecommendations(prev => 
        prev.map(r => r.id === selectedCreator.id ? 
          { ...r, recommendation: recommendationText } : r
        )
      );
      showToast.success('Recommendation updated', 'Your changes have been saved');
    } else {
      // Add new recommendation
      setRecommendations(prev => [
        ...prev, 
        { ...selectedCreator, recommendation: recommendationText }
      ]);
      showToast.success('Recommendation added', 'Creator has been added to your recommendations');
    }
    
    setModalVisible(false);
    setSelectedCreator(null);
    setRecommendationText('');
    setSearch('');
    setShowSuggestions(false);
  };

  const handleRemoveRecommendation = (creatorId: string) => {
    setRecommendations(recommendations.filter(r => r.id !== creatorId));
    showToast.success('Recommendation removed', 'Creator has been removed from your recommendations');
  };

  const filteredCreators = MOCK_CREATORS.filter(creator =>
    (creator.name.toLowerCase().includes(search.toLowerCase()) ||
    creator.title.toLowerCase().includes(search.toLowerCase())) &&
    !recommendations.find(r => r.id === creator.id)
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
      <Info size={48} color={colors.textSecondary} />
      <Text style={[
        styles.emptyTitle,
        {
          color: colors.textPrimary,
          fontFamily: fonts.semibold,
          fontSize: fontSize.lg,
          includeFontPadding: false
        }
      ]}>
        No recommendations yet
      </Text>
      <Text style={[
        styles.emptyDescription,
        {
          color: colors.textSecondary,
          fontFamily: fonts.regular,
          fontSize: fontSize.md,
          includeFontPadding: false
        }
      ]}>
        Search for creators to recommend to your fans
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Recommendations" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.bold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
            Recommendations for your fans
          </Text>
          <Text style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            Highlight other creators your fans might like. The creators you recommend will be notified and they'll be able to recommend you to their fans too.
          </Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Search for a creator to recommend..."
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.searchInput,
              {
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false
              }
            ]}
          />
        </View>

        {showSuggestions && filteredCreators.length > 0 && (
          <View style={styles.suggestions}>
            {filteredCreators.map(creator => (
              <TouchableOpacity
                key={creator.id}
                style={[styles.suggestionItem, { backgroundColor: colors.surface }]}
                onPress={() => handleCreatorSelect(creator)}
              >
                <Image source={{ uri: creator.avatar }} style={styles.avatar} />
                <View style={styles.creatorInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={[
                      styles.creatorName,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      {creator.name}
                    </Text>
                    {creator.verified && (
                      <Text style={[
                        styles.verifiedText,
                        {
                          color: colors.success,
                          fontFamily: fonts.medium,
                          fontSize: fontSize.xs,
                          includeFontPadding: false,
                          marginLeft: 4
                        }
                      ]}>
                        Verified
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    styles.creatorTitle,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    {creator.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {(!showSuggestions || search.length === 0) && (
          recommendations.length > 0 ? (
            <View style={styles.recommendationsList}>
              <Text style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.lg,
                  includeFontPadding: false
                }
              ]}>
                Your recommendations
              </Text>
              {recommendations.map(creator => (
                <View
                  key={creator.id}
                  style={[styles.recommendationItem, { backgroundColor: colors.surface }]}
                >
                  <View style={styles.recommendationHeader}>
                    <View style={styles.creatorProfile}>
                      <Image source={{ uri: creator.avatar }} style={styles.avatar} />
                      <View style={styles.creatorInfo}>
                        <View style={styles.nameContainer}>
                          <Text style={[
                            styles.creatorName,
                            {
                              color: colors.textPrimary,
                              fontFamily: fonts.semibold,
                              fontSize: fontSize.md,
                              includeFontPadding: false
                            }
                          ]}>
                            {creator.name}
                          </Text>
                          {creator.verified && (
                            <Text style={[
                              styles.verifiedText,
                              {
                                color: colors.success,
                                fontFamily: fonts.medium,
                                fontSize: fontSize.xs,
                                includeFontPadding: false,
                                marginLeft: 4
                              }
                            ]}>
                              Verified
                            </Text>
                          )}
                        </View>
                        <Text style={[
                          styles.creatorTitle,
                          {
                            color: colors.textSecondary,
                            fontFamily: fonts.regular,
                            fontSize: fontSize.sm,
                            includeFontPadding: false
                          }
                        ]}>
                          {creator.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        onPress={() => handleCreatorSelect(creator)}
                        style={[styles.editButton, { backgroundColor: `${colors.primary}15` }]}
                      >
                        <Pencil size={16} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveRecommendation(creator.id)}
                        style={[styles.removeButton, { backgroundColor: `${colors.error}15` }]}
                      >
                        <X size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.recommendationContent, { backgroundColor: `${colors.primary}08` }]}>
                    <Text style={[
                      styles.recommendationText,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      {creator.recommendation}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            !showSuggestions && renderEmptyState()
          )
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.bold,
                  fontSize: fontSize.lg,
                  includeFontPadding: false
                }
              ]}>
                {isEditing ? 'Edit Recommendation' : 'Add Recommendation'}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {selectedCreator && (
              <View style={styles.modalBody}>
                <View style={styles.creatorProfile1}>
                  <Image 
                    source={{ uri: selectedCreator.avatar }} 
                    style={styles.modalAvatar} 
                  />
                  <View style={styles.creatorModalInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={[
                        styles.creatorName,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.semibold,
                          fontSize: fontSize.md,
                          includeFontPadding: false
                        }
                      ]}>
                        {selectedCreator.name}
                      </Text>
                      {selectedCreator.verified && (
                        <Text style={[
                          styles.verifiedText,
                          {
                            color: colors.success,
                            fontFamily: fonts.medium,
                            fontSize: fontSize.xs,
                            includeFontPadding: false,
                            marginLeft: 4
                          }
                        ]}>
                          Verified
                        </Text>
                      )}
                    </View>
                    <Text style={[
                      styles.creatorTitle,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      {selectedCreator.title}
                    </Text>
                  </View>
                </View>

                <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                  <TextInput
                    value={recommendationText}
                    onChangeText={setRecommendationText}
                    placeholder="Write your recommendation..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    style={[
                      styles.modalInput,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}
                    maxLength={280}
                  />
                  <Text style={[
                    styles.characterCount,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.sm,
                      includeFontPadding: false
                    }
                  ]}>
                    {recommendationText.length}/280 characters
                  </Text>
                </View>

                <Button
                  label={isEditing ? "Update" : "Add recommendation"}
                  onPress={handleSaveRecommendation}
                  variant="primary"
                  disabled={recommendationText.trim().length === 0}
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
  },
  suggestions: {
    gap: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  creatorInfo: {
    flex: 1,
    gap: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 16,
  },
  verifiedText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  creatorTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    marginTop: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  recommendationsList: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  recommendationItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  creatorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  creatorProfile1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationContent: {
    padding: 16,
  },
  recommendationText: {
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: SCREEN_WIDTH > 500 ? 500 : SCREEN_WIDTH - 40,
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
  },
  modalBody: {
    gap: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  creatorModalInfo: {
    flex: 1,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalInput: {
    minHeight: 120,
    padding: 16,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    padding: 8,
  }
});