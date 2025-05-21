import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, RefreshControl, Animated, Image, Modal } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState, useCallback, useRef } from 'react';
import { BarChart2, TrendingUp, DollarSign, Users, Calendar, Filter, ChevronDown, Info, ChevronRight, MoreVertical, Eye, Edit } from 'lucide-react-native';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';

// Define types for chart data
interface MonthlyData {
  month: string;
  amount: number;
  count: number;
}

interface EngagementData {
  metric: string;
  count: number;
  trend: string;
}

interface ContentData {
  title: string;
  type: string;
  views: number;
  revenue: number;
}

interface TierData {
  name: string;
  price: string;
  memberCount: number;
  growth: number;
  chartData: number[];
}

interface TierMovementData {
  fromTier: string;
  toTier: string;
  count: number;
}

// Mock data for analytics
const REVENUE_DATA: MonthlyData[] = [
  { month: 'Jan', amount: 1200, count: 0 },
  { month: 'Feb', amount: 1400, count: 0 },
  { month: 'Mar', amount: 1100, count: 0 },
  { month: 'Apr', amount: 1600, count: 0 },
  { month: 'May', amount: 1800, count: 0 },
  { month: 'Jun', amount: 2200, count: 0 },
];

const AUDIENCE_DATA: MonthlyData[] = [
  { month: 'Jan', count: 120, amount: 0 },
  { month: 'Feb', count: 140, amount: 0 },
  { month: 'Mar', count: 180, amount: 0 },
  { month: 'Apr', count: 210, amount: 0 },
  { month: 'May', count: 260, amount: 0 },
  { month: 'Jun', count: 320, amount: 0 },
];

const ENGAGEMENT_DATA: EngagementData[] = [
  { metric: 'Views', count: 5430, trend: '+12%' },
  { metric: 'Likes', count: 852, trend: '+8%' },
  { metric: 'Comments', count: 235, trend: '+14%' },
  { metric: 'Shares', count: 126, trend: '+5%' },
];

const TOP_CONTENT: ContentData[] = [
  { title: 'How I built my first digital product', type: 'Post', views: 1240, revenue: 320 },
  { title: 'Premium Creator Bundle', type: 'Collection', views: 890, revenue: 1450 },
  { title: 'Behind-the-scenes footage', type: 'Post', views: 760, revenue: 180 },
  { title: 'Creator Masterclass Series', type: 'Collection', views: 610, revenue: 920 },
];

// Mock data for tiers
const TIER_DATA: TierData[] = [
  { 
    name: "Basic Membership", 
    price: "$5/month", 
    memberCount: 145,
    growth: 12,
    chartData: [120, 125, 130, 135, 140, 145]
  },
  { 
    name: "Premium Membership", 
    price: "$15/month", 
    memberCount: 86,
    growth: 8,
    chartData: [70, 72, 76, 80, 83, 86]
  },
  { 
    name: "VIP Membership", 
    price: "$30/month", 
    memberCount: 45,
    growth: 20,
    chartData: [30, 32, 35, 38, 42, 45]
  },
];

// Mock data with longer tier names to test layout
const UPGRADES_DATA: TierMovementData[] = [
  { fromTier: "Free Membership", toTier: "Basic Monthly Membership Plan", count: 18 },
  { fromTier: "Basic Monthly Membership Plan", toTier: "Premium Membership with Additional Benefits", count: 12 },
  { fromTier: "Premium Membership with Additional Benefits", toTier: "VIP Exclusive Membership Package", count: 5 },
];

const DOWNGRADES_DATA: TierMovementData[] = [
  { fromTier: "VIP Exclusive Membership Package", toTier: "Premium Membership with Additional Benefits", count: 3 },
  { fromTier: "Premium Membership with Additional Benefits", toTier: "Basic Monthly Membership Plan", count: 8 },
  { fromTier: "Basic Monthly Membership Plan", toTier: "Free Membership", count: 14 },
];

// Mock data for monthly migration trends
const MIGRATION_TRENDS_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [14, 18, 22, 19, 24, 35],
      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green for upgrades
      strokeWidth: 2,
    },
    {
      data: [8, 12, 9, 11, 16, 25],
      color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Red for downgrades
      strokeWidth: 2,
    },
  ],
  legend: ['Upgrades', 'Downgrades'],
};

// Mock data for shop analytics
interface ProductData {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  price: string;
  sales: number;
  revenue: number;
  collection: string;
}

const SHOP_ANALYTICS = {
  totalEarnings: '$12,560',
  totalSales: 456,
  topSellingProducts: [
    {
      id: '1',
      title: 'Creator Studio Masterclass',
      type: 'Course',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      price: '$29.99',
      sales: 85,
      revenue: 2549.15,
      collection: 'Creator Essentials'
    },
    {
      id: '2',
      title: 'Premium Design Templates Bundle',
      type: 'Bundle',
      thumbnail: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      price: '$19.99',
      sales: 142,
      revenue: 2838.58,
      collection: 'Design Resources'
    },
    {
      id: '3',
      title: 'Content Creator\'s Toolkit',
      type: 'Digital Product',
      thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      price: '$14.99',
      sales: 76,
      revenue: 1139.24,
      collection: 'Creator Essentials'
    },
    {
      id: '4',
      title: 'Social Media Strategy Guide',
      type: 'E-Book',
      thumbnail: 'https://images.unsplash.com/photo-1661956602926-db6b25f75947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      price: '$9.99',
      sales: 128,
      revenue: 1278.72,
      collection: 'Marketing Resources'
    },
    {
      id: '5',
      title: 'Photography Preset Collection',
      type: 'Presets',
      thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      price: '$12.99',
      sales: 94,
      revenue: 1221.06,
      collection: 'Visual Content'
    }
  ]
};

// Mock data for earnings analytics
interface MonthlyEarningData {
  id: string;
  month: string;
  grossRevenue: number;
  platformFee: number;
  earnings: number;
}

const EARNINGS_ANALYTICS = {
  totalEarnings: '$24,860',
  earningsData: [
    { month: 'Jan', amount: 1450 },
    { month: 'Feb', amount: 1820 },
    { month: 'Mar', amount: 2340 },
    { month: 'Apr', amount: 2760 },
    { month: 'May', amount: 3120 },
    { month: 'Jun', amount: 3680 }
  ],
  monthlyDetails: [
    {
      id: '1',
      month: 'June 2024',
      grossRevenue: 4600,
      platformFee: 920,
      earnings: 3680
    },
    {
      id: '2',
      month: 'May 2024',
      grossRevenue: 3900,
      platformFee: 780,
      earnings: 3120
    },
    {
      id: '3',
      month: 'April 2024',
      grossRevenue: 3450,
      platformFee: 690,
      earnings: 2760
    },
    {
      id: '4',
      month: 'March 2024',
      grossRevenue: 2925,
      platformFee: 585,
      earnings: 2340
    },
    {
      id: '5',
      month: 'February 2024',
      grossRevenue: 2275,
      platformFee: 455,
      earnings: 1820
    },
    {
      id: '6',
      month: 'January 2024',
      grossRevenue: 1812.50,
      platformFee: 362.50,
      earnings: 1450
    }
  ]
};

// Mock data for posts analytics with properly formatted dates
interface PostImpressionData {
  day: string;
  impressions: number;
}

interface RecentPostData {
  id: string;
  title: string;
  timestamp: string;
  thumbnail: string;
  impressions: number;
  likes: number;
  comments: number;
}

const POSTS_ANALYTICS = {
  totalImpressions: '45.2K',
  impressionData: [
    { day: 'Mon', impressions: 2450 },
    { day: 'Tue', impressions: 3200 },
    { day: 'Wed', impressions: 2800 },
    { day: 'Thu', impressions: 4100 },
    { day: 'Fri', impressions: 3750 },
    { day: 'Sat', impressions: 5400 },
    { day: 'Sun', impressions: 4800 }
  ],
  recentPosts: [
    {
      id: '1',
      title: 'How to Optimize Your Content for Better Reach',
      timestamp: 'June 15, 2024 at 9:45 AM',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      impressions: 3650,
      likes: 246,
      comments: 48
    },
    {
      id: '2',
      title: 'Latest Platform Updates for Creators',
      timestamp: 'June 12, 2024 at 2:30 PM',
      thumbnail: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      impressions: 4820,
      likes: 315,
      comments: 72
    },
    {
      id: '3',
      title: 'Behind the Scenes of My Creative Process',
      timestamp: 'June 10, 2024 at 11:15 AM',
      thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      impressions: 5130,
      likes: 427,
      comments: 96
    },
    {
      id: '4',
      title: 'Q&A Session: Answering Your Top Questions',
      timestamp: 'June 5, 2024 at 4:20 PM',
      thumbnail: 'https://images.unsplash.com/photo-1661956602926-db6b25f75947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      impressions: 6240,
      likes: 518,
      comments: 142
    },
    {
      id: '5',
      title: 'Five Essential Tools Every Creator Should Use',
      timestamp: 'June 1, 2024 at 10:00 AM',
      thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      impressions: 7380,
      likes: 624,
      comments: 87
    }
  ]
};

const windowWidth = Dimensions.get('window').width;

// Types for component props
interface SimpleBarChartProps {
  data: MonthlyData[];
  valueKey: 'amount' | 'count';
  color: string;
  maxValue: number;
}

interface StatCardProps {
  title: string;
  value: string;
  paidCount: string;
  freeCount: string;
}

export default function InsightsScreen() {
  const { colors, fonts, fontSize } = useTheme();
  
  // All state hooks must be declared at the top level, not conditionally
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Memberships');
  
  // State for Memberships tab
  const [timeframe, setTimeframe] = useState('Monthly');
  const [showTimeframeOptions, setShowTimeframeOptions] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<number[]>([]);
  
  // State for Posts tab
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  
  const tabs = ['Memberships', 'Shop', 'Earnings', 'Posts', 'Traffic'];
  
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate a data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // Get data for line chart based on timeframe (moved out of renderMembershipsTab)
  const getLineChartData = useCallback(() => {
    if (timeframe === 'Daily') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            data: [270, 272, 273, 275, 275, 276, 276],
            color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: [60, 60, 61, 61, 61, 61, 61],
            color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Paid', 'Free'],
      };
    } else if (timeframe === 'Monthly') {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [215, 230, 240, 255, 260, 276],
            color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: [45, 50, 55, 58, 60, 61],
            color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Paid', 'Free'],
      };
    } else {
      return {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            data: [120, 160, 195, 235, 276],
            color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: [30, 40, 45, 55, 61],
            color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Paid', 'Free'],
      };
    }
  }, [timeframe]);
  
  // Timeframe selection handler (moved out of renderMembershipsTab)
  const handleTimeframeSelect = useCallback((selected: string) => {
    setTimeframe(selected);
    setShowTimeframeOptions(false);
  }, []);
  
  // Toggle tier expansion (moved out of renderMembershipsTab)
  const toggleTierExpansion = useCallback((index: number) => {
    if (expandedTiers.includes(index)) {
      setExpandedTiers(expandedTiers.filter(i => i !== index));
    } else {
      setExpandedTiers([...expandedTiers, index]);
    }
  }, [expandedTiers]);
  
  // Check if a tier is expanded (moved out of renderMembershipsTab)
  const isTierExpanded = useCallback((index: number) => expandedTiers.includes(index), [expandedTiers]);
  
  // Simple bar chart visualization component
  const SimpleBarChart = ({ data, valueKey, color, maxValue }: SimpleBarChartProps) => {
    const chartHeight = 120;
    
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const value = item[valueKey];
          const barHeight = (value / maxValue) * chartHeight;
          
          return (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barLabelContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight, 
                      backgroundColor: color,
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.barLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                {item.month}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  
  // New simple stat card matching the reference design
  const StatCard = ({ title, value, paidCount, freeCount }: StatCardProps) => {
    const showCounts = paidCount || freeCount;
    
    return (
      <View style={[styles.statCard, { backgroundColor: colors.background }]}>
        {/* Title and count group */}
        <View style={styles.topGroup}>
          <Text style={[styles.statTitle, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
            {title}
          </Text>
          <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
            {value}
          </Text>
        </View>
        
        {/* Only render divider and counts if there's content */}
        {showCounts && (
          <>
            {/* Visual divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            {/* Paid/Free counts group */}
            <View style={styles.countsContainer}>
              {paidCount && (
                <View style={styles.countRow}>
                  <Text style={[styles.countLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                    Paid
                  </Text>
                  <Text style={[styles.countValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    {paidCount}
                  </Text>
                </View>
              )}
              {freeCount && (
                <View style={styles.countRow}>
                  <Text style={[styles.countLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                    Free
                  </Text>
                  <Text style={[styles.countValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    {freeCount}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    );
  };
  
  const renderMembershipsTab = useCallback(() => {
    const screenWidth = Dimensions.get('window').width - 60; // Account for padding
    
    // Get appropriate data based on timeframe
    const lineChartData = getLineChartData();
    
    // Data for pie chart
    const pieChartData = [
      {
        name: 'Paid',
        population: 215,
        color: colors.primary,
        legendFontColor: colors.textSecondary,
        legendFontSize: 12,
      },
      {
        name: 'Free',
        population: 61,
        color: '#C5CAE9', // Light primary color
        legendFontColor: colors.textSecondary,
        legendFontSize: 12,
      },
    ];
    
    const chartConfig = {
      backgroundGradientFrom: colors.background,
      backgroundGradientTo: colors.background,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
      labelColor: (opacity = 1) => colors.textSecondary,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: colors.background,
      },
    };

    // Mini chart config for tier cards
    const miniChartConfig = {
      backgroundGradientFrom: colors.background,
      backgroundGradientTo: colors.background,
      color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
      decimalPlaces: 0,
      labelColor: () => 'transparent',
      propsForBackgroundLines: {
        stroke: 'transparent',
      },
      propsForDots: {
        r: '0',
      },
    };
    
    // Get proper width for charts that won't overflow
    const fullWidth = Dimensions.get('window').width - 80; // Account for padding and margins
    
    return (
      <View style={{ width: '100%' }}>
        {/* First row - Two cards */}
        <View style={styles.metricsRow}>
          <StatCard 
            title="Active Members" 
            value="276" 
            paidCount="215"
            freeCount="61"
          />
          <StatCard 
            title="New Members" 
            value="48" 
            paidCount="32"
            freeCount="16"
          />
        </View>
        
        {/* Second row - One card with same width as cards in first row */}
        <View style={styles.metricsRow}>
          <View style={styles.cardWrapper}>
            <StatCard 
              title="Cancelled Members" 
              value="16" 
              paidCount="10"
              freeCount="6"
            />
          </View>
          <View style={styles.emptyCardSpace}></View>
        </View>
        
        {/* Overall Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Overall
            </Text>
          </View>
          
          <View style={styles.overallCounts}>
            <View style={styles.overallCountItem}>
              <Text style={[styles.overallCountLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                Paid Members
              </Text>
              <Text style={[styles.overallCountValue, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                215
              </Text>
            </View>
            
            <View style={styles.overallCountDivider} />
            
            <View style={styles.overallCountItem}>
              <Text style={[styles.overallCountLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                Free Members
              </Text>
              <Text style={[styles.overallCountValue, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                61
              </Text>
            </View>
          </View>
          
          <View style={styles.graphContainer}>
            <View style={styles.graphTitleRow}>
              <Text style={[styles.graphTitle, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                Membership Growth
              </Text>
              
              <View style={styles.timeframeDropdown}>
                <TouchableOpacity 
                  style={styles.timeframeSelector}
                  onPress={() => setShowTimeframeOptions(!showTimeframeOptions)}
                >
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium, fontSize: 14 }}>
                    {timeframe}
                  </Text>
                  <ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                
                {showTimeframeOptions && (
                  <View style={[styles.timeframeOptions, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    {['Daily', 'Monthly', 'Yearly'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.timeframeOption,
                          timeframe === option && { backgroundColor: `${colors.primary}10` }
                        ]}
                        onPress={() => handleTimeframeSelect(option)}
                      >
                        <Text
                          style={[
                            styles.timeframeOptionText,
                            { 
                              color: timeframe === option ? colors.primary : colors.textPrimary,
                              fontFamily: timeframe === option ? fonts.semibold : fonts.regular
                            }
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
            
            <LineChart
              data={lineChartData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            
            <View style={{ height: 30 }} />
            
            <Text style={[styles.graphTitle, { color: colors.textSecondary, fontFamily: fonts.medium, marginBottom: 16 }]}>
              Member Distribution
            </Text>
            
            <PieChart
              data={pieChartData}
              width={screenWidth}
              height={200}
              chartConfig={chartConfig}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              center={[10, 0]}
              absolute
            />
          </View>
        </View>
        
        {/* Tiers Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Tiers
            </Text>
          </View>
          
          <View style={styles.tiersList}>
            {TIER_DATA.map((tier, index) => (
              <View
                key={index}
                style={[
                  styles.tierCard, 
                  index < TIER_DATA.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                ]}
              >
                <TouchableOpacity 
                  style={styles.tierHeader}
                  onPress={() => toggleTierExpansion(index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tierHeaderLeft}>
                    <ChevronRight
                      size={18}
                      color={colors.textSecondary}
                      style={[
                        styles.chevron,
                        isTierExpanded(index) ? { transform: [{ rotate: '90deg' }] } : {}
                      ]}
                    />
                    <View>
                      <Text style={[styles.tierName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                        {tier.name}
                      </Text>
                      <Text style={[styles.tierPrice, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                        {tier.price}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
                {isTierExpanded(index) && (
                  <View style={styles.tierChartContainer}>
                    <Text style={[styles.tierMonthlyTitle, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                      Monthly Members
                    </Text>
                    <View style={styles.chartWrapper}>
                      <BarChart
                        data={{
                          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                          datasets: [{
                            data: tier.chartData
                          }]
                        }}
                        width={fullWidth}
                        height={160}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                          ...miniChartConfig,
                          barPercentage: 0.65,
                          color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
                          labelColor: (opacity = 1) => colors.textSecondary,
                          fillShadowGradientOpacity: 1,
                          propsForLabels: {
                            fontSize: 10,
                          },
                        }}
                        showBarTops={false}
                        withInnerLines={false}
                        fromZero={true}
                        showValuesOnTopOfBars={true}
                        flatColor={true}
                        style={{
                          borderRadius: 8,
                          marginTop: 0,
                          paddingTop: 0,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
        
        {/* Upgrade & Downgrade Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Upgrade & Downgrade
            </Text>
          </View>
          
          {/* Migration Trends Graph */}
          <View style={styles.migrationTrendsSection}>
            <Text style={[styles.movementTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Migration Trends
            </Text>
            
            <View style={styles.migrationGraphContainer}>
              <LineChart
                data={MIGRATION_TRENDS_DATA}
                width={fullWidth}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: colors.background,
                  backgroundGradientTo: colors.background,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => colors.textSecondary,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: colors.background,
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 8,
                }}
              />
            </View>
            
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: 'rgba(46, 204, 113, 1)' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                  Upgrades
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: 'rgba(231, 76, 60, 1)' }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                  Downgrades
                </Text>
              </View>
            </View>
          </View>
          
          {/* Upgrades Section */}
          <View style={[styles.movementSection, { marginTop: 24 }]}>
            <Text style={[styles.movementTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Upgrades
            </Text>
            
            <View style={styles.movementTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.tierCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  From
                </Text>
                <Text style={[styles.tableHeaderCell, styles.arrowCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  
                </Text>
                <Text style={[styles.tableHeaderCell, styles.tierCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  To
                </Text>
                <Text style={[styles.tableHeaderCell, styles.countCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  Members
                </Text>
              </View>
              
              {UPGRADES_DATA.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text 
                    style={[styles.tableCell, styles.tierCell, { color: colors.textSecondary, fontFamily: fonts.regular }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.fromTier}
                  </Text>
                  <View style={styles.arrowCell}>
                    <ChevronRight size={16} color={colors.success} />
                  </View>
                  <Text 
                    style={[styles.tableCell, styles.tierCell, { color: colors.textPrimary, fontFamily: fonts.medium }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.toTier}
                  </Text>
                  <Text style={[styles.tableCell, styles.countCell, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Downgrades Section */}
          <View style={[styles.movementSection, { marginTop: 24 }]}>
            <Text style={[styles.movementTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Downgrades
            </Text>
            
            <View style={styles.movementTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.tierCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  From
                </Text>
                <Text style={[styles.tableHeaderCell, styles.arrowCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  
                </Text>
                <Text style={[styles.tableHeaderCell, styles.tierCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  To
                </Text>
                <Text style={[styles.tableHeaderCell, styles.countCell, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
                  Members
                </Text>
              </View>
              
              {DOWNGRADES_DATA.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text 
                    style={[styles.tableCell, styles.tierCell, { color: colors.textPrimary, fontFamily: fonts.medium }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.fromTier}
                  </Text>
                  <View style={styles.arrowCell}>
                    <ChevronRight size={16} color={colors.error} style={{ transform: [{ rotate: '90deg' }] }} />
                  </View>
                  <Text 
                    style={[styles.tableCell, styles.tierCell, { color: colors.textSecondary, fontFamily: fonts.regular }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.toTier}
                  </Text>
                  <Text style={[styles.tableCell, styles.countCell, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }, [colors, timeframe, showTimeframeOptions, expandedTiers, getLineChartData, toggleTierExpansion, isTierExpanded, fonts]);
  
  // Move the renderShopTab function before renderTabContent
  const renderShopTab = useCallback(() => {
    return (
      <View style={{ width: '100%' }}>
        {/* Top metric cards */}
        <View style={styles.metricsRow}>
          <StatCard 
            title="Total Earnings" 
            value={SHOP_ANALYTICS.totalEarnings} 
            paidCount=""
            freeCount=""
          />
          <StatCard 
            title="Total Sales" 
            value={SHOP_ANALYTICS.totalSales.toString()} 
            paidCount=""
            freeCount=""
          />
        </View>

        {/* Top Selling Products Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 16 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Top Selling Products
            </Text>
          </View>
          
          <View style={styles.productsContainer}>
            {SHOP_ANALYTICS.topSellingProducts.map((product, index) => (
              <View 
                key={product.id} 
                style={[
                  styles.productCard,
                  index < SHOP_ANALYTICS.topSellingProducts.length - 1 && 
                    { borderBottomWidth: 1, borderBottomColor: colors.border }
                ]}
              >
                <View style={styles.productImageContainer}>
                  <Image 
                    source={{ uri: product.thumbnail }} 
                    style={styles.productThumbnail} 
                    resizeMode="cover"
                  />
                </View>
                
                <View style={styles.productContent}>
                  <View style={styles.productHeader}>
                    <Text 
                      style={[styles.productTitle, { fontFamily: fonts.medium, color: colors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {product.title}
                    </Text>
                    
                    <View style={styles.productTypeContainer}>
                      <Text 
                        style={[styles.productType, { fontFamily: fonts.regular, color: colors.textSecondary }]} 
                        numberOfLines={1}
                      >
                        {product.collection}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.productStats}>
                    <View style={styles.productStat}>
                      <Text style={[styles.productStatLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                        Sales
                      </Text>
                      <Text style={[styles.productStatValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                        {product.sales}
                      </Text>
                    </View>
                    
                    <View style={styles.productStat}>
                      <Text style={[styles.productStatLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                        Earnings
                      </Text>
                      <Text style={[styles.productStatValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                        ${product.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }, [colors, fonts]);

  // Add renderEarningsTab function before renderTabContent
  const renderEarningsTab = useCallback(() => {
    const screenWidth = Dimensions.get('window').width - 60; // Account for padding
    
    // Data for line chart
    const lineChartData = {
      labels: EARNINGS_ANALYTICS.earningsData.map(item => item.month),
      datasets: [
        {
          data: EARNINGS_ANALYTICS.earningsData.map(item => item.amount),
          color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
          strokeWidth: 2,
        }
      ],
      legend: ['Earnings']
    };
    
    // Chart configuration
    const chartConfig = {
      backgroundGradientFrom: colors.background,
      backgroundGradientTo: colors.background,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
      labelColor: (opacity = 1) => colors.textSecondary,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: colors.background,
      },
    };
    
    return (
      <View style={{ width: '100%' }}>
        {/* Total Earnings card */}
        <View style={styles.metricsRow}>
          <StatCard 
            title="Total Earnings" 
            value={EARNINGS_ANALYTICS.totalEarnings} 
            paidCount=""
            freeCount=""
          />
        </View>
        
        {/* Earnings Overview Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 16 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Earnings Overview
            </Text>
          </View>
          
          <View style={styles.graphContainer}>
            <LineChart
              data={lineChartData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
        
        {/* Monthly Earnings Details Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 16 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
              Monthly Earnings Details
            </Text>
          </View>
          
          <View style={styles.monthlyEarningsContainer}>
            {EARNINGS_ANALYTICS.monthlyDetails.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.monthlyEarningCard,
                  index < EARNINGS_ANALYTICS.monthlyDetails.length - 1 && 
                    { borderBottomWidth: 1, borderBottomColor: colors.border }
                ]}
              >
                <View style={styles.monthlyEarningHeader}>
                  <Text 
                    style={[styles.monthlyEarningTitle, { fontFamily: fonts.medium, color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {item.month}
                  </Text>
                </View>
                
                <View style={styles.monthlyEarningStats}>
                  <View style={styles.monthlyEarningStat}>
                    <Text style={[styles.monthlyEarningStatLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Gross Revenue
                    </Text>
                    <Text style={[styles.monthlyEarningStatValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      ${item.grossRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  
                  <View style={styles.monthlyEarningStat}>
                    <Text style={[styles.monthlyEarningStatLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Platform Fee
                    </Text>
                    <Text style={[styles.monthlyEarningStatValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      ${item.platformFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  
                  <View style={styles.monthlyEarningStat}>
                    <Text style={[styles.monthlyEarningStatLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Your Earnings
                    </Text>
                    <Text style={[styles.monthlyEarningStatValue, { color: colors.primary, fontFamily: fonts.semibold }]}>
                      ${item.earnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }, [colors, fonts]);

  // Update the renderPostsTab function structure
  const renderPostsTab = useCallback(() => {
    const screenWidth = Dimensions.get('window').width - 60; // Account for padding
    
    // Data for line chart
    const impressionsChartData = {
      labels: POSTS_ANALYTICS.impressionData.map(item => item.day),
      datasets: [
        {
          data: POSTS_ANALYTICS.impressionData.map(item => item.impressions),
          color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
          strokeWidth: 2,
        }
      ],
      legend: ['Impressions']
    };
    
    // Chart configuration
    const chartConfig = {
      backgroundGradientFrom: colors.background,
      backgroundGradientTo: colors.background,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
      labelColor: (opacity = 1) => colors.textSecondary,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: colors.background,
      },
    };
    
    // Handle opening the kebab menu
    const handleOpenMenu = (postId: string) => {
      setSelectedPostId(postId);
      setBottomSheetVisible(true);
    };
    
    // Handle closing the bottom sheet
    const handleCloseBottomSheet = () => {
      setBottomSheetVisible(false);
    };
    
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <View style={{ flex: 1, width: '100%' }}>
          {/* Total Impressions card */}
          <View style={styles.metricsRow}>
            <StatCard 
              title="Total Impressions" 
              value={POSTS_ANALYTICS.totalImpressions} 
              paidCount=""
              freeCount=""
            />
          </View>
          
          {/* Impressions by Day Section */}
          <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 16 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                Impressions by Day
              </Text>
            </View>
            
            <View style={styles.graphContainer}>
              <LineChart
                data={impressionsChartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                fromZero
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
          
          {/* Recent Posts Section */}
          <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 16 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                Recent Posts
              </Text>
            </View>
            
            <View style={styles.recentPostsContainer}>
              {POSTS_ANALYTICS.recentPosts.map((post, index) => (
                <View 
                  key={post.id} 
                  style={[
                    styles.recentPostCard,
                    index < POSTS_ANALYTICS.recentPosts.length - 1 && 
                      { borderBottomWidth: 1, borderBottomColor: colors.border }
                  ]}
                >
                  <View style={styles.postImageContainer}>
                    <Image 
                      source={{ uri: post.thumbnail }} 
                      style={styles.postThumbnail} 
                      resizeMode="cover"
                    />
                  </View>
                  
                  <View style={styles.postContent}>
                    <View style={styles.postHeader}>
                      <Text 
                        style={[styles.postTitle, { fontFamily: fonts.medium, color: colors.textPrimary }]}
                        numberOfLines={2}
                      >
                        {post.title}
                      </Text>
                      
                      <Text 
                        style={[styles.postTimestamp, { fontFamily: fonts.regular, color: colors.textSecondary }]}
                        numberOfLines={1}
                      >
                        {post.timestamp}
                      </Text>
                    </View>
                    
                    <View style={styles.postStats}>
                      <View style={styles.postStat}>
                        <View style={styles.postStatIcon}>
                          <Eye size={14} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.postStatValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                          {post.impressions.toLocaleString()}
                        </Text>
                      </View>
                      
                      <View style={styles.postStat}>
                        <Text style={[styles.postStatValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                          {post.likes.toLocaleString()} likes
                        </Text>
                      </View>
                      
                      <View style={styles.postStat}>
                        <Text style={[styles.postStatValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                          {post.comments.toLocaleString()} comments
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.postMenuButton}
                    onPress={() => handleOpenMenu(post.id)}
                  >
                    <MoreVertical size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Bottom Sheet for post actions - using Modal */}
        {bottomSheetVisible && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={bottomSheetVisible}
            onRequestClose={handleCloseBottomSheet}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.bottomSheetOverlay}
                activeOpacity={0.7}
                onPress={handleCloseBottomSheet}
              />
              <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>
                <View style={styles.bottomSheetHandle} />
                
                <TouchableOpacity 
                  style={styles.bottomSheetOption}
                  onPress={() => {
                    console.log('View more insights for post', selectedPostId);
                    handleCloseBottomSheet();
                  }}
                >
                  <BarChart2 size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
                  <Text style={[styles.bottomSheetOptionText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    View More Insights
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.bottomSheetOption}
                  onPress={() => {
                    console.log('View post', selectedPostId);
                    handleCloseBottomSheet();
                  }}
                >
                  <Eye size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
                  <Text style={[styles.bottomSheetOptionText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    View Post
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.bottomSheetOption}
                  onPress={() => {
                    console.log('Edit post', selectedPostId);
                    handleCloseBottomSheet();
                  }}
                >
                  <Edit size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
                  <Text style={[styles.bottomSheetOptionText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    Edit Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  }, [colors, fonts, selectedPostId, bottomSheetVisible]);

  // Now that renderShopTab is defined, we can use it in renderTabContent
  const renderTabContent = useCallback(() => {
    try {
      console.log('Rendering tab:', activeTab);
      switch (activeTab) {
        case 'Memberships':
          return renderMembershipsTab();
        case 'Shop':
          return renderShopTab();
        case 'Earnings':
          return renderEarningsTab();
        case 'Posts':
          return renderPostsTab();
        case 'Traffic':
          return (
            <View style={styles.comingSoonContainer}>
              <TrendingUp size={48} color={colors.textSecondary} />
              <Text style={[styles.comingSoonText, { color: colors.textSecondary, fontFamily: fonts.semibold }]}>
                Traffic Analytics
              </Text>
              <Text style={[styles.comingSoonSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                See where your visitors are coming from
              </Text>
            </View>
          );
        default:
          return renderMembershipsTab();
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      // Fallback UI when there's an error
      return (
        <View style={styles.comingSoonContainer}>
          <Text style={[styles.comingSoonText, { color: colors.error, fontFamily: fonts.semibold }]}>
            Something went wrong
          </Text>
          <Text style={[styles.comingSoonSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
            There was an error loading this tab
          </Text>
        </View>
      );
    }
  }, [activeTab, colors, fonts, renderMembershipsTab, renderShopTab, renderEarningsTab, renderPostsTab]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBarComponent />
      
      {/* Header */}
      <SubHeader title="Insights" showBackButton={false} titleAlignment="left" />
      
      {/* Last Updated Info */}
      <View style={[styles.headerInfoContainer, { borderBottomColor: colors.border }]}>
        <View style={styles.lastUpdatedContainer}>
          <Text style={[styles.lastUpdatedLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
            Last Updated:
          </Text>
          <Text style={[styles.lastUpdatedTime, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
            Today, 10:45 AM
          </Text>
        </View>
      </View>
      
      {/* Tab Bar */}
      <View style={{ backgroundColor: colors.background, zIndex: 10, position: 'relative', height: 48 }}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          <View
            style={{
              flexDirection: 'row',
              height: 48,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 48 }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <View
                    key={tab}
                    style={{
                      alignItems: 'center',
                      marginRight: 16,
                      height: 48,
                      justifyContent: 'flex-end',
                      position: 'relative',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Tab pressed:', tab);
                        setActiveTab(tab);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        borderRadius: 999,
                        paddingHorizontal: 8,
                        paddingVertical: 0,
                        minWidth: 48,
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{
                          color: isActive ? colors.textPrimary : colors.textSecondary,
                          fontFamily: isActive ? fonts.bold : fonts.medium,
                          fontSize: fontSize.lg,
                        }}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                    {isActive && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '80%',
                          height: 3,
                          backgroundColor: colors.primary,
                          borderTopLeftRadius: 3,
                          borderTopRightRadius: 3,
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* Main Content */}
      <View style={[styles.mainContent, { flex: 1, position: 'relative' }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {renderTabContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdatedLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  lastUpdatedTime: {
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    width: '48%', // Each card takes up slightly less than half the width
  },
  emptyCardSpace: {
    width: '48%', // Empty space to match the first card's width
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  topGroup: {
    padding: 20,
    paddingBottom: 16,
  },
  statTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  countsContainer: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  countLabel: {
    fontSize: 14,
  },
  countValue: {
    fontSize: 14,
  },
  sectionCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
  },
  infoButton: {
    padding: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingBottom: 12,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barLabelContainer: {
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  chartLegend: {
    marginTop: 8,
    alignItems: 'center',
  },
  chartValue: {
    fontSize: 18,
  },
  chartLabel: {
    fontSize: 12,
  },
  engagementContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  engagementItem: {
    width: '48%',
    marginBottom: 16,
  },
  engagementMetric: {
    fontSize: 12,
    marginBottom: 4,
  },
  engagementCount: {
    fontSize: 18,
    marginBottom: 4,
  },
  topContentList: {
    marginTop: 8,
  },
  topContentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  contentInfo: {
    flex: 2,
    paddingRight: 8,
  },
  contentTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  contentType: {
    fontSize: 12,
  },
  contentStats: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 11,
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
    width: '100%',
  },
  comingSoonText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  comingSoonSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '70%',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  overallCounts: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 8,
  },
  overallCountItem: {
    flex: 1,
    alignItems: 'center',
  },
  overallCountDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: 16,
  },
  overallCountLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  overallCountValue: {
    fontSize: 24,
  },
  graphContainer: {
    marginTop: 24,
  },
  graphTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  graphTitle: {
    fontSize: 16,
  },
  timeframeDropdown: {
    position: 'relative',
  },
  timeframeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  timeframeOptions: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: 120,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeframeOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  timeframeOptionText: {
    fontSize: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  tiersList: {
    marginTop: 8,
  },
  tierCard: {
    paddingVertical: 16,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginRight: 8,
    marginTop: 2,
  },
  tierName: {
    fontSize: 16,
    marginBottom: 4,
  },
  tierPrice: {
    fontSize: 14,
  },
  memberCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberCountText: {
    fontSize: 12,
  },
  tierChartContainer: {
    marginTop: 8,
    marginLeft: 26, // Align with tier name after chevron
    paddingBottom: 8,
    overflow: 'hidden', // Ensure content doesn't overflow
  },
  chartWrapper: {
    alignItems: 'center', // Center the chart
    width: '100%',
    marginTop: 0,
    paddingTop: 0,
  },
  tierMonthlyTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  miniChartWrapper: {
    width: '65%',
    alignItems: 'flex-end',
    marginRight: -16,
  },
  // Upgrade & Downgrade Styles
  movementSection: {
    marginTop: 8,
  },
  movementTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  movementTable: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  tableHeaderCell: {
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
  },
  tierCell: {
    flex: 3.5,
    paddingRight: 4,
  },
  arrowCell: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  countCell: {
    flex: 1,
    textAlign: 'center',
    flexShrink: 0,
  },
  // Migration Trends styles
  migrationTrendsSection: {
    marginTop: 8,
  },
  migrationGraphContainer: {
    marginTop: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  // Product card related styles
  productsContainer: {
    marginTop: 4,
  },
  productCard: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  productThumbnail: {
    width: '100%',
    height: '100%',
  },
  productContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeader: {
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  productTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productType: {
    fontSize: 14,
  },
  productStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productStat: {
    flex: 1,
    paddingHorizontal: 8,
  },
  productStatLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  productStatValue: {
    fontSize: 14,
  },
  // Monthly earnings related styles
  monthlyEarningsContainer: {
    marginTop: 4,
  },
  monthlyEarningCard: {
    paddingVertical: 16,
  },
  monthlyEarningHeader: {
    marginBottom: 12,
  },
  monthlyEarningTitle: {
    fontSize: 16,
  },
  monthlyEarningStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyEarningStat: {
    flex: 1,
    paddingHorizontal: 8,
  },
  monthlyEarningStatLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  monthlyEarningStatValue: {
    fontSize: 14,
  },
  // Recent posts related styles
  recentPostsContainer: {
    marginTop: 4,
  },
  recentPostCard: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  postImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  postThumbnail: {
    width: '100%',
    height: '100%',
  },
  postContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  postHeader: {
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  postTimestamp: {
    fontSize: 12,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  postStatIcon: {
    marginRight: 4,
  },
  postStatValue: {
    fontSize: 13,
  },
  postMenuButton: {
    paddingHorizontal: 8,
    height: 40,
    justifyContent: 'center',
  },
  
  // Bottom sheet styles
  bottomSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 1001,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  bottomSheetOptionText: {
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
}); 