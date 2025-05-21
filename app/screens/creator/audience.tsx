import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Platform, Switch, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft, Mail, SlidersHorizontal, Check, Square, CheckSquare, X, Calendar, Calendar as CalendarIcon, Filter, Search, MoreVertical, UserX } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBarComponent } from '@/components/StatusBarComponent';
import { useState, useEffect } from 'react';

const TABS = [
  { id: 'relationship', label: 'Relationship manager' },
  { id: 'sales', label: 'Sales' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'blocked', label: 'Blocked users' },
];

const FILTERS = [
  { id: 'paid', label: 'Paid members' },
  { id: 'free', label: 'Free members' },
  { id: 'active', label: 'Active' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'declined', label: 'Payment declined' },
  { id: 'new', label: 'New this month' },
];

// Sample audience data
const AUDIENCE_DATA = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    currentTier: 'Pro', 
    pledge: '$15.00/mo', 
    status: 'Active', 
    joinDate: '12/05/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '2', 
    name: 'Sarah Smith', 
    email: 'sarah.smith@example.com', 
    currentTier: 'Basic', 
    pledge: '$5.00/mo', 
    status: 'Active', 
    joinDate: '02/15/2024', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '3', 
    name: 'Michael Johnson', 
    email: 'michael.j@example.com', 
    currentTier: 'Premium', 
    pledge: '$25.00/mo', 
    status: 'Payment declined', 
    joinDate: '10/22/2023', 
    lastChargeDate: '04/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '4', 
    name: 'Emily Wilson', 
    email: 'emily.w@example.com', 
    currentTier: 'Free', 
    pledge: '$0.00/mo', 
    status: 'Free', 
    joinDate: '01/30/2024', 
    lastChargeDate: '-',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '5', 
    name: 'David Brown', 
    email: 'david.b@example.com', 
    currentTier: 'Pro', 
    pledge: '$15.00/mo', 
    status: 'Active', 
    joinDate: '09/14/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '6', 
    name: 'Laura Martinez', 
    email: 'laura.m@example.com', 
    currentTier: 'Basic', 
    pledge: '$5.00/mo', 
    status: 'Cancelled', 
    joinDate: '11/02/2023', 
    lastChargeDate: '04/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '7', 
    name: 'Robert Taylor', 
    email: 'robert.t@example.com', 
    currentTier: 'Premium', 
    pledge: '$25.00/mo', 
    status: 'Active', 
    joinDate: '08/19/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '8', 
    name: 'Jennifer Clark', 
    email: 'jennifer.c@example.com', 
    currentTier: 'Pro', 
    pledge: '$15.00/mo', 
    status: 'Active', 
    joinDate: '01/05/2024', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '9', 
    name: 'William Lewis', 
    email: 'william.l@example.com', 
    currentTier: 'Basic', 
    pledge: '$5.00/mo', 
    status: 'Payment declined', 
    joinDate: '03/22/2024', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '10', 
    name: 'Elizabeth Walker', 
    email: 'elizabeth.w@example.com', 
    currentTier: 'Free', 
    pledge: '$0.00/mo', 
    status: 'Free', 
    joinDate: '02/10/2024', 
    lastChargeDate: '-',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '11', 
    name: 'James Rodriguez', 
    email: 'james.r@example.com', 
    currentTier: 'Premium', 
    pledge: '$25.00/mo', 
    status: 'Active', 
    joinDate: '09/30/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '12', 
    name: 'Patricia Anderson', 
    email: 'patricia.a@example.com', 
    currentTier: 'Pro', 
    pledge: '$15.00/mo', 
    status: 'Active', 
    joinDate: '10/15/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '13', 
    name: 'Mark Thomas', 
    email: 'mark.t@example.com', 
    currentTier: 'Basic', 
    pledge: '$5.00/mo', 
    status: 'Cancelled', 
    joinDate: '07/08/2023', 
    lastChargeDate: '03/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '14', 
    name: 'Sandra Garcia', 
    email: 'sandra.g@example.com', 
    currentTier: 'Free', 
    pledge: '$0.00/mo', 
    status: 'Free', 
    joinDate: '04/01/2024', 
    lastChargeDate: '-',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '15', 
    name: 'Kevin Moore', 
    email: 'kevin.m@example.com', 
    currentTier: 'Premium', 
    pledge: '$25.00/mo', 
    status: 'Payment declined', 
    joinDate: '12/12/2023', 
    lastChargeDate: '04/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '16', 
    name: 'Nancy Lee', 
    email: 'nancy.l@example.com', 
    currentTier: 'Pro', 
    pledge: '$15.00/mo', 
    status: 'Active', 
    joinDate: '02/28/2024', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '17', 
    name: 'Daniel Wilson', 
    email: 'daniel.w@example.com', 
    currentTier: 'Basic', 
    pledge: '$5.00/mo', 
    status: 'Active', 
    joinDate: '11/19/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '18', 
    name: 'Karen White', 
    email: 'karen.w@example.com', 
    currentTier: 'Free', 
    pledge: '$0.00/mo', 
    status: 'Free', 
    joinDate: '03/15/2024', 
    lastChargeDate: '-',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '19', 
    name: 'Christopher Allen', 
    email: 'chris.a@example.com', 
    currentTier: 'Premium', 
    pledge: '$25.00/mo', 
    status: 'Active', 
    joinDate: '08/05/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '20', 
    name: 'Lisa Jackson', 
    email: 'lisa.j@example.com', 
    currentTier: 'Pro', 
    pledge: '$15.00/mo', 
    status: 'Active', 
    joinDate: '01/22/2024', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '21', 
    name: 'Brian Martin', 
    email: 'brian.m@example.com', 
    currentTier: 'Basic', 
    pledge: '$5.00/mo', 
    status: 'Cancelled', 
    joinDate: '10/07/2023', 
    lastChargeDate: '03/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '22', 
    name: 'Susan Thompson', 
    email: 'susan.t@example.com', 
    currentTier: 'Free', 
    pledge: '$0.00/mo', 
    status: 'Free', 
    joinDate: '02/05/2024', 
    lastChargeDate: '-',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '23', 
    name: 'George Davis', 
    email: 'george.d@example.com', 
    currentTier: 'Premium', 
    pledge: '$25.00/mo', 
    status: 'Payment declined', 
    joinDate: '09/18/2023', 
    lastChargeDate: '04/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '24', 
    name: 'Michelle Miller', 
    email: 'michelle.m@example.com', 
    currentTier: 'Pro', 
    pledge: '$15.00/mo', 
    status: 'Active', 
    joinDate: '12/30/2023', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  },
  { 
    id: '25', 
    name: 'Richard Jones', 
    email: 'richard.j@example.com', 
    currentTier: 'Basic', 
    pledge: '$5.00/mo', 
    status: 'Active', 
    joinDate: '03/04/2024', 
    lastChargeDate: '05/01/2024',
    subscriptionSource: 'Pledgr'
  }
];

// Sample tiers data
const TIERS_DATA = [
  { id: 'free', name: 'Free', price: '$0.00/mo' },
  { id: 'basic', name: 'Basic', price: '$5.00/mo' },
  { id: 'pro', name: 'Pro', price: '$15.00/mo' },
  { id: 'premium', name: 'Premium', price: '$25.00/mo' }
];

// Sample sales data
const SALES_DATA = [
  {
    id: '1',
    customer: 'John Doe',
    product: 'Basic Membership',
    datePurchased: '05/01/2024',
    status: 'Completed',
    total: '$5.00'
  },
  {
    id: '2',
    customer: 'Sarah Smith',
    product: 'Pro Membership',
    datePurchased: '04/28/2024',
    status: 'Completed',
    total: '$15.00'
  },
  {
    id: '3',
    customer: 'Michael Johnson',
    product: 'Premium Membership',
    datePurchased: '04/25/2024',
    status: 'Refunded',
    total: '$25.00'
  },
  {
    id: '4',
    customer: 'Emily Wilson',
    product: 'Basic Membership',
    datePurchased: '04/22/2024',
    status: 'Pending',
    total: '$5.00'
  },
  {
    id: '5',
    customer: 'David Brown',
    product: 'Pro Membership',
    datePurchased: '04/20/2024',
    status: 'Completed',
    total: '$15.00'
  },
  {
    id: '6',
    customer: 'Laura Martinez',
    product: 'Basic Membership',
    datePurchased: '04/18/2024',
    status: 'Failed',
    total: '$5.00'
  },
  {
    id: '7',
    customer: 'Robert Taylor',
    product: 'Premium Membership',
    datePurchased: '04/15/2024',
    status: 'Completed',
    total: '$25.00'
  },
  {
    id: '8',
    customer: 'Jennifer Clark',
    product: 'Pro Membership',
    datePurchased: '04/12/2024',
    status: 'Completed',
    total: '$15.00'
  },
  {
    id: '9',
    customer: 'William Lewis',
    product: 'Basic Membership',
    datePurchased: '04/10/2024',
    status: 'Refunded',
    total: '$5.00'
  },
  {
    id: '10',
    customer: 'Elizabeth Walker',
    product: 'Premium Membership',
    datePurchased: '04/08/2024',
    status: 'Completed',
    total: '$25.00'
  },
  {
    id: '11',
    customer: 'James Rodriguez',
    product: 'Pro Membership',
    datePurchased: '04/05/2024',
    status: 'Completed',
    total: '$15.00'
  },
  {
    id: '12',
    customer: 'Patricia Anderson',
    product: 'Basic Membership',
    datePurchased: '04/02/2024',
    status: 'Pending',
    total: '$5.00'
  }
];

// Sample benefits data
const BENEFITS_DATA = [
  {
    id: '1',
    name: 'Live Chat Access',
    description: 'Direct messaging with creator through the platform',
    status: 'active',
    availableTiers: ['Basic', 'Pro', 'Premium']
  },
  {
    id: '2',
    name: 'Early Access Content',
    description: 'Get access to new content 48 hours before public release',
    status: 'active',
    availableTiers: ['Pro', 'Premium']
  },
  {
    id: '3',
    name: 'General Support',
    description: 'Email support within 24 hours',
    status: 'active',
    availableTiers: ['Basic', 'Pro', 'Premium']
  },
  {
    id: '4',
    name: 'Monthly Zoom Meetup',
    description: 'Group video call with the creator once a month',
    status: 'active',
    availableTiers: ['Premium']
  },
  {
    id: '5',
    name: 'Private Discord Server',
    description: 'Join the exclusive community',
    status: 'active',
    availableTiers: ['Basic', 'Pro', 'Premium']
  },
  {
    id: '6',
    name: 'Exclusive Downloads',
    description: 'Premium files and resources only for members',
    status: 'active',
    availableTiers: ['Pro', 'Premium']
  },
  {
    id: '7',
    name: 'Ad-Free Experience',
    description: 'No advertisements on creator content',
    status: 'active',
    availableTiers: ['Basic', 'Pro', 'Premium']
  },
  {
    id: '8',
    name: 'Personalized Feedback',
    description: 'Get direct feedback on your work or questions',
    status: 'active',
    availableTiers: ['Premium']
  }
];

// Sample blocked users data
const MOCK_BLOCKED_USERS = [
  {
    id: '1',
    name: 'Blocked User 6',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    blockedOn: 'Today',
    reason: 'Unwanted contact',
  },
  {
    id: '2',
    name: 'Blocked User 10',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    blockedOn: 'Yesterday',
    reason: 'Other',
  },
  {
    id: '3',
    name: 'Blocked User 1',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    blockedOn: '2 weeks ago',
    reason: 'Unwanted contact',
  },
  {
    id: '4',
    name: 'Blocked User 15',
    avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
    blockedOn: '3 weeks ago',
    reason: 'Other',
  },
  {
    id: '5',
    name: 'Blocked User 3',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    blockedOn: '3 weeks ago',
    reason: 'Inappropriate content',
  },
];

export default function AudienceScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('relationship');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [audienceData, setAudienceData] = useState(AUDIENCE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesData, setSalesData] = useState(SALES_DATA);
  const [salesSearchQuery, setSalesSearchQuery] = useState('');
  const [selectedSalesRows, setSelectedSalesRows] = useState<string[]>([]);
  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [benefitsData, setBenefitsData] = useState(BENEFITS_DATA);
  const [blockedUsers, setBlockedUsers] = useState(MOCK_BLOCKED_USERS);
  const [blockedSearch, setBlockedSearch] = useState('');
  const [selectedReason, setSelectedReason] = useState('All reasons');
  const [sortNewest, setSortNewest] = useState(true);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [unblockModalUser, setUnblockModalUser] = useState<null | { id: string; name: string }>(null);
  
  // Filter state
  const [filterState, setFilterState] = useState({
    memberType: {
      paid: false,
      free: false
    },
    status: {
      active: false,
      cancelled: false,
      paused: false,
      declined: false
    },
    tiers: TIERS_DATA.reduce((acc, tier) => {
      acc[tier.id] = false;
      return acc;
    }, {} as Record<string, boolean>),
    joinDate: {
      startDate: '',
      endDate: ''
    },
    pledgeAmount: {
      from: '',
      to: ''
    }
  });

  const handleBack = () => router.back();

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter(id => id !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };
  
  const openFilterSheet = () => {
    // Initialize filter state based on active filters
    const newFilterState = {
      memberType: {
        paid: activeFilters.includes('paid'),
        free: activeFilters.includes('free')
      },
      status: {
        active: activeFilters.includes('active'),
        cancelled: activeFilters.includes('cancelled'),
        paused: activeFilters.includes('paused'),
        declined: activeFilters.includes('declined')
      },
      tiers: TIERS_DATA.reduce((acc, tier) => {
        acc[tier.id] = activeFilters.includes(tier.id);
        return acc;
      }, {} as Record<string, boolean>),
      joinDate: {
        startDate: '',
        endDate: ''
      },
      pledgeAmount: {
        from: '',
        to: ''
      }
    };
    
    setFilterState(newFilterState);
    setShowFilterSheet(true);
  };
  
  const applyFilters = () => {
    // Convert filter state to active filters
    const newActiveFilters: string[] = [];
    
    // Member type
    if (filterState.memberType.paid) newActiveFilters.push('paid');
    if (filterState.memberType.free) newActiveFilters.push('free');
    
    // Status
    if (filterState.status.active) newActiveFilters.push('active');
    if (filterState.status.cancelled) newActiveFilters.push('cancelled');
    if (filterState.status.paused) newActiveFilters.push('paused');
    if (filterState.status.declined) newActiveFilters.push('declined');
    
    // Tiers
    Object.entries(filterState.tiers).forEach(([id, isSelected]) => {
      if (isSelected) newActiveFilters.push(id);
    });
    
    // Apply new filters
    setActiveFilters(newActiveFilters);
    setShowFilterSheet(false);
    setCurrentPage(1); // Reset to first page
  };
  
  const cancelFilters = () => {
    setShowFilterSheet(false);
  };
  
  const updateFilterState = (section: keyof typeof filterState, key: string, value: boolean | string) => {
    setFilterState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Toggle selection of a row
  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  
  // Toggle selection of all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredAudience.length) {
      // If all rows are selected, unselect all
      setSelectedRows([]);
    } else {
      // Otherwise, select all rows
      setSelectedRows(filteredAudience.map(member => member.id));
    }
  };

  // Filter audience data based on search query and active filters
  const filteredAudience = audienceData.filter(member => {
    // Search query filter
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !member.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Member type filters
    if (activeFilters.includes('paid') && member.currentTier === 'Free') return false;
    if (activeFilters.includes('free') && member.currentTier !== 'Free') return false;
    
    // Status filters
    if (activeFilters.includes('active') && member.status !== 'Active') return false;
    if (activeFilters.includes('cancelled') && member.status !== 'Cancelled') return false;
    if (activeFilters.includes('paused') && member.status !== 'Paused') return false;
    if (activeFilters.includes('declined') && member.status !== 'Payment declined') return false;
    
    // Tier filters - check if any tier is selected and member matches
    const tierFilters = TIERS_DATA.map(tier => tier.id).filter(id => activeFilters.includes(id));
    if (tierFilters.length > 0) {
      const tierMatch = tierFilters.some(tierId => {
        const tier = TIERS_DATA.find(t => t.id === tierId);
        return tier && member.currentTier === tier.name;
      });
      if (!tierMatch) return false;
    }
    
    // Date filter - this is simplified, you'd need proper date comparison
    if (activeFilters.includes('new')) {
      const today = new Date();
      const joinDate = new Date(member.joinDate);
      const isThisMonth = joinDate.getMonth() === today.getMonth() && 
                          joinDate.getFullYear() === today.getFullYear();
      if (!isThisMonth) return false;
    }
    
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAudience.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredAudience.length);
  const currentPageData = filteredAudience.slice(startIndex, endIndex);
  
  // Create array of exactly 10 rows, filling with empty rows if needed
  const displayRows = [...currentPageData];
  while (displayRows.length < rowsPerPage) {
    displayRows.push({ id: `empty-${displayRows.length}`, name: '', email: '', currentTier: '', pledge: '', status: '', joinDate: '', lastChargeDate: '', subscriptionSource: '' });
  }

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters]);

  // Toggle selection of a sales row
  const toggleSalesRowSelection = (id: string) => {
    if (selectedSalesRows.includes(id)) {
      setSelectedSalesRows(selectedSalesRows.filter(rowId => rowId !== id));
    } else {
      setSelectedSalesRows([...selectedSalesRows, id]);
    }
  };
  
  // Toggle selection of all sales rows
  const toggleSelectAllSales = () => {
    if (selectedSalesRows.length === filteredSales.length) {
      setSelectedSalesRows([]);
    } else {
      setSelectedSalesRows(filteredSales.map(sale => sale.id));
    }
  };

  // Filter sales data based on search query
  const filteredSales = salesData.filter(sale => {
    if (salesSearchQuery) {
      const query = salesSearchQuery.toLowerCase();
      return (
        sale.customer.toLowerCase().includes(query) ||
        sale.product.toLowerCase().includes(query) ||
        sale.status.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Calculate pagination for sales
  const salesTotalPages = Math.ceil(filteredSales.length / rowsPerPage);
  const salesStartIndex = (salesCurrentPage - 1) * rowsPerPage;
  const salesEndIndex = Math.min(salesStartIndex + rowsPerPage, filteredSales.length);
  const currentSalesPageData = filteredSales.slice(salesStartIndex, salesEndIndex);
  
  // Create array of exactly 10 rows for sales, filling with empty rows if needed
  const displaySalesRows = [...currentSalesPageData];
  while (displaySalesRows.length < rowsPerPage) {
    displaySalesRows.push({ id: `empty-${displaySalesRows.length}`, customer: '', product: '', datePurchased: '', status: '', total: '' });
  }
  
  // Pagination controls for sales
  const goToNextSalesPage = () => {
    if (salesCurrentPage < salesTotalPages) {
      setSalesCurrentPage(salesCurrentPage + 1);
    }
  };
  
  const goToPreviousSalesPage = () => {
    if (salesCurrentPage > 1) {
      setSalesCurrentPage(salesCurrentPage - 1);
    }
  };
  
  // Reset sales page when filters change
  useEffect(() => {
    setSalesCurrentPage(1);
  }, [salesSearchQuery]);

  // Filter and sort blocked users
  const filteredBlockedUsers = blockedUsers.filter(u =>
    u.name.toLowerCase().includes(blockedSearch.toLowerCase()) &&
    (selectedReason === 'All reasons' || (u.reason && u.reason.toLowerCase() === selectedReason.toLowerCase()))
  ).sort((a, b) => sortNewest ? -1 : 1);

  const handleUnblock = (userId: string, userName: string) => {
    setUnblockModalUser({ id: userId, name: userName });
    setMenuUserId(null);
  };

  const confirmUnblock = () => {
    if (unblockModalUser) {
      setBlockedUsers(prev => prev.filter(u => u.id !== unblockModalUser.id));
      setUnblockModalUser(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBarComponent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.xl }]}>
          Audience
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      {/* Horizontal Tab Navigation */}
      <View style={[styles.tabBarContainer, { borderBottomColor: colors.border }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((tab) => (
            <TouchableOpacity 
              key={tab.id}
              style={[
                styles.tab, 
                activeTab === tab.id && { 
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text 
                style={[
                  styles.tabText, 
                  { 
                    color: activeTab === tab.id ? colors.primary : colors.textSecondary,
                    fontFamily: activeTab === tab.id ? fonts.semibold : fonts.regular
                  }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Content Area - Use conditional rendering instead of ScrollView to avoid nesting issues */}
      <View style={styles.content}>
        {activeTab === 'relationship' && (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.searchSection}>
              <View style={styles.searchRow}>
                <View style={[styles.searchBar, { backgroundColor: colors.border, flex: 1 }]}>
                  <TextInput
                    placeholder="Search audience members..."
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                
                <TouchableOpacity style={[styles.mailOption, { backgroundColor: colors.background, marginLeft: 10 }]}>
                  <Mail size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Filters Row with Clear All Option */}
              <View style={styles.filtersHeaderRow}>
                <Text style={[styles.filtersTitle, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  Filters
                </Text>
                {activeFilters.length > 0 && (
                  <TouchableOpacity onPress={clearAllFilters}>
                    <Text style={[styles.clearAllText, { color: colors.primary, fontFamily: fonts.medium }]}>
                      Clear all
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
              >
                <TouchableOpacity 
                  style={[styles.filterIcon, { borderColor: colors.border }]}
                  onPress={openFilterSheet}
                >
                  <SlidersHorizontal size={16} color={colors.textPrimary} />
                </TouchableOpacity>
                
                {FILTERS.map(filter => (
                  <TouchableOpacity 
                    key={filter.id}
                    style={[
                      styles.filterChip, 
                      { 
                        backgroundColor: activeFilters.includes(filter.id) ? colors.primary : colors.background,
                        borderColor: activeFilters.includes(filter.id) ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => toggleFilter(filter.id)}
                  >
                    <Text 
                      style={[
                        styles.filterText, 
                        { 
                          color: activeFilters.includes(filter.id) ? colors.background : colors.textPrimary,
                          fontFamily: fonts.medium 
                        }
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Audience Table */}
              {filteredAudience.length > 0 ? (
                <View style={styles.tableContainer}>
                  <ScrollView horizontal>
                    <View style={styles.tableContent}>
                      {/* Table Header */}
                      <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
                        <TouchableOpacity 
                          style={[styles.tableHeaderCell, { width: 40, justifyContent: 'center', alignItems: 'center' }]} 
                          onPress={toggleSelectAll}
                        >
                          {selectedRows.length === filteredAudience.length && filteredAudience.length > 0 ? (
                            <CheckSquare size={18} color={colors.primary} />
                          ) : (
                            <Square size={18} color={colors.textSecondary} />
                          )}
                        </TouchableOpacity>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 120 }]}>Name</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 180 }]}>Email</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 100 }]}>Current Tier</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 90 }]}>Pledge</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 110 }]}>Status</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 90 }]}>Join Date</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 100 }]}>Last Charge</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 80 }]}>Source</Text>
                      </View>
                      
                      {/* Table Content - Always show exactly 10 rows */}
                      {displayRows.map((member, index) => (
                        <TouchableOpacity 
                          key={member.id}
                          style={[
                            styles.tableRow, 
                            { borderBottomColor: colors.border },
                            index % 2 === 1 && { backgroundColor: colors.border + '40' },
                            !member.name && styles.emptyRow
                          ]}
                          disabled={!member.name}
                        >
                          <TouchableOpacity 
                            style={[styles.tableCell, { width: 40, justifyContent: 'center', alignItems: 'center' }]}
                            onPress={() => member.name ? toggleRowSelection(member.id) : null}
                            disabled={!member.name}
                          >
                            {member.name && selectedRows.includes(member.id) ? (
                              <CheckSquare size={18} color={colors.primary} />
                            ) : (
                              member.name ? <Square size={18} color={colors.textSecondary} /> : null
                            )}
                          </TouchableOpacity>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.medium, width: 120 }]} numberOfLines={1} ellipsizeMode="tail">{member.name}</Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 180 }]} numberOfLines={1} ellipsizeMode="tail">{member.email}</Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 100 }]} numberOfLines={1} ellipsizeMode="tail">{member.currentTier}</Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 90 }]} numberOfLines={1} ellipsizeMode="tail">{member.pledge}</Text>
                          <Text 
                            style={[
                              styles.tableCell, 
                              { 
                                color: member.status === 'Active' ? 'green' : 
                                      member.status === 'Payment declined' ? 'red' : 
                                      colors.textPrimary,
                                fontFamily: fonts.regular,
                                width: 110 
                              }
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {member.status}
                          </Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 90 }]} numberOfLines={1} ellipsizeMode="tail">{member.joinDate}</Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 100 }]} numberOfLines={1} ellipsizeMode="tail">{member.lastChargeDate}</Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 80 }]} numberOfLines={1} ellipsizeMode="tail">{member.subscriptionSource}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                  
                  {/* Clear separation between table and pagination */}
                  <View style={styles.paginationSeparator} />
                  
                  {/* Pagination controls */}
                  <View style={styles.paginationContainer}>
                    <Text style={[styles.paginationText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Showing {startIndex + 1}-{endIndex} of {filteredAudience.length}
                    </Text>
                    <View style={styles.paginationControls}>
                      <TouchableOpacity 
                        style={[
                          styles.paginationButton, 
                          currentPage === 1 && styles.paginationButtonDisabled,
                          { borderColor: colors.border }
                        ]} 
                        onPress={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <Text style={[
                          styles.paginationButtonText, 
                          { 
                            color: currentPage === 1 ? colors.textSecondary : colors.textPrimary,
                            fontFamily: fonts.medium 
                          }
                        ]}>Previous</Text>
                      </TouchableOpacity>
                      <Text style={[styles.paginationPageIndicator, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                        Page {currentPage} of {totalPages}
                      </Text>
                      <TouchableOpacity 
                        style={[
                          styles.paginationButton, 
                          currentPage === totalPages && styles.paginationButtonDisabled,
                          { borderColor: colors.border }
                        ]} 
                        onPress={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <Text style={[
                          styles.paginationButtonText, 
                          { 
                            color: currentPage === totalPages ? colors.textSecondary : colors.textPrimary,
                            fontFamily: fonts.medium 
                          }
                        ]}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                    No audience members match your filters
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
        
        {activeTab === 'sales' && (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.searchSection}>
              <View style={styles.searchRow}>
                <View style={[styles.searchBar, { backgroundColor: colors.border, flex: 1 }]}>
                  <TextInput
                    placeholder="Search sales..."
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                    value={salesSearchQuery}
                    onChangeText={setSalesSearchQuery}
                  />
                </View>
              </View>

              {/* Sales Table */}
              {filteredSales.length > 0 ? (
                <View style={styles.tableContainer}>
                  <ScrollView horizontal>
                    <View style={styles.tableContent}>
                      {/* Table Header */}
                      <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
                        <TouchableOpacity 
                          style={[styles.tableHeaderCell, { width: 40, justifyContent: 'center', alignItems: 'center' }]} 
                          onPress={toggleSelectAllSales}
                        >
                          {selectedSalesRows.length === filteredSales.length && filteredSales.length > 0 ? (
                            <CheckSquare size={18} color={colors.primary} />
                          ) : (
                            <Square size={18} color={colors.textSecondary} />
                          )}
                        </TouchableOpacity>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 150 }]}>
                          Customer
                        </Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 180 }]}>
                          Product
                        </Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 120 }]}>
                          Date Purchased
                        </Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 100 }]}>
                          Status
                        </Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, fontFamily: fonts.medium, width: 80 }]}>
                          Total
                        </Text>
                      </View>
                      
                      {/* Table Content */}
                      {displaySalesRows.map((sale, index) => (
                        <TouchableOpacity 
                          key={sale.id}
                          style={[
                            styles.tableRow, 
                            { borderBottomColor: colors.border },
                            index % 2 === 1 && { backgroundColor: colors.border + '40' },
                            !sale.customer && styles.emptyRow
                          ]}
                          disabled={!sale.customer}
                        >
                          <TouchableOpacity 
                            style={[styles.tableCell, { width: 40, justifyContent: 'center', alignItems: 'center' }]}
                            onPress={() => sale.customer ? toggleSalesRowSelection(sale.id) : null}
                            disabled={!sale.customer}
                          >
                            {sale.customer && selectedSalesRows.includes(sale.id) ? (
                              <CheckSquare size={18} color={colors.primary} />
                            ) : (
                              sale.customer ? <Square size={18} color={colors.textSecondary} /> : null
                            )}
                          </TouchableOpacity>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.medium, width: 150 }]} numberOfLines={1} ellipsizeMode="tail">
                            {sale.customer}
                          </Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 180 }]} numberOfLines={1} ellipsizeMode="tail">
                            {sale.product}
                          </Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 120 }]} numberOfLines={1} ellipsizeMode="tail">
                            {sale.datePurchased}
                          </Text>
                          <Text 
                            style={[
                              styles.tableCell, 
                              { 
                                color: sale.status === 'Completed' ? 'green' : 
                                      sale.status === 'Failed' || sale.status === 'Refunded' ? 'red' :
                                      sale.status === 'Pending' ? 'orange' :
                                      colors.textPrimary,
                                fontFamily: fonts.regular,
                                width: 100
                              }
                            ]} 
                            numberOfLines={1} 
                            ellipsizeMode="tail"
                          >
                            {sale.status}
                          </Text>
                          <Text style={[styles.tableCell, { color: colors.textPrimary, fontFamily: fonts.regular, width: 80 }]} numberOfLines={1} ellipsizeMode="tail">
                            {sale.total}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                  
                  {/* Clear separation between table and pagination */}
                  <View style={styles.paginationSeparator} />
                  
                  {/* Pagination controls */}
                  <View style={styles.paginationContainer}>
                    <Text style={[styles.paginationText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      Showing {salesStartIndex + 1}-{salesEndIndex} of {filteredSales.length}
                    </Text>
                    <View style={styles.paginationControls}>
                      <TouchableOpacity 
                        style={[
                          styles.paginationButton, 
                          salesCurrentPage === 1 && styles.paginationButtonDisabled,
                          { borderColor: colors.border }
                        ]} 
                        onPress={goToPreviousSalesPage}
                        disabled={salesCurrentPage === 1}
                      >
                        <Text style={[
                          styles.paginationButtonText, 
                          { 
                            color: salesCurrentPage === 1 ? colors.textSecondary : colors.textPrimary,
                            fontFamily: fonts.medium 
                          }
                        ]}>Previous</Text>
                      </TouchableOpacity>
                      <Text style={[styles.paginationPageIndicator, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                        Page {salesCurrentPage} of {salesTotalPages}
                      </Text>
                      <TouchableOpacity 
                        style={[
                          styles.paginationButton, 
                          salesCurrentPage === salesTotalPages && styles.paginationButtonDisabled,
                          { borderColor: colors.border }
                        ]} 
                        onPress={goToNextSalesPage}
                        disabled={salesCurrentPage === salesTotalPages}
                      >
                        <Text style={[
                          styles.paginationButtonText, 
                          { 
                            color: salesCurrentPage === salesTotalPages ? colors.textSecondary : colors.textPrimary,
                            fontFamily: fonts.medium 
                          }
                        ]}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                    No sales match your search
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
        
        {activeTab === 'benefits' && (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitsSectionHeader}>
                <Text style={[styles.benefitsSectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.lg }]}>
                  Benefits not tracked
                </Text>
              </View>
              
              <Text style={[styles.benefitsDescription, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                These benefits aren't tracked for individual subscribers. Members will have access to all benefits within their tier.
              </Text>
              
              <View style={styles.simpleBenefitsList}>
                {benefitsData.map((benefit) => (
                  <View 
                    key={benefit.id} 
                    style={[styles.simpleBenefitItem, { 
                      borderBottomColor: colors.border,
                      backgroundColor: benefit.status === 'active' ? colors.background : colors.border + '30'
                    }]}
                  >
                    <Text style={[styles.simpleBenefitName, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                      {benefit.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
        
        {activeTab === 'blocked' && (
          <View style={[styles.blockedContainer, styles.contentContainer]}>
            <View style={styles.blockedSearchRow}> 
              <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.border + '40', flex: 1 }]}> 
                <Search size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search blocked users..."
                  placeholderTextColor={colors.textSecondary}
                  value={blockedSearch}
                  onChangeText={setBlockedSearch}
                  style={{ flex: 1, height: '100%', color: colors.textPrimary, fontFamily: fonts.regular, fontSize: fontSize.md, paddingVertical: 0 }}
                  accessibilityLabel="Search blocked users"
                />
              </View>
              <TouchableOpacity
                style={[styles.filterButton, { borderColor: colors.border, backgroundColor: colors.background }]}
                onPress={() => setFilterSheetOpen(true)}
              >
                <Filter size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{ flex: 1 }}>
              {/* Overlay to close kebab menu when clicking outside */}
              {menuUserId && (
                <TouchableOpacity
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                  activeOpacity={1}
                  onPress={() => setMenuUserId(null)}
                />
              )}
              
              <FlatList
                data={filteredBlockedUsers}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, textAlign: 'center', marginTop: 48 }}>
                    No blocked users found.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={[styles.userCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                      <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>{item.name}</Text>
                      {item.reason && (
                        <Text style={[styles.reasonPill, {
                          color: colors.textSecondary,
                          fontFamily: fonts.medium,
                          backgroundColor: colors.border + '33',
                          borderColor: colors.border,
                        }]}>{item.reason}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={{ padding: 8, marginLeft: 8 }}
                      onPress={() => setMenuUserId(menuUserId === item.id ? null : item.id)}
                    >
                      <MoreVertical size={22} color={colors.textSecondary} />
                    </TouchableOpacity>
                    {/* Kebab menu popover */}
                    {menuUserId === item.id && (
                      <View style={[styles.menuPopover, { backgroundColor: colors.background, borderColor: colors.border }]}>
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => handleUnblock(item.id, item.name)}
                        >
                          <Text style={{ color: 'red', fontFamily: fonts.medium, fontSize: 15 }}>Unblock</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </View>
      
      {/* Filter Bottom Sheet */}
      <Modal
        visible={showFilterSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelFilters}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.bottomSheetContainer, { backgroundColor: colors.background }]}>
            <View style={styles.bottomSheetHandle} />
            
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                Filter options
              </Text>
              <TouchableOpacity onPress={cancelFilters} style={styles.closeButton}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.bottomSheetContent}>
              {/* Member Type */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  Member type
                </Text>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity 
                    style={styles.checkboxRow} 
                    onPress={() => updateFilterState('memberType', 'paid', !filterState.memberType.paid)}
                  >
                    {filterState.memberType.paid ? (
                      <CheckSquare size={20} color={colors.primary} />
                    ) : (
                      <Square size={20} color={colors.textSecondary} />
                    )}
                    <Text style={[styles.checkboxLabel, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                      Paid members
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateFilterState('memberType', 'free', !filterState.memberType.free)}
                  >
                    {filterState.memberType.free ? (
                      <CheckSquare size={20} color={colors.primary} />
                    ) : (
                      <Square size={20} color={colors.textSecondary} />
                    )}
                    <Text style={[styles.checkboxLabel, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                      Free members
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Status */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  Status
                </Text>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateFilterState('status', 'active', !filterState.status.active)}
                  >
                    {filterState.status.active ? (
                      <CheckSquare size={20} color={colors.primary} />
                    ) : (
                      <Square size={20} color={colors.textSecondary} />
                    )}
                    <Text style={[styles.checkboxLabel, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                      Active
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateFilterState('status', 'cancelled', !filterState.status.cancelled)}
                  >
                    {filterState.status.cancelled ? (
                      <CheckSquare size={20} color={colors.primary} />
                    ) : (
                      <Square size={20} color={colors.textSecondary} />
                    )}
                    <Text style={[styles.checkboxLabel, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                      Cancelled
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateFilterState('status', 'paused', !filterState.status.paused)}
                  >
                    {filterState.status.paused ? (
                      <CheckSquare size={20} color={colors.primary} />
                    ) : (
                      <Square size={20} color={colors.textSecondary} />
                    )}
                    <Text style={[styles.checkboxLabel, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                      Paused
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateFilterState('status', 'declined', !filterState.status.declined)}
                  >
                    {filterState.status.declined ? (
                      <CheckSquare size={20} color={colors.primary} />
                    ) : (
                      <Square size={20} color={colors.textSecondary} />
                    )}
                    <Text style={[styles.checkboxLabel, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                      Payment declined
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Tiers */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  Tiers
                </Text>
                <View style={styles.checkboxContainer}>
                  {TIERS_DATA.map((tier) => (
                    <TouchableOpacity 
                      key={tier.id}
                      style={styles.checkboxRow}
                      onPress={() => updateFilterState('tiers', tier.id, !filterState.tiers[tier.id])}
                    >
                      {filterState.tiers[tier.id] ? (
                        <CheckSquare size={20} color={colors.primary} />
                      ) : (
                        <Square size={20} color={colors.textSecondary} />
                      )}
                      <Text style={[styles.checkboxLabel, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                        {tier.name} ({tier.price})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Join Date */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  Join date
                </Text>
                <View style={styles.datePickerContainer}>
                  <View style={styles.dateInputRow}>
                    <Text style={[styles.dateLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      From:
                    </Text>
                    <View style={[styles.dateInputContainer, { borderColor: colors.border }]}>
                      <TextInput
                        style={[styles.dateInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor={colors.textSecondary}
                        value={filterState.joinDate.startDate}
                        onChangeText={(text) => updateFilterState('joinDate', 'startDate', text)}
                        keyboardType="numbers-and-punctuation"
                      />
                      <CalendarIcon size={18} color={colors.textSecondary} />
                    </View>
                  </View>
                  
                  <View style={styles.dateInputRow}>
                    <Text style={[styles.dateLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      To:
                    </Text>
                    <View style={[styles.dateInputContainer, { borderColor: colors.border }]}>
                      <TextInput
                        style={[styles.dateInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor={colors.textSecondary}
                        value={filterState.joinDate.endDate}
                        onChangeText={(text) => updateFilterState('joinDate', 'endDate', text)}
                        keyboardType="numbers-and-punctuation"
                      />
                      <CalendarIcon size={18} color={colors.textSecondary} />
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Pledge Amount */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                  Pledge amount
                </Text>
                <View style={styles.amountContainer}>
                  <View style={styles.amountInputRow}>
                    <Text style={[styles.amountLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      From: $
                    </Text>
                    <View style={[styles.amountInputContainer, { borderColor: colors.border }]}>
                      <TextInput
                        style={[styles.amountInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                        placeholder="0.00"
                        placeholderTextColor={colors.textSecondary}
                        value={filterState.pledgeAmount.from}
                        onChangeText={(text) => updateFilterState('pledgeAmount', 'from', text)}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.amountInputRow}>
                    <Text style={[styles.amountLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      To: $
                    </Text>
                    <View style={[styles.amountInputContainer, { borderColor: colors.border }]}>
                      <TextInput
                        style={[styles.amountInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
                        placeholder="0.00"
                        placeholderTextColor={colors.textSecondary}
                        value={filterState.pledgeAmount.to}
                        onChangeText={(text) => updateFilterState('pledgeAmount', 'to', text)}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <View style={[styles.bottomSheetFooter, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={cancelFilters}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.applyButton, { backgroundColor: colors.primary }]}
                onPress={applyFilters}
              >
                <Text style={[styles.applyButtonText, { color: colors.background, fontFamily: fonts.semibold }]}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Custom unblock modal */}
      <Modal
        visible={!!unblockModalUser}
        transparent
        animationType="fade"
        onRequestClose={() => setUnblockModalUser(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              Unblock {unblockModalUser?.name}?
            </Text>
            <Text style={[styles.modalDescription, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
              Are you sure you want to unblock this user?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { backgroundColor: colors.border + '40', borderColor: colors.border }]}
                onPress={() => setUnblockModalUser(null)}
              >
                <Text style={[styles.modalButtonText, { color: colors.textPrimary, fontFamily: fonts.bold }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, { backgroundColor: 'red' }]}
                onPress={confirmUnblock}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF', fontFamily: fonts.bold }]}>Unblock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  tabBarContainer: {
    borderBottomWidth: 1,
    width: '100%',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 12,
    borderBottomWidth: 0,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  tabContent: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabContentText: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  searchSection: {
    width: '100%',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  mailOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: 50,
    height: 50,
  },
  filtersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  filtersTitle: {
    fontSize: 16,
  },
  clearAllText: {
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingRight: 16,
  },
  filterIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
  },
  // Table styles
  tableContainer: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
    minWidth: '100%',
  },
  tableHeaderCell: {
    fontSize: 12,
    paddingHorizontal: 8,
    textAlign: 'left',
  },
  tableCell: {
    fontSize: 14,
    paddingHorizontal: 8,
    textAlign: 'left',
  },
  tableContent: {
    minWidth: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  paginationText: {
    fontSize: 14,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
  },
  paginationPageIndicator: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  emptyRow: {
    opacity: 0.3,
    height: 52,  // Set a consistent height for empty rows
  },
  paginationSeparator: {
    height: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  bottomSheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bottomSheetTitle: {
    fontSize: 18,
  },
  closeButton: {
    padding: 4,
  },
  bottomSheetContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  checkboxContainer: {
    marginLeft: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 15,
    marginLeft: 12,
  },
  datePickerContainer: {
    marginTop: 8,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 15,
    width: 50,
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  amountContainer: {
    marginTop: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 15,
    width: 60,
  },
  amountInputContainer: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  bottomSheetFooter: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  applyButton: {
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  applyButtonText: {
    fontSize: 16,
  },
  // Benefits styles
  benefitsContainer: {
    flex: 1,
  },
  benefitsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitsSectionTitle: {
    fontSize: 18,
  },
  benefitsDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  simpleBenefitsList: {
    flex: 1,
  },
  simpleBenefitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  simpleBenefitName: {
    fontSize: 15,
  },
  // Keep other benefit styles for potential future use
  benefitsList: {
    flex: 1,
  },
  actionDivider: {
    width: 1,
    height: '100%',
  },
  // Blocked Users Styles
  blockedContainer: {
    flex: 1,
  },
  blockedSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    height: 50,
  },
  filterButton: {
    borderRadius: 10,
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  reasonPill: {
    fontSize: 13,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
    overflow: 'hidden',
  },
  menuPopover: {
    position: 'absolute',
    top: 54,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 4,
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 4,
  },
  modalButtonText: {
    fontSize: 15,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
}); 