import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CheckCircle, Info, Gift, ChevronRight, FileText } from 'lucide-react-native';

interface CreatorStepsProps {
  stepCompleted: boolean[];
  onStepComplete: (idx: number) => void;
}

export function CreatorSteps({ stepCompleted, onStepComplete }: CreatorStepsProps) {
  const { colors, fonts, fontSize } = useTheme();

  const steps = [
    {
      id: 0,
      title: 'Complete your profile',
      description: 'Add a bio, profile picture, and cover image to personalize your page.',
      icon: FileText,
      buttonText: 'Edit',
    },
    {
      id: 1,
      title: 'Set up memberships',
      description: 'Create membership tiers to offer exclusive content and perks.',
      icon: Gift,
      buttonText: 'Create',
    },
    {
      id: 2,
      title: 'Publish your page',
      description: 'Make your page public and start sharing content with your audience.',
      icon: Info,
      buttonText: 'Publish',
    },
    {
      id: 3,
      title: 'Share your first post',
      description: 'Create and share your first piece of content with your audience.',
      icon: CheckCircle,
      buttonText: 'Share',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize.xl }]}>
        Get started with your creator page
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md }]}>
        Complete these steps to set up your page and start sharing content.
      </Text>

      <View style={styles.steps}>
        {steps.map((step, idx) => {
          const isCompleted = stepCompleted[idx];
          const Icon = step.icon;

          if (isCompleted) {
            return (
              <View
                key={step.id}
                style={[
                  styles.stepCard,
                  styles.completedCard,
                  {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <View style={styles.stepHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: `${colors.primary}15`,
                      },
                    ]}
                  >
                    <Icon size={20} color={colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.stepTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                        flex: 1,
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <View
                    style={[
                      styles.completedBadge,
                      {
                        backgroundColor: `${colors.primary}15`,
                      },
                    ]}
                  >
                    <CheckCircle size={16} color={colors.primary} />
                    <Text
                      style={[
                        styles.completedText,
                        {
                          color: colors.primary,
                          fontFamily: fonts.medium,
                          fontSize: fontSize.sm,
                        },
                      ]}
                    >
                      Completed
                    </Text>
                  </View>
                </View>
              </View>
            );
          }

          return (
            <View
              key={step.id}
              style={[
                styles.stepCard,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <View style={styles.stepHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <Icon size={20} color={colors.textSecondary} />
                </View>
                <View style={styles.stepInfo}>
                  <Text
                    style={[
                      styles.stepTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.md,
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                      },
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => onStepComplete(idx)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.completeButtonText,
                      {
                        color: colors.buttonText,
                        fontFamily: fonts.medium,
                        fontSize: fontSize.sm,
                      },
                    ]}
                  >
                    {step.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
    lineHeight: 24,
  },
  steps: {
    gap: 12,
  },
  stepCard: {
    borderRadius: 12,
    padding: 16,
  },
  completedCard: {
    paddingVertical: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    marginBottom: 2,
  },
  stepDescription: {
    lineHeight: 20,
  },
  completeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  completeButtonText: {
    textAlign: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  completedText: {
    textAlign: 'center',
  },
}); 