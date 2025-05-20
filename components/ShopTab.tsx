import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

export const ShopTab: React.FC = () => {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  
  const products = [
    {
      id: 'prod1',
      name: 'Dance T-Shirt',
      description: 'High quality cotton t-shirt with dance logo.',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      price: '$24.99',
      access: 'all',
    },
    {
      id: 'prod2',
      name: 'Workshop Pass',
      description: 'Access to the next online dance workshop.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
      price: '$49.99',
      access: 'paid',
    },
    {
      id: 'prod3',
      name: 'Gold Hoodie',
      description: 'Exclusive hoodie for Gold Tier members.',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      price: '$59.99',
      access: 'Gold Tier',
    },
  ];

  // Split products into rows of 2
  const rows = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push(products.slice(i, i + 2));
  }

  const handleAddProduct = () => {
    router.push('/screens/shop/CreateProductScreen');
  };
  
  const handleEditProduct = (productId: string) => {
    // Handle product editing
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: 400 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Create Product Button */}
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
            onPress={handleAddProduct}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 16 }}>Add product</Text>
          </TouchableOpacity>
        </View>
        
        {/* Product Cards List */}
        <View style={{ marginBottom: 24 }}>
          {products.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>No products in your shop yet.</Text>
          ) : (
            <>
              {rows.map((row, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                  {row.map(product => (
                    <View
                      key={product.id}
                      style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        padding: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 10,
                      }}
                    >
                      {/* Image */}
                      <View style={{ width: '100%', aspectRatio: 1.2, position: 'relative', backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' }}>
                        <Image
                          source={{ uri: product.image }}
                          style={{ width: '100%', height: '100%', borderRadius: 10 }}
                          resizeMode="cover"
                        />
                      </View>
                      
                      {/* Info section below image */}
                      <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12, minHeight: 90 }}>
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
                          {product.name}
                        </Text>
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontFamily: fonts.medium,
                            fontSize: 14,
                            marginBottom: 8,
                          }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {product.description}
                        </Text>
                        
                        {/* Edit and Kebab menu buttons below description, tightly spaced */}
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 0, marginBottom: 0 }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: colors.primary,
                              borderRadius: 8,
                              paddingHorizontal: 14,
                              paddingVertical: 6,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => handleEditProduct(product.id)}
                            activeOpacity={0.85}
                          >
                            <Text style={{ color: colors.buttonText, fontFamily: fonts.medium, fontSize: 13 }}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#f1f5f9',
                              borderRadius: 8,
                              width: 36,
                              height: 36,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => { /* handle kebab menu */ }}
                            activeOpacity={0.85}
                          >
                            <Text style={{ color: '#64748B', fontSize: 18, fontWeight: 'bold' }}>⋮</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                  {/* If row has only one item, add a spacer to keep grid alignment */}
                  {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}; 