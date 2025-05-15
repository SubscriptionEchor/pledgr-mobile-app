import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Platform, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, X, Check } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { useUserContext } from '@/lib/context/UserContext';

interface CountryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: string) => void;
  selectedCountry?: string;
}

export function CountryPicker({ visible, onClose, onSelect, selectedCountry }: CountryPickerProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [search, setSearch] = useState('');
  const { countries, isLoading } = useUserContext();

  const filteredAndSortedCountries = useMemo(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!selectedCountry || !search) {
      return filtered;
    }

    // Move selected country to the top if it's in the filtered results
    return filtered.sort((a, b) => {
      if (a.name === selectedCountry) return -1;
      if (b.name === selectedCountry) return 1;
      return 0;
    });
  }, [search, countries, selectedCountry]);

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const handleSelect = (country: typeof countries[0]) => {
    setSearch('');
    onSelect(country.name);
  };

  const renderSelectedCountry = () => {
    if (!selectedCountry || search) return null;

    const selected = countries.find(c => c.name === selectedCountry);
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
            styles.countryItem,
            { 
              borderBottomColor: colors.border,
              backgroundColor: `${colors.primary}20`,
              marginTop: 8,
            }
          ]}
          onPress={() => handleSelect(selected)}>
          <View style={styles.countryInfo}>
            <Text style={[
              styles.emoji,
              {
                fontFamily: fonts.regular,
                fontSize: fontSize.xl,
                includeFontPadding: false
              }
            ]}>
              {selected.emoji}
            </Text>
            <Text style={[
              styles.countryName,
              {
                color: colors.primary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              {selected.name}
            </Text>
          </View>
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
            Select Country
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
            placeholder="Search countries"
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

        {renderSelectedCountry()}

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
              Loading countries...
            </Text>
          </View>
        ) : (
          <>
            {!search && selectedCountry && (
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
                  All Countries
                </Text>
              </View>
            )}
            <FlatList
              data={filteredAndSortedCountries}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = item.name === selectedCountry;
                if (isSelected && !search) return null;

                return (
                  <TouchableOpacity
                    style={[
                      styles.countryItem,
                      { 
                        borderBottomColor: colors.border,
                        backgroundColor: isSelected ? `${colors.primary}20` : 'transparent'
                      }
                    ]}
                    onPress={() => handleSelect(item)}>
                    <View style={styles.countryInfo}>
                      <Text style={[
                        styles.emoji,
                        {
                          fontFamily: fonts.regular,
                          fontSize: fontSize.xl,
                          includeFontPadding: false
                        }
                      ]}>
                        {item.emoji}
                      </Text>
                      <Text style={[
                        styles.countryName,
                        {
                          color: isSelected ? colors.primary : colors.textPrimary,
                          fontFamily: isSelected ? fonts.semibold : fonts.regular,
                          fontSize: fontSize.md,
                          includeFontPadding: false
                        }
                      ]}>
                        {item.name}
                      </Text>
                    </View>
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
                    No countries found
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
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    marginRight: 12,
  },
  countryName: {
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