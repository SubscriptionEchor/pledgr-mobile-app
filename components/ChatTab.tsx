import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const ChatTab: React.FC = () => {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  
  const chatGroups = [
    {
      id: 'chat1',
      name: 'Hip-Hop Fans',
      description: 'Discuss all things hip-hop dance!',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      members: 34,
      access: 'all',
    },
    {
      id: 'chat2',
      name: 'Beginner Dancers',
      description: 'A place for newcomers to ask questions.',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      members: 18,
      access: 'paid',
    },
    {
      id: 'chat3',
      name: 'Choreo Creators',
      description: 'Share your latest choreography ideas.',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      members: 22,
      access: 'Gold Tier',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Create Chat Group Button */}
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
            onPress={() => router.push('/screens/creator/create-group' as any)}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Create Group</Text>
          </TouchableOpacity>
        </View>
        
        {/* Chat Groups List */}
        <View style={{ marginBottom: 24 }}>
          {chatGroups.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>No chat groups yet.</Text>
          ) : (
            <>
              {chatGroups.map((group) => (
                <View
                  key={group.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    marginBottom: 20,
                    flexDirection: 'row',
                    overflow: 'hidden',
                    alignItems: 'stretch',
                  }}
                >
                  {/* Image */}
                  <View style={{
                    width: 100,
                    aspectRatio: 1,
                    backgroundColor: '#eee',
                    borderRadius: 10,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <Image
                      source={{ uri: group.image }}
                      style={{ width: '100%', height: '100%', borderRadius: 10 }}
                      resizeMode="cover"
                    />
                  </View>
                  
                  {/* Info section */}
                  <View style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                  }}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        fontSize: 16,
                        marginBottom: 2,
                        marginTop: 8,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {group.name}
                    </Text>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontFamily: fonts.medium,
                        fontSize: 14,
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {group.description}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 }}>
                      {/* Members count badge */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <User size={15} color="#B0B3B8" style={{ marginRight: 5 }} />
                        <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: 13, marginRight: 2 }}>{group.members}</Text>
                        <Text style={{ color: colors.textSecondary, fontFamily: fonts.medium, fontSize: 12 }}>members</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}; 