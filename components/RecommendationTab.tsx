import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Image, 
  TextInput, 
  Keyboard, 
  EmitterSubscription, 
  Platform, 
  InteractionManager,
  Animated,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CheckCircle, Pencil, Trash2, X, AlertTriangle } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const RecommendationTab: React.FC<{
  setTabBarVisible?: (visible: boolean) => void;
}> = ({ setTabBarVisible }) => {
  const { colors, fonts, fontSize } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [recommendationText, setRecommendationText] = useState('');
  const [editingRecommendation, setEditingRecommendation] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recommendationToDelete, setRecommendationToDelete] = useState<any>(null);
  const [recommendations, setRecommendations] = useState([
    {
      id: 'r1',
      creator: {
        name: 'Emily Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        headline: 'Contemporary dance instructor & choreographer'
      },
      text: "Emily's dance tutorials completely transformed my teaching methods. Her approach to combining traditional techniques with modern styles is revolutionary. I especially appreciate her emphasis on proper form and the cultural context of different dance styles. Highly recommend to any dance educator!",
      date: '2 days ago'
    },
    {
      id: 'r2',
      creator: {
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        headline: 'Filmmaker & visual storyteller'
      },
      text: "Michael's film techniques and storytelling workshops have been incredibly valuable for my own creative projects. His eye for composition and lighting is unmatched, and he shares his knowledge in a way that's accessible to creators at any level.",
      date: '1 week ago'
    }
  ]);
  
  const recommendationInputRef = useRef<TextInput>(null);
  const searchInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const searchOverlayOpacity = useRef(new Animated.Value(0)).current;
  
  // Set up keyboard listeners
  useEffect(() => {
    let keyboardDidShowListener: EmitterSubscription;
    let keyboardDidHideListener: EmitterSubscription;
    
    // Set up the listeners
    keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        // Hide the tab bar when keyboard is visible
        setTabBarVisible?.(false);
      }
    );
    
    keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        // Show the tab bar when keyboard is hidden
        if (!showSearch) {
          setTabBarVisible?.(true);
        }
      }
    );
    
    // Clean up the listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      // Ensure tab bar is visible when component unmounts
      setTabBarVisible?.(true);
    };
  }, [setTabBarVisible, showSearch]);
  
  // Mock data for creators
  const mockCreators = [
    {
      id: 'c1',
      name: 'Emily Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      headline: 'Contemporary dance instructor & choreographer'
    },
    {
      id: 'c2',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      headline: 'Filmmaker & visual storyteller'
    },
    {
      id: 'c3',
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      headline: 'Digital artist & design educator'
    }
  ];
  
  // Filter creators based on search query
  const filteredCreators = searchQuery.length > 0
    ? mockCreators.filter(creator => 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.headline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const openSearch = () => {
    setShowSearch(true);
    setTabBarVisible?.(false);
    
    // Animate the search overlay
    Animated.timing(searchOverlayOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
    
    // Focus the search input after animation
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };
  
  const closeSearch = () => {
    // Animate the search overlay closing
    Animated.timing(searchOverlayOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start(() => {
      setShowSearch(false);
      
      // If there's no keyboard, show the tab bar
      if (!isKeyboardVisible) {
        setTabBarVisible?.(true);
      }
    });
    
    // Clear search
    setSearchQuery('');
  };
  
  const handleSelectCreator = (creator: any) => {
    setSelectedCreator(creator);
    
    // Close the search overlay
    closeSearch();
    
    // Wait for overlay to close and then focus on recommendation
    setTimeout(() => {
      recommendationInputRef.current?.focus();
    }, 200);
  };
  
  const handleAddRecommendation = () => {
    // Here you would typically save the recommendation
    console.log('Adding recommendation for:', selectedCreator?.name);
    console.log('Recommendation text:', recommendationText);
    
    // For demonstration, we'll add it to our state
    if (selectedCreator && recommendationText.trim()) {
      const newRecommendation = {
        id: `r${Date.now()}`,
        creator: selectedCreator,
        text: recommendationText,
        date: 'Just now'
      };
      
      setRecommendations([newRecommendation, ...recommendations]);
      
      // Clear the form
      setSelectedCreator(null);
      setRecommendationText('');
      
      // Dismiss keyboard after adding recommendation
      Keyboard.dismiss();
    }
  };
  
  const handleEditRecommendation = (recommendation: any) => {
    // Set editing state
    setEditingRecommendation(recommendation);
    setIsEditMode(true);
    setSelectedCreator(recommendation.creator);
    setRecommendationText(recommendation.text);
    
    // Scroll to the form
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      
      // Focus on the text input
      setTimeout(() => {
        recommendationInputRef.current?.focus();
      }, 200);
    }, 100);
  };
  
  const handleUpdateRecommendation = () => {
    // Update the recommendation in the list
    if (editingRecommendation && recommendationText.trim()) {
      const updatedRecommendations = recommendations.map(rec => {
        if (rec.id === editingRecommendation.id) {
          return {
            ...rec,
            text: recommendationText,
            date: 'Edited just now'
          };
        }
        return rec;
      });
      
      setRecommendations(updatedRecommendations);
      
      // Clear editing state
      setEditingRecommendation(null);
      setIsEditMode(false);
      setSelectedCreator(null);
      setRecommendationText('');
      
      // Dismiss keyboard
      Keyboard.dismiss();
    }
  };
  
  const handleConfirmDelete = (recommendation: any) => {
    setRecommendationToDelete(recommendation);
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteRecommendation = () => {
    if (recommendationToDelete) {
      // Filter out the recommendation to delete
      const updatedRecommendations = recommendations.filter(
        rec => rec.id !== recommendationToDelete.id
      );
      
      setRecommendations(updatedRecommendations);
      
      // Clear delete state
      setRecommendationToDelete(null);
      setShowDeleteConfirm(false);
    }
  };
  
  const handleCancel = () => {
    // Clear form and editing state
    if (isEditMode) {
      setIsEditMode(false);
      setEditingRecommendation(null);
    }
    
    setSelectedCreator(null);
    setRecommendationText('');
    
    // Dismiss keyboard after canceling
    Keyboard.dismiss();
  };
  
  // Render the search overlay
  const renderSearchOverlay = () => {
    if (!showSearch) return null;
    
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.background,
          zIndex: 1000,
          opacity: searchOverlayOpacity,
          elevation: 5,
        }}
      >
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border
        }}>
          <TouchableOpacity 
            onPress={closeSearch}
            style={{ marginRight: 10 }}
          >
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            ref={searchInputRef}
            placeholder="Search for creators to recommend..."
            style={{
              flex: 1,
              color: colors.textPrimary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              paddingVertical: 8,
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
        </View>
        
        <ScrollView 
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {filteredCreators.length > 0 ? (
            filteredCreators.map((creator, index) => (
              <TouchableOpacity
                key={creator.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
                onPress={() => handleSelectCreator(creator)}
              >
                <Image
                  source={{ uri: creator.avatar }}
                  style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 4 }}>
                    {creator.name}
                  </Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary }}>
                    {creator.headline}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : searchQuery.length > 0 ? (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.medium, color: colors.textSecondary }}>
                No creators found with that name
              </Text>
            </View>
          ) : (
            <View style={{ padding: 16 }}>
              <Text style={{ fontFamily: fonts.medium, color: colors.textSecondary }}>
                Type to search for creators
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    );
  };
  
  // Render delete confirmation modal
  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm || !recommendationToDelete) return null;
    
    return (
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: 400,
            alignItems: 'center'
          }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Image
                source={{ uri: recommendationToDelete.creator.avatar }}
                style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 12 }}
              />
              <Text style={{ 
                fontFamily: fonts.semibold, 
                fontSize: fontSize.md, 
                color: colors.textPrimary,
                textAlign: 'center'
              }}>
                {recommendationToDelete.creator.name}
              </Text>
            </View>
            
            <Text style={{ 
              fontFamily: fonts.regular, 
              fontSize: fontSize.md, 
              color: colors.textSecondary,
              marginBottom: 24,
              textAlign: 'center'
            }}>
              Are you sure you want to delete your recommendation? This action cannot be undone.
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border
                }}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: '#ef4444'
                }}
                onPress={handleDeleteRecommendation}
              >
                <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: '#ffffff' }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
      {renderSearchOverlay()}
      {renderDeleteConfirmation()}
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Search and Add Recommendation Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
            {isEditMode ? 'Edit Recommendation' : 'Add Recommendation'}
          </Text>
          
          {/* Search Bar Button - only show when not in edit mode */}
          {!isEditMode && !selectedCreator && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
                marginBottom: 16,
              }}
              onPress={openSearch}
            >
              <Text style={{ 
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
              }}>
                Search for creators to recommend...
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Recommendation Form */}
          {selectedCreator && (
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 24,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Image
                  source={{ uri: selectedCreator.avatar }}
                  style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 4 }}>
                    {selectedCreator.name}
                  </Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary }}>
                    {selectedCreator.headline}
                  </Text>
                </View>
              </View>
              
              <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 8 }}>
                Why are you recommending this creator?
              </Text>
              
              <TextInput
                ref={recommendationInputRef}
                placeholder="Write your recommendation here..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.md,
                  color: colors.textPrimary,
                  minHeight: 120,
                  marginBottom: 16
                }}
                value={recommendationText}
                onChangeText={setRecommendationText}
                onFocus={() => {
                  setTabBarVisible?.(false);
                }}
              />
              
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    backgroundColor: 'transparent'
                  }}
                  onPress={handleCancel}
                >
                  <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.textPrimary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    backgroundColor: colors.primary
                  }}
                  onPress={isEditMode ? handleUpdateRecommendation : handleAddRecommendation}
                >
                  <Text style={{ fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.buttonText }}>
                    {isEditMode ? 'Update Recommendation' : 'Add Recommendation'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        {/* Existing Recommendations Section */}
        <Text style={{ fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 }}>
          Your Recommendations
        </Text>
        
        {/* List of existing recommendations */}
        {recommendations.map((recommendation) => (
          <View 
            key={recommendation.id}
            style={{
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 16
            }}
          >
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <Image
                source={{ uri: recommendation.creator.avatar }}
                style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: 2 }}>
                  {recommendation.creator.name}
                </Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 2 }}>
                  {recommendation.creator.headline}
                </Text>
              </View>
            </View>
            
            <Text style={{ fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.textPrimary, lineHeight: 22 }}>
              {recommendation.text}
            </Text>
            
            <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f1f5f9',
                  borderRadius: 6
                }}
                onPress={() => handleEditRecommendation(recommendation)}
              >
                <Pencil size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fee2e2',
                  borderRadius: 6
                }}
                onPress={() => handleConfirmDelete(recommendation)}
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}; 