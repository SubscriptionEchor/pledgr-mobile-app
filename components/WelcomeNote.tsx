import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Palette,
  RotateCcw,
  RotateCw
} from 'lucide-react-native';

interface WelcomeNoteProps {
  onSave?: (note: string) => void;
}

export function WelcomeNote({ onSave }: WelcomeNoteProps) {
  const { colors, fonts, fontSize } = useTheme();
  const [welcomeType, setWelcomeType] = useState<'same' | 'custom'>('same');
  const [welcomeNote, setWelcomeNote] = useState('Welcome to my page! Thank you for your support.');

  const toolbarButtons = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Underline, label: 'Underline' },
    { type: 'divider' },
    { icon: AlignLeft, label: 'Align Left' },
    { icon: AlignCenter, label: 'Align Center' },
    { icon: AlignRight, label: 'Align Right' },
    { icon: AlignJustify, label: 'Justify' },
    { type: 'divider' },
    { icon: Heading1, label: 'Heading 1' },
    { icon: Heading2, label: 'Heading 2' },
    { type: 'divider' },
    { icon: List, label: 'Bullet List' },
    { icon: ListOrdered, label: 'Numbered List' },
    { type: 'divider' },
    { icon: Quote, label: 'Quote' },
    { icon: Code, label: 'Code' },
    { icon: Link, label: 'Link' },
    { icon: Image, label: 'Image' },
    { icon: Palette, label: 'Text Color' },
    { type: 'divider' },
    { icon: RotateCcw, label: 'Undo' },
    { icon: RotateCw, label: 'Redo' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontFamily: fonts.bold,
            fontSize: fontSize['2xl'],
            includeFontPadding: false
          }
        ]}>
          How do you want to welcome your members?
        </Text>

        <Text style={[
          styles.subtitle,
          {
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
            includeFontPadding: false
          }
        ]}>
          Customize the welcome message your members will receive when they join your page.
        </Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              {
                backgroundColor: colors.surface,
                borderColor: welcomeType === 'same' ? colors.primary : 'transparent',
                borderWidth: welcomeType === 'same' ? 2 : 0,
              }
            ]}
            onPress={() => setWelcomeType('same')}>
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter,
                { borderColor: colors.primary }
              ]}>
                {welcomeType === 'same' && (
                  <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  Use the same welcome note for each tier
                </Text>
                <Text style={[
                  styles.optionDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  All members will receive the same welcome message when they join
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              {
                backgroundColor: colors.surface,
                borderColor: welcomeType === 'custom' ? colors.primary : 'transparent',
                borderWidth: welcomeType === 'custom' ? 2 : 0,
              }
            ]}
            onPress={() => setWelcomeType('custom')}>
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter,
                { borderColor: colors.primary }
              ]}>
                {welcomeType === 'custom' && (
                  <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.semibold,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  Customize welcome notes for each tier
                </Text>
                <Text style={[
                  styles.optionDescription,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts.regular,
                    fontSize: fontSize.sm,
                    includeFontPadding: false
                  }
                ]}>
                  Create unique welcome messages for different membership tiers
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.editorCard, { backgroundColor: colors.surface }]}>
          <Text style={[
            styles.editorTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
              includeFontPadding: false
            }
          ]}>
            Welcome Note
          </Text>

          <View style={[styles.toolbar, { backgroundColor: colors.background }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toolbarContent}
            >
              {toolbarButtons.map((button, index) =>
                button.type === 'divider' ? (
                  <View
                    key={`divider-${index}`}
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                ) : (
                  <TouchableOpacity
                    key={button.label}
                    style={[styles.toolbarButton, { backgroundColor: colors.surface }]}>
                    <button.icon size={18} color={colors.textPrimary} />
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>

          <TextInput
            value={welcomeNote}
            onChangeText={setWelcomeNote}
            multiline
            style={[
              styles.editor,
              {
                backgroundColor: colors.background,
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}
            placeholder="Write your welcome message..."
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[
            styles.hint,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            This message will be sent to all members when they join your page
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  options: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    marginBottom: 4,
  },
  optionDescription: {
    lineHeight: 20,
  },
  editorCard: {
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  editorTitle: {
    marginBottom: 8,
  },
  toolbar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarContent: {
    paddingHorizontal: 8,
    gap: 4,
  },
  toolbarButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 4,
  },
  editor: {
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  hint: {
    textAlign: 'center',
  },
});