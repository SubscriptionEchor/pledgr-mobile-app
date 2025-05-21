import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, RefreshControl, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState, useCallback, useRef } from 'react';
import { BarChart2, TrendingUp, DollarSign, Users, Calendar, Filter, ChevronDown, Info, ChevronRight } from 'lucide-react-native';
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
        
        {/* Visual divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        {/* Paid/Free counts group */}
        <View style={styles.countsContainer}>
          <View style={styles.countRow}>
            <Text style={[styles.countLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
              Paid
            </Text>
            <Text style={[styles.countValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
              {paidCount}
            </Text>
          </View>
          <View style={styles.countRow}>
            <Text style={[styles.countLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
              Free
            </Text>
            <Text style={[styles.countValue, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
              {freeCount}
            </Text>
          </View>
        </View>
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
  
  const renderTabContent = useCallback(() => {
    try {
      console.log('Rendering tab:', activeTab);
      switch (activeTab) {
        case 'Memberships':
          return renderMembershipsTab();
        case 'Shop':
          return (
            <View style={styles.comingSoonContainer}>
              <BarChart2 size={48} color={colors.textSecondary} />
              <Text style={[styles.comingSoonText, { color: colors.textSecondary, fontFamily: fonts.semibold }]}>
                Shop Analytics
              </Text>
              <Text style={[styles.comingSoonSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                Track your product sales and performance
              </Text>
            </View>
          );
        case 'Earnings':
          return (
            <View style={styles.comingSoonContainer}>
              <DollarSign size={48} color={colors.textSecondary} />
              <Text style={[styles.comingSoonText, { color: colors.textSecondary, fontFamily: fonts.semibold }]}>
                Earnings Dashboard
              </Text>
              <Text style={[styles.comingSoonSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                Track your revenue streams and payment history
              </Text>
            </View>
          );
        case 'Posts':
          return (
            <View style={styles.comingSoonContainer}>
              <BarChart2 size={48} color={colors.textSecondary} />
              <Text style={[styles.comingSoonText, { color: colors.textSecondary, fontFamily: fonts.semibold }]}>
                Content Performance
              </Text>
              <Text style={[styles.comingSoonSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                Analyze engagement across your posts
              </Text>
            </View>
          );
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
  }, [activeTab, colors, fonts, renderMembershipsTab]);

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
}); 