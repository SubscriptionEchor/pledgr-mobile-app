import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';
import { Lightbulb, Sparkles, Zap } from 'lucide-react-native';

export default function FeatureRequestScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      showToast.error(
        'Missing information',
        'Please fill in all fields'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast.success(
        'Request submitted',
        'Thank you for your feedback!'
      );
      
      // Reset form
      setTitle('');
      setDescription('');
    } catch (error) {
      showToast.error(
        'Submission failed',
        'Please try again later'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Feature Request" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Lightbulb size={32} color={colors.primary} />
          <Text style={[
            styles.title, 
            { 
              color: colors.textPrimary,
              fontFamily: fonts.bold,
              fontSize: fontSize['2xl'],
            }
          ]}>
            Share Your Ideas
          </Text>
          <Text style={[
            styles.subtitle, 
            { 
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
            }
          ]}>
            Help us improve by suggesting new features or improvements
          </Text>
        </View>

        <View style={styles.features}>
          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Sparkles size={24} color={colors.primary} />
            </View>
            <Text style={[
              styles.featureTitle, 
              { 
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
              }
            ]}>
              Innovation Welcome
            </Text>
            <Text style={[
              styles.featureDescription, 
              { 
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
              }
            ]}>
              We value fresh ideas that can make the platform better for everyone
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Zap size={24} color={colors.primary} />
            </View>
            <Text style={[
              styles.featureTitle, 
              { 
                color: colors.textPrimary,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
              }
            ]}>
              Quick Implementation
            </Text>
            <Text style={[
              styles.featureDescription, 
              { 
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
              }
            ]}>
              Popular requests may be implemented in upcoming updates
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[
              styles.label, 
              { 
                color: colors.textSecondary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
              }
            ]}>
              Feature Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a short, descriptive title"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surface, 
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.md,
                }
              ]}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[
              styles.label, 
              { 
                color: colors.textSecondary,
                fontFamily: fonts.medium,
                fontSize: fontSize.sm,
              }
            ]}>
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the feature and how it would help"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.textArea,
                { 
                  backgroundColor: colors.surface, 
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.md,
                }
              ]}
              editable={!isSubmitting}
            />
          </View>

          <Button
            label={isSubmitting ? "Submitting..." : "Submit Request"}
            onPress={handleSubmit}
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  features: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
});