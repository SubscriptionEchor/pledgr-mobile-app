import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  image: string;
}

export function Card({ image }: CardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>  
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    width: '100%',
    margin: 0,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.7,
    backgroundColor: '#eee',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}); 