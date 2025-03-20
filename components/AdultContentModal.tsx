import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, TriangleAlert as AlertTriangle, Globe, Shield, Eye } from 'lucide-react-native';

interface AdultContentModalProps {
  visible: boolean;
  onClose: () => void;
  initialSettings: {
    enabled: boolean;
  };
  onSave: (settings: { enabled: boolean }) => void;
}

export function AdultContentModal({ 
  visible, 
  onClose,
  initialSettings,
  onSave
}: AdultContentModalProps) {
  const { colors } = useTheme();

  const handleToggle = (value: boolean) => {
    onSave({ enabled: value });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Adult Content</Text>
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
              These settings control how adult content is displayed in your feed. Please adjust according to your preferences.
            </Text>
          </View>

          <View style={[styles.mainSetting, { backgroundColor: colors.surface }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Show Adult Content
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Allow adult content to appear in your feed
              </Text>
            </View>
            <Switch
              value={initialSettings.enabled}
              onValueChange={handleToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={initialSettings.enabled ? colors.buttonText : colors.surface}
            />
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
              What this means:
            </Text>
            
            <View style={styles.infoCards}>
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Eye size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                    Content Filtering
                  </Text>
                  <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                    Users will see explicit content like nudity or sexual themes from adult creators in their feed, per the platform's definition.
                  </Text>
                </View>
              </View>

              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                    Safe Browsing
                  </Text>
                  <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                    Automatic filtering, warnings, and blur effects for adult content will be turned off, showing unfiltered material.
                  </Text>
                </View>
              </View>

              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <Globe size={20} color={colors.primary} />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={[styles.infoCardTitle, { color: colors.textPrimary }]}>
                    Recommendations
                  </Text>
                  <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
                    This will include adult content, tailoring the feed to mature themes based on user interactions.
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