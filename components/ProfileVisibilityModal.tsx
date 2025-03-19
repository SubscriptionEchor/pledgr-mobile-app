import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Globe, Users, Lock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useState } from 'react';

interface ProfileVisibilityModalProps {
  visible: boolean;
  onClose: () => void;
  selectedVisibility: string;
  onSelect: (visibility: string) => void;
}

export function ProfileVisibilityModal({ 
  visible, 
  onClose, 
  selectedVisibility,
  onSelect 
}: ProfileVisibilityModalProps) {
  const { colors } = useTheme();
  const [isPublic, setIsPublic] = useState(selectedVisibility === 'public');

  const handleToggle = (value: boolean) => {
    setIsPublic(value);
    onSelect(value ? 'public' : 'private');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Profile Visibility</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.warningBox, { backgroundColor: `${colors.warning}15` }]}>
            <AlertTriangle size={24} color={colors.warning} />
            <Text style={[styles.warningText, { color: colors.textPrimary }]}>
              Choose who can see your profile and content. You can change this at any time.
            </Text>
          </View>

          <View style={[styles.mainSetting, { backgroundColor: colors.surface }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Public Profile
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Allow anyone to view your profile and content
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={handleToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isPublic ? colors.buttonText : colors.surface}
            />
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
              What this means:
            </Text>
            
            <View style={styles.infoCards}>
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Globe size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                    Public Profile
                  </Text>
                  <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                    Your profile, posts, and activity are visible to everyone
                  </Text>
                </View>
              </View>

              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Users size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                    Engagement
                  </Text>
                  <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                    Anyone can follow you and interact with your content
                  </Text>
                </View>
              </View>

              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Lock size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                    Privacy Control
                  </Text>
                  <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                    You can still block specific users and control who can message you
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  mainSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoCardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});