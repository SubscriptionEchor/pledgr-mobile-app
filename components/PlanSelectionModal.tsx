import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X } from 'lucide-react-native';
import { Button } from './Button';
import { showToast } from './Toast';

interface PlanSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PlanSelectionModal({ visible, onClose }: PlanSelectionModalProps) {
  const { colors, fonts, fontSize } = useTheme();

  const handleSwitchPlan = () => {
    showToast.success(
      'Plan upgraded successfully',
      'You are now on the Pro plan'
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
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: fontSize['2xl'],
                includeFontPadding: false
              }
            ]}>
              Choose your plan
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={[
              styles.planCard,
              styles.currentPlan,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
              }
            ]}>
              <View style={styles.planHeader}>
                <Text style={[
                  styles.planName,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.xl,
                    includeFontPadding: false
                  }
                ]}>
                  Basic Plan
                </Text>
                <Text style={[
                  styles.currentPlanLabel,
                  {
                    color: colors.primary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Current plan
                </Text>
              </View>

              <View style={styles.feeContainer}>
                <Text style={[
                  styles.feeAmount,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.bold,
                    fontSize: fontSize['3xl'],
                    includeFontPadding: false,
                    marginRight: 5
                  }
                ]}>
                  15%
                </Text>
                <Text style={[
                  styles.feeLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.lg,
                    includeFontPadding: false
                  }
                ]}>
                  platform fee
                </Text>
              </View>

              {/* <Text style={[
                styles.currentPlanText,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Current plan
              </Text> */}
            </View>

            <View style={[styles.planCard, { backgroundColor: colors.surface }]}>
              <View style={styles.planHeader}>
                <Text style={[
                  styles.planName,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.xl,
                    includeFontPadding: false
                  }
                ]}>
                  Pro Plan
                </Text>
              </View>

              <View style={styles.feeContainer}>
                <Text style={[
                  styles.feeAmount,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.bold,
                    fontSize: fontSize['3xl'],
                    includeFontPadding: false,
                    marginRight: 5
                  }
                ]}>
                  8%
                </Text>
                <Text style={[
                  styles.feeLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.lg,
                    includeFontPadding: false
                  }
                ]}>
                  platform fee
                </Text>
              </View>

              <Button
                label="Switch to Pro Plan"
                onPress={handleSwitchPlan}
                variant="primary"
              />
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  content: {
    gap: 16,
  },
  planCard: {
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  currentPlan: {
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planName: {
    letterSpacing: -0.5,
  },
  currentPlanLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  feeAmount: {
    letterSpacing: -1,
  },
  feeLabel: {
    letterSpacing: -0.5,
  },
  currentPlanText: {
    textAlign: 'center',
  },
});