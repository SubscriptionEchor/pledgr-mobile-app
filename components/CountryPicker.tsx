import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, X } from 'lucide-react-native';
import { TextInput } from 'react-native';
import { useState, useMemo } from 'react';

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Brazil',
  'India',
  'China',
  // Add more countries as needed
];

interface CountryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: string) => void;
}

export function CountryPicker({ visible, onClose, onSelect }: CountryPickerProps) {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Select Country</Text>
          <TouchableOpacity onPress={onClose}>
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
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>

        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.countryItem, { borderBottomColor: colors.border }]}
              onPress={() => onSelect(item)}>
              <Text style={[styles.countryName, { color: colors.textPrimary }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
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
    fontSize: 16,
  },
  countryItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  countryName: {
    fontSize: 16,
  },
});