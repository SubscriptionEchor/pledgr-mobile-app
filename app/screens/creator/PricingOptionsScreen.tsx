import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for available tiers - replace with actual data from API or context
const availableTiers = [
  { id: '1', name: 'Basic Tier - $5/month' },
  { id: '2', name: 'Premium Tier - $15/month' },
  { id: '3', name: 'Exclusive Tier - $25/month' },
];

export default function PricingOptionsScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [allPaidMembers, setAllPaidMembers] = useState(false);

  const handleToggleTier = (tierId: string) => {
    if (selectedTiers.includes(tierId)) {
      setSelectedTiers(selectedTiers.filter(id => id !== tierId));
    } else {
      setSelectedTiers([...selectedTiers, tierId]);
    }
  };

  const handleToggleAllPaidMembers = () => {
    const newValue = !allPaidMembers;
    setAllPaidMembers(newValue);
    
    // If enabling all paid members, select all tiers
    if (newValue) {
      setSelectedTiers(availableTiers.map(tier => tier.id));
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    // Here you would save the selected tiers and go back
    // You can pass data back to the previous screen if needed
    router.back();
  };

  const CheckboxItem = ({ label, checked, onToggle }: { label: string, checked: boolean, onToggle: () => void }) => (
    <TouchableOpacity 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        paddingVertical: 12,
      }}
      onPress={onToggle}
    >
      <View style={{
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: checked ? colors.primary : colors.border,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: checked ? colors.primary : 'transparent',
      }}>
        {checked && <Check size={16} color={colors.buttonText} />}
      </View>
      <Text style={{ 
        marginLeft: 12,
        fontFamily: fonts.medium,
        fontSize: fontSize.md,
        color: colors.textPrimary,
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Screen options={{ 
        headerShown: false,
      }} />

      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
      }}>
        <TouchableOpacity onPress={handleCancel}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ 
          marginLeft: 16, 
          fontFamily: fonts.bold, 
          fontSize: fontSize.xl,
          color: colors.textPrimary
        }}>
          Pricing Options
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Member Access Section */}
        <Text style={{ 
          fontFamily: fonts.bold, 
          fontSize: fontSize.lg,
          color: colors.textPrimary,
          marginBottom: 8
        }}>
          Member Access
        </Text>
        
        <Text style={{ 
          fontFamily: fonts.regular, 
          fontSize: fontSize.md,
          color: colors.textSecondary,
          marginBottom: 20
        }}>
          Choose which tiers get this product for free.
        </Text>

        {/* All Paid Members Checkbox */}
        <CheckboxItem 
          label="All paid members" 
          checked={allPaidMembers} 
          onToggle={handleToggleAllPaidMembers} 
        />

        {/* Separator Line */}
        <View 
          style={{ 
            height: 1, 
            backgroundColor: colors.border, 
            marginVertical: 16 
          }} 
        />

        {/* Available Tiers Section */}
        <Text style={{ 
          fontFamily: fonts.bold, 
          fontSize: fontSize.lg,
          color: colors.textPrimary,
          marginBottom: 16
        }}>
          Available Tiers
        </Text>

        {/* List of Tiers */}
        {availableTiers.map(tier => (
          <CheckboxItem 
            key={tier.id}
            label={tier.name} 
            checked={selectedTiers.includes(tier.id) || allPaidMembers} 
            onToggle={() => handleToggleTier(tier.id)} 
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={{ 
        flexDirection: 'row', 
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border
      }}>
        <TouchableOpacity 
          style={{ 
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 16,
            marginRight: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleCancel}
        >
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.textPrimary
          }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ 
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 16,
            marginLeft: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleSave}
        >
          <Text style={{ 
            fontFamily: fonts.medium, 
            fontSize: fontSize.md,
            color: colors.buttonText
          }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 