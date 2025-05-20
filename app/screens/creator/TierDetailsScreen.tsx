import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { User, ChevronLeft, Calendar, Edit, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = 'pricing' | 'welcome' | 'included' | 'description';

export default function TierDetailsScreen() {
  const params = useLocalSearchParams<{ tierId: string }>();
  const tierId = params.tierId;
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPricingOption, setSelectedPricingOption] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<TabType>('pricing');

  // Mock data - in a real app, you would fetch this based on tierId
  const tier = {
    id: tierId,
    name: tierId === 'mem1' ? 'Gold Membership' : tierId === 'mem2' ? 'Silver Membership' : 'Bronze Membership',
    image: tierId === 'mem1' 
      ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
      : tierId === 'mem2' 
        ? 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    pricing: {
      monthly: tierId === 'mem1' ? 19.99 : tierId === 'mem2' ? 9.99 : 4.99,
      quarterly: tierId === 'mem1' ? 54.99 : tierId === 'mem2' ? 26.99 : 12.99,
      yearly: tierId === 'mem1' ? 199.99 : tierId === 'mem2' ? 99.99 : 49.99,
    },
    postCount: tierId === 'mem1' ? 24 : tierId === 'mem2' ? 12 : 5,
    members: tierId === 'mem1' ? 120 : tierId === 'mem2' ? 80 : 40,
    maxMembers: tierId === 'mem1' ? 150 : tierId === 'mem2' ? null : 50,
    hasFreeTrial: true,
    freeTrialDays: 7,
    welcomeNote: "Welcome to our premium membership tier! We're excited to have you join our community.",
    description: "This tier gives you access to exclusive content, community features, and special perks that aren't available elsewhere.",
    included: [
      "Access to all posts in this tier",
      "Exclusive community access",
      "Monthly Q&A sessions",
      tierId === 'mem1' ? "Priority support" : null,
      tierId === 'mem1' ? "Early access to new content" : null,
    ].filter(Boolean),
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    // Handle edit functionality
    console.log(`Editing tier: ${tierId}`);
  };

  const handleDelete = () => {
    // Handle delete functionality
    console.log(`Deleting tier: ${tierId}`);
  };

  const renderPricingOption = (type: 'monthly' | 'quarterly' | 'yearly', label: string) => {
    const isSelected = selectedPricingOption === type;
    const price = tier.pricing[type];
    
    return (
      <TouchableOpacity
        style={[
          styles.pricingOption,
          { borderColor: colors.primary },
          isSelected && { 
            backgroundColor: `${colors.primary}10`, 
            borderColor: colors.primary,
            borderWidth: 2,
          }
        ]}
        onPress={() => setSelectedPricingOption(type)}
      >
        <View style={styles.radioButton}>
          <View style={[
            styles.radioInner, 
            { borderColor: colors.primary },
            isSelected && { backgroundColor: colors.primary }
          ]} />
        </View>
        <View style={styles.pricingDetails}>
          <Text style={[styles.pricingLabel, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
            {label}
          </Text>
          <Text style={[styles.pricingValue, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
            ${price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'welcome':
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.tabContentText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
              {tier.welcomeNote}
            </Text>
          </View>
        );
      case 'included':
        return (
          <View style={styles.tabContent}>
            {tier.included.map((item, index) => (
              <View key={index} style={styles.includedItem}>
                <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
                <Text style={[styles.tabContentText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        );
      case 'pricing':
        return (
          <View style={styles.tabContent}>
            <View style={styles.pricingContainer}>
              {renderPricingOption('monthly', 'Monthly')}
              {renderPricingOption('quarterly', 'Quarterly')}
              {renderPricingOption('yearly', 'Yearly')}
            </View>
          </View>
        );
      case 'description':
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.tabContentText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
              {tier.description}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
          Tier Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 80 }} // Add padding to avoid content being hidden behind footer
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: tier.image }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Badges overlay */}
          <View style={styles.badgesContainer}>
            {tier.hasFreeTrial && (
              <View style={[styles.badge, { backgroundColor: '#d1fae5' }]}>
                <Text style={[styles.badgeText, { color: '#047857' }]}>
                  Free trial - {tier.freeTrialDays}d
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Title and members count */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              {tier.name}
            </Text>
            <View style={styles.membersContainer}>
              <User size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.membersText, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                {tier.members}{tier.maxMembers ? `/${tier.maxMembers}` : ''} members
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {(['pricing', 'welcome', 'included', 'description'] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    { 
                      color: activeTab === tab ? colors.textPrimary : colors.textSecondary,
                      fontFamily: activeTab === tab ? fonts.bold : fonts.medium 
                    }
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, flexDirection: 'row', gap: 12 }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={handleEdit}
        >
          <Edit size={18} color={colors.textPrimary} style={{ marginRight: 10 }} />
          <Text style={[styles.actionButtonText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
            Edit
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FEE2E2', borderColor: '#FEE2E2' }]}
          onPress={handleDelete}
        >
          <Trash2 size={18} color="#EF4444" style={{ marginRight: 10 }} />
          <Text style={[styles.actionButtonText, { color: "#EF4444", fontFamily: fonts.medium }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 240,
  },
  badgesContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'column',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontSize: 13,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 20,
  },
  tabText: {
    fontSize: 15,
  },
  tabContent: {
    marginBottom: 20,
  },
  tabContentText: {
    fontSize: 15,
    lineHeight: 22,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  pricingContainer: {
    gap: 16,
  },
  pricingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pricingDetails: {
    flex: 1,
  },
  pricingLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  pricingValue: {
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
  },
  actionButtonText: {
    fontSize: 16,
  },
}); 