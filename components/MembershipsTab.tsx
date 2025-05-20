import React, { useState, useRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, FlatList, Modal, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { User, Folder, Edit, FileText, EyeOff, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type MembershipsTabProps = {
  navigation?: any;
};

export const MembershipsTab: React.FC<MembershipsTabProps> = ({ navigation: propNavigation }) => {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const [activeMembershipIdx, setActiveMembershipIdx] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const memberships = [
    {
      id: 'mem1',
      name: 'Gold Membership',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      pricing: {
        monthly: 19.99,
        quarterly: 54.99,
        yearly: 199.99
      },
      postCount: 24,
      members: 120,
      maxMembers: 150, // Limited membership spots
    },
    {
      id: 'mem2',
      name: 'Silver Membership',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      pricing: {
        monthly: 9.99,
        quarterly: 26.99,
        yearly: 99.99
      },
      postCount: 12,
      members: 80,
      maxMembers: null, // Unlimited membership
    },
    {
      id: 'mem3',
      name: 'Bronze Membership',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      pricing: {
        monthly: 4.99,
        quarterly: 12.99,
        yearly: 49.99
      },
      postCount: 5,
      members: 40,
      maxMembers: 50, // Limited membership spots
    },
  ];
  
  // Bottom sheet menu options
  const menuOptions = [
    { id: 'edit', label: 'Edit tier', icon: Edit },
    { id: 'welcome', label: 'Edit welcome note', icon: FileText },
    { id: 'unpublish', label: 'Unpublish tier', icon: EyeOff },
    { id: 'delete', label: 'Delete tier', icon: Trash2, danger: true },
  ];
  
  const handleMenuItemPress = (optionId: string) => {
    // Handle menu option selection based on optionId
    console.log(`Selected option: ${optionId} for membership: ${activeMenuId}`);
    setIsMenuVisible(false);
  };
  
  const openMenu = (membershipId: string) => {
    setActiveMenuId(membershipId);
    setIsMenuVisible(true);
  };
  
  const navigateToTierDetails = (tierId: string) => {
    router.push({
      pathname: '/screens/creator/TierDetailsScreen',
      params: { tierId }
    });
  };

  const navigateToCreateCollection = () => {
    router.push('/screens/creator/CreateCollectionScreen');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Create Membership Button */}
        <View style={{ marginTop: 0, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={navigateToCreateCollection}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Create tier</Text>
          </TouchableOpacity>
        </View>
        
        {/* Memberships Cards */}
        <View style={{ marginBottom: 24 }}>
          {memberships.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>No memberships created yet.</Text>
          ) : (
            <>
              <FlatList
                data={memberships}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="start"
                decelerationRate="fast"
                onScroll={e => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / (e.nativeEvent.layoutMeasurement.width));
                  setActiveMembershipIdx(idx);
                }}
                scrollEventThrottle={16}
                style={{ marginBottom: 16 }}
                renderItem={({ item: mem, index: idx }) => (
                  <View
                    key={mem.id}
                    style={{
                      width: 300,
                      marginRight: 16,
                      backgroundColor: '#fff',
                      padding: 0,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Image with overlay badges and kebab menu */}
                    <View style={{ width: '100%', aspectRatio: 1.2, position: 'relative', backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' }}>
                      <Image
                        source={{ uri: mem.image }}
                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        resizeMode="cover"
                      />
                      {/* Overlay badges container */}
                      <View style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 3,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 6,
                      }}>
                        {/* Free trial badge */}
                        <View style={{
                          backgroundColor: '#d1fae5',
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          marginBottom: 4,
                        }}>
                          <Text style={{ color: '#047857', fontWeight: '600', fontSize: 13 }}>Free trial - 7d</Text>
                        </View>
                        {/* Members count badge */}
                        <View style={{
                          backgroundColor: '#d1fae5',
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                          <User size={15} color={'#047857'} style={{ marginRight: 4 }} />
                          <Text style={{ color: '#047857', fontWeight: '600', fontSize: 13 }}>
                            {mem.members}
                            {mem.maxMembers ? `/${mem.maxMembers}` : ''}
                          </Text>
                        </View>
                      </View>
                      {/* Kebab menu button at top right */}
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: '#f1f5f9',
                          borderRadius: 8,
                          width: 36,
                          height: 36,
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                        onPress={() => openMenu(mem.id)}
                        activeOpacity={0.85}
                      >
                        <Text style={{ color: '#64748B', fontSize: 18, fontWeight: 'bold' }}>⋮</Text>
                      </TouchableOpacity>
                      {/* Post count badge above title */}
                      <View style={{
                        alignSelf: 'flex-start',
                        marginTop: 8,
                        marginBottom: 4,
                        backgroundColor: '#F1F5F9',
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <Folder size={15} color="#B0B3B8" style={{ marginRight: 3 }} />
                        <Text style={{
                          color: colors.textPrimary,
                          fontFamily: fonts.bold,
                          fontSize: 13,
                          marginRight: 2,
                        }}>{mem.postCount}</Text>
                        <Text style={{
                          color: colors.textSecondary,
                          fontFamily: fonts.medium,
                          fontSize: 12,
                        }}>posts</Text>
                      </View>
                    </View>
                    {/* Title and pricing options */}
                    <View>
                      <Text
                        style={{
                          color: colors.textPrimary,
                          fontFamily: fonts.medium,
                          fontSize: 16,
                          marginBottom: 8,
                          marginTop: 8,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {mem.name}
                      </Text>
                      
                      {/* Pricing options */}
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        <View style={{ 
                          backgroundColor: '#f1f5f9',
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 6
                        }}>
                          <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 13 }}>
                            ${mem.pricing.monthly}/mo
                          </Text>
                        </View>
                        
                        <View style={{ 
                          backgroundColor: '#f1f5f9',
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 6
                        }}>
                          <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 13 }}>
                            ${mem.pricing.quarterly}/qtr
                          </Text>
                        </View>
                        
                        <View style={{ 
                          backgroundColor: '#f1f5f9',
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 6
                        }}>
                          <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 13 }}>
                            ${mem.pricing.yearly}/yr
                          </Text>
                        </View>
                      </View>
                      
                      {/* View details button below pricing */}
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: colors.primary,
                          borderWidth: 1.5,
                          borderRadius: 8,
                          paddingVertical: 10,
                          paddingHorizontal: 24,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 2,
                          alignSelf: 'flex-start',
                        }}
                        onPress={() => navigateToTierDetails(mem.id)}
                        activeOpacity={0.85}
                      >
                        <Text style={{ color: colors.primary, fontFamily: fonts.medium, fontSize: 15 }}>View details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              
              {/* Pagination dots */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 18, gap: 8 }}>
                {memberships.map((_, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: idx === activeMembershipIdx ? colors.primary : '#e5e7eb',
                      marginHorizontal: 4,
                    }}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
      
      {/* Bottom Sheet Menu */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setIsMenuVisible(false)}
        >
          <Pressable 
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 16,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
            onPress={e => e.stopPropagation()}
          >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 40, height: 5, backgroundColor: '#e0e0e0', borderRadius: 3 }} />
            </View>
            
            {menuOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                  borderBottomWidth: option.id === 'delete' ? 0 : 1,
                  borderBottomColor: '#f1f1f1',
                }}
                onPress={() => handleMenuItemPress(option.id)}
                activeOpacity={0.7}
              >
                <option.icon 
                  size={20} 
                  color={option.danger ? '#ef4444' : colors.textPrimary} 
                  style={{ marginRight: 14 }} 
                />
                <Text style={{ 
                  fontSize: 16, 
                  fontFamily: fonts.medium, 
                  color: option.danger ? '#ef4444' : colors.textPrimary 
                }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}; 