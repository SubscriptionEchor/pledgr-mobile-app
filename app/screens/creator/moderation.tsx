import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Pressable, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { ChevronLeft, MoreVertical, Clock, Flag, User, Search, X, RefreshCw } from 'lucide-react-native';
import { StatusBarComponent } from '@/components/StatusBarComponent';

type TabType = 'reported' | 'moderators';

// Mock data for reported content
const MOCK_REPORTED_CONTENT = [
  {
    id: '1',
    reporterName: 'JohnDoe',
    reporterAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    contentType: 'post',
    reportReason: 'Spam',
    timeAgo: '2 hours ago',
    content: 'Check out this amazing new coin! Visit http://scamlink.com for more info. Don\'t miss out on this once in a lifetime opportunity!',
  },
  {
    id: '2',
    reporterName: 'AliceSmith',
    reporterAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    contentType: 'comment',
    reportReason: 'Harassment or bullying',
    timeAgo: '5 hours ago',
    content: 'You clearly don\'t know what you\'re talking about. Stop spreading lies and go educate yourself!',
  },
  {
    id: '3',
    reporterName: 'MikeJohnson',
    reporterAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    contentType: 'message',
    reportReason: 'Inappropriate content',
    timeAgo: '1 day ago',
    content: 'This content contains inappropriate language and references that violate community guidelines.',
  },
];

// Mock data for user search
const MOCK_USERS = [
  {
    id: '1',
    name: 'Jane Cooper',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    username: '@janecooper',
  },
  {
    id: '2',
    name: 'Wade Warren',
    avatar: 'https://randomuser.me/api/portraits/men/20.jpg',
    username: '@wadewarren',
  },
  {
    id: '3',
    name: 'Esther Howard',
    avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
    username: '@estherhoward',
  },
  {
    id: '4',
    name: 'Cameron Williamson',
    avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
    username: '@cameronw',
  },
  {
    id: '5',
    name: 'Brooklyn Simmons',
    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    username: '@brooklyn',
  },
];

export default function ModerationHubScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('reported');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moderatorRequestVisible, setModeratorRequestVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [requestedModerators, setRequestedModerators] = useState<typeof MOCK_USERS>([]);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);
  const [userToAction, setUserToAction] = useState<typeof MOCK_USERS[0] | null>(null);

  const handleBack = () => router.back();
  
  const openActionSheet = (id: string) => {
    setSelectedItemId(id);
    setActionSheetVisible(true);
  };
  
  const closeActionSheet = () => {
    setActionSheetVisible(false);
  };
  
  const handleKeepContent = () => {
    // Logic to keep content
    closeActionSheet();
  };
  
  const handleDeleteContent = () => {
    // Logic to delete content
    closeActionSheet();
  };

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(user => !requestedModerators.some(mod => mod.id === user.id));

  const openModeratorRequestModal = (user: typeof MOCK_USERS[0]) => {
    setSelectedUser(user);
    setModeratorRequestVisible(true);
  };

  const closeModeratorRequestModal = () => {
    setModeratorRequestVisible(false);
    setSelectedUser(null);
  };

  const handleConfirmModeratorRequest = () => {
    // Add selected user to requested moderators list
    if (selectedUser) {
      setRequestedModerators([...requestedModerators, selectedUser]);
    }
    closeModeratorRequestModal();
    // Clear search when member is added
    setSearchQuery('');
  };

  const openCancelRequestModal = (user: typeof MOCK_USERS[0]) => {
    setUserToAction(user);
    setCancelModalVisible(true);
  };

  const openResendRequestModal = (user: typeof MOCK_USERS[0]) => {
    setUserToAction(user);
    setResendModalVisible(true);
  };

  const closeCancelModal = () => {
    setCancelModalVisible(false);
    setUserToAction(null);
  };

  const closeResendModal = () => {
    setResendModalVisible(false);
    setUserToAction(null);
  };

  const handleCancelRequest = () => {
    // Remove user from requested moderators
    if (userToAction) {
      setRequestedModerators(requestedModerators.filter(user => user.id !== userToAction.id));
    }
    closeCancelModal();
  };

  const handleResendRequest = () => {
    // Logic to resend the request
    // In a real app, this would make an API call
    if (userToAction) {
      console.log(`Resending request to user ${userToAction.id}`);
    }
    closeResendModal();
  };

  const renderReportedContent = () => {
    if (MOCK_REPORTED_CONTENT.length === 0) {
      return (
        <View style={styles.tabContent}>
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
            No reported content to review at this time
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.contentContainer}>
        {MOCK_REPORTED_CONTENT.map((item) => (
          <View key={item.id} style={[styles.reportCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.reportHeader}>
              <View style={styles.reporterInfo}>
                <Image source={{ uri: item.reporterAvatar }} style={styles.avatar} />
                <View>
                  <Text style={[styles.reporterName, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    {item.reporterName}
                  </Text>
                  <View style={styles.metaRow}>
                    <Flag size={14} color={colors.warning} style={{ marginRight: 4 }} />
                    <Text style={[{ 
                      color: colors.primary,
                      fontFamily: fonts.medium,
                      fontSize: 13
                    }]}>
                      {item.contentType.toUpperCase()}
                    </Text>
                    <View style={styles.dot} />
                    <Clock size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.timeAgo, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                      {item.timeAgo}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => openActionSheet(item.id)} style={styles.kebabMenu}>
                <MoreVertical size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.contentTypeContainer}>
              <Text style={[styles.reasonLabel, { 
                backgroundColor: 'rgba(255, 184, 0, 0.15)', 
                color: colors.warning,
                fontFamily: fonts.medium 
              }]}>
                {item.reportReason}
              </Text>
            </View>
            
            <Text style={[styles.reportedContent, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
              {item.content}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderModerators = () => (
    <View style={styles.moderatorsContainer}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fonts.regular }]}
          placeholder="Search for users to add as moderators"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Show Pending Requests Section */}
      {requestedModerators.length > 0 && (
        <View style={styles.requestedModeratorsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
            Pending Requests
          </Text>
          
          {requestedModerators.map(user => (
            <View 
              key={user.id}
              style={[styles.requestedModeratorCard, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}
            >
              <View style={styles.requestedModeratorInfo}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    {user.name}
                  </Text>
                </View>
              </View>
              
              <View style={styles.requestActions}>
                <TouchableOpacity 
                  style={[styles.requestActionButton, { 
                    backgroundColor: 'rgba(255, 59, 48, 0.1)', 
                    borderRadius: 8 
                  }]}
                  onPress={() => openCancelRequestModal(user)}
                >
                  <X size={16} color={colors.error} />
                  <Text style={[styles.requestActionText, { color: colors.error, fontFamily: fonts.medium }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.requestActionButton, { 
                    backgroundColor: 'rgba(0, 122, 255, 0.1)', 
                    borderRadius: 8 
                  }]}
                  onPress={() => openResendRequestModal(user)}
                >
                  <RefreshCw size={16} color={colors.primary} />
                  <Text style={[styles.requestActionText, { color: colors.primary, fontFamily: fonts.medium }]}>
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Search Results Section */}
      {searchQuery.length > 0 ? (
        <View style={styles.searchResultsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
            Search Results
          </Text>
          
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <TouchableOpacity 
                key={user.id}
                style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => openModeratorRequestModal(user)}
              >
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                    {user.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.noResultsText, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
              No users found matching "{searchQuery}"
            </Text>
          )}
        </View>
      ) : requestedModerators.length === 0 && (
        <View style={styles.tabContent}>
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: fonts.medium }]}>
            You have not added any moderators yet
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
            Search for users to add as moderators
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBarComponent />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.xl }]}>
          Moderation Hub
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'reported' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('reported')}
        >
          <Text
            style={[
              styles.tabText,
              { 
                color: activeTab === 'reported' ? colors.primary : colors.textSecondary,
                fontFamily: fonts.medium
              }
            ]}
          >
            Reported Content
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'moderators' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('moderators')}
        >
          <Text
            style={[
              styles.tabText,
              { 
                color: activeTab === 'moderators' ? colors.primary : colors.textSecondary,
                fontFamily: fonts.medium
              }
            ]}
          >
            Moderators
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {activeTab === 'reported' ? renderReportedContent() : renderModerators()}
      </ScrollView>
      
      {/* Action Sheet Modal */}
      <Modal
        transparent
        visible={actionSheetVisible}
        animationType="slide"
        onRequestClose={closeActionSheet}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]} 
          onPress={closeActionSheet}
        >
          <Pressable 
            style={[styles.actionSheet, { backgroundColor: colors.background }]}
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.actionSheetTitle, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
              Moderation Actions
            </Text>
            
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleKeepContent}
            >
              <Text style={[styles.actionButtonText, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
                Keep Content
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDeleteContent}
            >
              <Text style={[styles.actionButtonText, { color: colors.error, fontFamily: fonts.medium }]}>
                Delete Content
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Moderator Request Modal */}
      <Modal
        transparent
        visible={moderatorRequestVisible}
        animationType="slide"
        onRequestClose={closeModeratorRequestModal}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]} 
          onPress={closeModeratorRequestModal}
        >
          <Pressable 
            style={[styles.actionSheet, { backgroundColor: colors.background }]}
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.actionSheetTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              Send Moderator Request
            </Text>
            
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            
            <Text style={[styles.confirmationText, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
              Are you sure you want to request {selectedUser?.name} to become a moderator?
            </Text>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={closeModeratorRequestModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleConfirmModeratorRequest}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF', fontFamily: fonts.medium }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Cancel Request Confirmation Modal */}
      <Modal
        transparent
        visible={cancelModalVisible}
        animationType="slide"
        onRequestClose={closeCancelModal}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]} 
          onPress={closeCancelModal}
        >
          <Pressable 
            style={[styles.actionSheet, { backgroundColor: colors.background }]}
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.actionSheetTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              Cancel Moderator Request
            </Text>
            
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            
            <Text style={[styles.confirmationText, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
              Are you sure you want to cancel the moderator request for {userToAction?.name}?
            </Text>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={closeCancelModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  No, Keep Request
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.error }]}
                onPress={handleCancelRequest}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF', fontFamily: fonts.medium }]}>
                  Yes, Cancel Request
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Resend Request Confirmation Modal */}
      <Modal
        transparent
        visible={resendModalVisible}
        animationType="slide"
        onRequestClose={closeResendModal}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]} 
          onPress={closeResendModal}
        >
          <Pressable 
            style={[styles.actionSheet, { backgroundColor: colors.background }]}
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.actionSheetTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
              Resend Moderator Request
            </Text>
            
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            
            <Text style={[styles.confirmationText, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
              Are you sure you want to resend the moderator request to {userToAction?.name}?
            </Text>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={closeResendModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
                  No, Don't Resend
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleResendRequest}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF', fontFamily: fonts.medium }]}>
                  Yes, Resend Request
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubText: {
    textAlign: 'center',
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
  },
  reportCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reporterName: {
    fontSize: 16,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportReason: {
    fontSize: 13,
  },
  timeAgo: {
    fontSize: 13,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 6,
  },
  kebabMenu: {
    padding: 8,
  },
  contentTypeContainer: {
    marginBottom: 12,
  },
  contentTypeLabel: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  reportedContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  actionSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  actionSheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C4C4C4',
    alignSelf: 'center',
    marginBottom: 16,
  },
  actionSheetTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  actionButton: {
    paddingVertical: 16,
  },
  actionButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dividerLine: {
    height: 1,
    marginTop: 0,
    marginBottom: 16,
  },
  reasonLabel: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  moderatorsContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    padding: 0,
  },
  searchResultsContainer: {
    paddingTop: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 14,
  },
  noResultsText: {
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 15,
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  confirmButton: {
    marginLeft: 8,
  },
  modalButtonText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  requestedModeratorsSection: {
    marginBottom: 24,
  },
  requestedModeratorCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  requestedModeratorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  requestActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 12,
    borderRadius: 8,
  },
  requestActionText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
}); 