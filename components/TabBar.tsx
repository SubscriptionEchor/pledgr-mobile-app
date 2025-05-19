import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  'Videos',
  'Shorts',
  'Live',
  'Playlists',
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { colors, fonts, fontSize } = useTheme();

  return (
      <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: isActive ? '#111' : '#757575',
                fontFamily: isActive ? fonts.bold : fonts.regular,
                  fontSize: fontSize.lg,
                fontWeight: isActive ? 'bold' : 'normal',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {tab}
            </Text>
            {isActive && (
              <View
                style={{
                  height: 3,
                  width: 20,
                  backgroundColor: '#111',
                  borderRadius: 2,
                  marginTop: 4,
                  alignSelf: 'center',
                }}
              />
              )}
          </TouchableOpacity>
        );
      })}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    marginBottom: 0,
    minHeight: 44,
  },
  tabButton: {
    marginRight: 20,
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    minWidth: 0,
  },
}); 