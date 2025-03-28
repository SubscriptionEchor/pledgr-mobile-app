import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Globe, Users, Lock, TriangleAlert as AlertTriangle, Store, Eye } from 'lucide-react-native';
import { useState } from 'react';
import { ProfileVisibility } from '@/lib/enums';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/enums';

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
  const { colors, fonts, fontSize } = useTheme();
  const [isPublic, setIsPublic] = useState(selectedVisibility === ProfileVisibility.PUBLIC);
  const { user } = useAuth();

  const isCreator = user?.role === UserRole.CREATOR;

  const handleToggle = (value: boolean) => {
    setIsPublic(value);
    onSelect(value ? ProfileVisibility.PUBLIC : ProfileVisibility.PRIVATE);
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[
            styles.title, 
            { 
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.xl,
            }
          ]}>
            Profile Visibility
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.warningBox, { backgroundColor: '#FFF9F0' }]}>
            <AlertTriangle size={24} color="#F59E0B" />
            <Text style={[
              styles.warningText, 
              { 
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
              }
            ]}>
              Choose who can see your {isCreator ? 'shop and ' : ''}profile content. You can change this at any time.
            </Text>
          </View>

          {isCreator ? (
            <>
              <View style={[styles.toggleContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.toggleContent}>
                  <Text style={[
                    styles.toggleTitle, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.lg,
                    }
                  ]}>
                    Shop Visibility
                  </Text>
                  <Text style={[
                    styles.toggleDescription, 
                    { 
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                    }
                  ]}>
                    Make your shop and products visible to the public
                  </Text>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={handleToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isPublic ? colors.primary : colors.surface}
                />
              </View>

              <View style={[styles.infoBox, { backgroundColor: isPublic ? `${colors.success}15` : `${colors.warning}15` }]}>
                <View style={[styles.infoIcon, { backgroundColor: isPublic ? colors.success : colors.warning }]}>
                  {isPublic ? (
                    <Store size={20} color={colors.buttonText} />
                  ) : (
                    <Lock size={20} color={colors.buttonText} />
                  )}
                </View>
                <Text style={[
                  styles.infoText,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                  }
                ]}>
                  {isPublic ? (
                    'Your shop is visible to everyone'
                  ) : (
                    'Your shop is hidden from the public'
                  )}
                </Text>
              </View>

              {!isPublic && (
                <View style={styles.restrictions}>
                  <Text style={[
                    styles.restrictionsTitle,
                    {
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.md,
                    }
                  ]}>
                    When visibility is off:
                  </Text>
                  <View style={styles.restrictionsList}>
                    <Text style={[
                      styles.restrictionItem,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                      }
                    ]}>
                      • Products will no longer be visible to the public but customers who have already purchased products will still have access to them
                    </Text>
                    <Text style={[
                      styles.restrictionItem,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                      }
                    ]}>
                      • Posts and collections will remain visible on your page but no longer appear in the shop tab
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <>
              <View style={[styles.toggleContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.toggleContent}>
                  <Text style={[
                    styles.toggleTitle, 
                    { 
                      color: colors.textPrimary,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.lg,
                    }
                  ]}>
                    Public Profile
                  </Text>
                  <Text style={[
                    styles.toggleDescription, 
                    { 
                      color: colors.textSecondary,
                      fontFamily: fonts.regular,
                      fontSize: fontSize.md,
                    }
                  ]}>
                    Allow anyone to view your profile and content
                  </Text>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={handleToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isPublic ? colors.primary : colors.surface}
                />
              </View>

              <Text style={[
                styles.sectionTitle, 
                { 
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.lg,
                  marginTop: 24,
                }
              ]}>
                What this means:
              </Text>

              <View style={styles.infoCards}>
                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E8F3FF' }]}>
                    <Globe size={24} color="#0EA5E9" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[
                      styles.infoTitle, 
                      { 
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                      }
                    ]}>
                      Public Profile
                    </Text>
                    <Text style={[
                      styles.infoDescription, 
                      { 
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                      }
                    ]}>
                      Your profile, posts, and activity are visible to everyone
                    </Text>
                  </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E8F3FF' }]}>
                    <Users size={24} color="#0EA5E9" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[
                      styles.infoTitle, 
                      { 
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                      }
                    ]}>
                      Engagement
                    </Text>
                    <Text style={[
                      styles.infoDescription, 
                      { 
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                      }
                    ]}>
                      Anyone can follow you and interact with your content
                    </Text>
                  </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E8F3FF' }]}>
                    <Lock size={24} color="#0EA5E9" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[
                      styles.infoTitle, 
                      { 
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                      }
                    ]}>
                      Privacy Control
                    </Text>
                    <Text style={[
                      styles.infoDescription, 
                      { 
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                      }
                    ]}>
                      You can still block specific users and control who can message you
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  warningText: {
    flex: 1,
    lineHeight: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  toggleContent: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    marginBottom: 4,
  },
  toggleDescription: {
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
  restrictions: {
    marginTop: 8,
    gap: 12,
  },
  restrictionsTitle: {
    marginBottom: 4,
  },
  restrictionsList: {
    gap: 8,
  },
  restrictionItem: {
    lineHeight: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    marginBottom: 4,
  },
  infoDescription: {
    lineHeight: 22,
  },
});