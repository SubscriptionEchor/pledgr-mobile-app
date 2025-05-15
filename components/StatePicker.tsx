import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Platform, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, X, Check } from 'lucide-react-native';
import { useState, useMemo, useEffect } from 'react';
import { commonAPI } from '@/lib/api/common';

interface State {
  id: string;
  name: string;
  state_code: string;
  country_code: string;
}

interface StatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (state: string) => void;
  countryCode?: string;
  selectedState?: string;
}

export function StatePicker({ visible, onClose, onSelect, countryCode, selectedState }: StatePickerProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [search, setSearch] = useState('');
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      if (!countryCode) return;

      setIsLoading(true);
      try {
        const response = await commonAPI.getStates(countryCode);
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (visible && countryCode) {
      fetchStates();
    }
  }, [countryCode, visible]);

  const filteredAndSortedStates = useMemo(() => {
    const filtered = states.filter((state) =>
      state.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!selectedState || !search) {
      return filtered;
    }

    // Move selected state to the top if it's in the filtered results
    return filtered.sort((a, b) => {
      if (a.name === selectedState) return -1;
      if (b.name === selectedState) return 1;
      return 0;
    });
  }, [search, states, selectedState]);

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const handleSelect = (state: State) => {
    setSearch('');
    onSelect(state.name);
  };

  const renderSelectedState = () => {
    if (!selectedState || search) return null;

    const selected = states.find(s => s.name === selectedState);
    if (!selected) return null;

    return (
      <View style={[styles.selectedSection, { backgroundColor: `${colors.primary}08` }]}>
        <Text style={[
          styles.selectedTitle,
          {
            color: colors.textSecondary,
            fontFamily: fonts.medium,
            fontSize: fontSize.sm,
            includeFontPadding: false
          }
        ]}>
          Selected
        </Text>
        <TouchableOpacity
          style={[
            styles.stateItem,
            { 
              borderBottomColor: colors.border,
              backgroundColor: `${colors.primary}20`,
              marginTop: 8,
            }
          ]}
          onPress={() => handleSelect(selected)}>
          <Text style={[
            styles.stateName,
            {
              color: colors.primary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.md,
              includeFontPadding: false
            }
          ]}>
            {selected.name}
          </Text>
          <Check size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
              includeFontPadding: false
            }
          ]}>
            Select State
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search states"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.searchInput,
              {
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}
          />
        </View>

        {renderSelectedState()}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[
              styles.loadingText,
              {
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false,
                marginTop: 12
              }
            ]}>
              Loading states...
            </Text>
          </View>
        ) : (
          <>
            {!search && selectedState && (
              <View style={[styles.listHeader, { backgroundColor: `${colors.primary}08` }]}>
                <Text style={[
                  styles.listHeaderText,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  All States
                </Text>
              </View>
            )}
            <FlatList
              data={filteredAndSortedStates}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = item.name === selectedState;
                if (isSelected && !search) return null;

                return (
                  <TouchableOpacity
                    style={[
                      styles.stateItem,
                      { 
                        borderBottomColor: colors.border,
                        backgroundColor: isSelected ? `${colors.primary}20` : 'transparent'
                      }
                    ]}
                    onPress={() => handleSelect(item)}>
                    <Text style={[
                      styles.stateName,
                      {
                        color: isSelected ? colors.primary : colors.textPrimary,
                        fontFamily: isSelected ? fonts.semibold : fonts.regular,
                        fontSize: fontSize.md,
                        includeFontPadding: false
                      }
                    ]}>
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[
                    styles.emptyText,
                    {
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                      includeFontPadding: false
                    }
                  ]}>
                    No states found
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
  },
  selectedSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  selectedTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listHeaderText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  stateName: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});