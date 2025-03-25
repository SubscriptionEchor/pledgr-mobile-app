import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, HardDrive, CreditCard } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';

interface StorageUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function StorageUpgradeModal({ visible, onClose }: StorageUpgradeModalProps) {
  const { colors, fonts, fontSize } = useTheme();

  const handleUpgrade = () => {
    showToast.success(
      'Storage upgraded',
      'Your storage has been upgraded to 100GB'
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <HardDrive size={24} color={colors.primary} />
              <View>
                <Text style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.bold,
                    fontSize: fontSize.xl,
                  }
                ]}>
                  Upgrade Storage
                </Text>
                <Text style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.md,
                  }
                ]}>
                  Get more space for your content
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.planCard, { backgroundColor: colors.surface }]}>
            <View style={styles.planInfo}>
              <Text style={[
                styles.storageAmount,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.bold,
                  fontSize: fontSize['2xl'],
                }
              ]}>
                100GB Extra Storage
              </Text>
              <Text style={[
                styles.subscriptionType,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.lg,
                }
              ]}>
                Monthly subscription
              </Text>
            </View>

            <View style={styles.priceSection}>
              <Text style={[
                styles.price,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.bold,
                  fontSize: fontSize['3xl'],
                }
              ]}>
                $15
              </Text>
              <Text style={[
                styles.period,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.lg,
                }
              ]}>
                per month
              </Text>
            </View>

            <View style={[styles.feature, { backgroundColor: `${colors.success}15` }]}>
              <View style={[styles.featureIcon, { backgroundColor: colors.success }]}>
                <CreditCard size={16} color={colors.buttonText} />
              </View>
              <Text style={[
                styles.featureText,
                {
                  color: colors.success,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.sm,
                }
              ]}>
                Upgrade instantly
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              label="Upgrade Now"
              onPress={handleUpgrade}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 12,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 22,
  },
  planCard: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  planInfo: {
    marginBottom: 8,
  },
  storageAmount: {
    marginBottom: 4,
  },
  subscriptionType: {
    lineHeight: 24,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  price: {
    letterSpacing: -1,
  },
  period: {
    letterSpacing: -0.5,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});