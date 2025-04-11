import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Pencil, ChevronDown, Plus, Check, X } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { showToast } from '@/components/Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TEXT_INPUT_HEIGHT = SCREEN_HEIGHT * 0.35;

export default function AboutScreen() {
  const { colors, fonts, fontSize } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [aboutText, setAboutText] = useState<string | null>(
    "Only I Level Up is a South Korean portal fantasy web novel written by Chugong.\n\nThe story begins when Jin-Woo, known as the \"World's Weakest Hunter,\" nearly dies in a double dungeon incident. He then becomes the only player of a strange program called the System, which allows him to level up in reality, not just in dungeons.\n\nThrough completing quests and defeating increasingly powerful enemies, Jin-Woo grows from being the weakest hunter to one of the strongest in existence. Along the way, he discovers dark secrets about the dungeons, the System, and his own past.\n\nThe series combines elements of LitRPG (Literary Role Playing Game) with traditional Korean fantasy, creating a unique narrative that has captivated readers worldwide. It features detailed power progression, intense battle scenes, and complex world-building."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      if (editText.trim()) {
        setAboutText(editText);
        showToast.success('About updated', 'Your about section has been updated');
      } else {
        setAboutText(null);
        showToast.success('About removed', 'Your about section has been removed');
      }
      setIsEditing(false);
    } else {
      // Start editing
      setEditText(aboutText || '');
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(aboutText || '');
  };

  const handleInputFocus = () => {
    // Scroll to the input when it's focused
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 200,
        animated: true
      });
    }, 100);
  };

  const renderAboutContent = () => {
    if (!aboutText && !isEditing) {
      return (
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Text style={[
            styles.emptyTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
              includeFontPadding: false
            }
          ]}>
            No about information
          </Text>
          <Text style={[
            styles.emptyDescription,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.md,
              includeFontPadding: false,
              marginBottom: 16
            }
          ]}>
            Add information about yourself or your content to help fans get to know you better.
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleEditToggle}
          >
            <Plus size={20} color={colors.buttonText} />
            <Text style={[
              styles.addButtonText,
              {
                color: colors.buttonText,
                fontFamily: fonts.semibold,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              Add About
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isEditing) {
      return (
        <View style={styles.editContainer}>
          <View style={[
            styles.editInputContainer, 
            { 
              backgroundColor: colors.surface,
              height: TEXT_INPUT_HEIGHT
            }
          ]}>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              multiline
              scrollEnabled={true}
              style={[
                styles.editInput,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}
              placeholder="Write about yourself or your content..."
              placeholderTextColor={colors.textSecondary}
              textAlignVertical="top"
              onFocus={handleInputFocus}
            />
          </View>
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.surface }]}
              onPress={handleCancelEdit}
            >
              <X size={20} color={colors.textPrimary} />
              <Text style={[
                styles.cancelButtonText,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleEditToggle}
            >
              <Check size={20} color={colors.buttonText} />
              <Text style={[
                styles.saveButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts.medium,
                  fontSize: fontSize.md,
                  includeFontPadding: false
                }
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Display the about text with show more/less functionality
    const paragraphs = aboutText.split('\n\n');
    const visibleParagraphs = expanded ? paragraphs : paragraphs.slice(0, 2);

    return (
      <View style={styles.aboutContent}>
        {visibleParagraphs.map((paragraph, index) => (
          <Text 
            key={index}
            style={[
              styles.aboutText,
              {
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                fontSize: fontSize.sm,
                includeFontPadding: false,
                lineHeight: 24,
                marginTop: index > 0 ? 16 : 0
              }
            ]}
          >
            {paragraph}
          </Text>
        ))}
        
        {paragraphs.length > 2 && (
          <TouchableOpacity 
            style={styles.showMoreButton}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={[
              styles.showMoreText,
              {
                color: colors.primary,
                fontFamily: fonts.medium,
                fontSize: fontSize.md,
                includeFontPadding: false
              }
            ]}>
              {expanded ? 'Show less' : 'Show more'}
            </Text>
            <ChevronDown 
              size={20} 
              color={colors.primary} 
              style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="About" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <Text style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: fonts.bold,
                fontSize: fontSize.xl,
                includeFontPadding: false
              }
            ]}>
              About
            </Text>
            {aboutText && !isEditing && (
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.surface }]}
                onPress={handleEditToggle}
              >
                <Pencil size={20} color={colors.textPrimary} />
                <Text style={[
                  styles.editButtonText,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.medium,
                    fontSize: fontSize.md,
                    includeFontPadding: false
                  }
                ]}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {renderAboutContent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 20, // Extra padding for iOS keyboard
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
  aboutContent: {
    gap: 8,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  showMoreText: {
    fontSize: 16,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
  },
  editContainer: {
    gap: 16,
  },
  editInputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editInput: {
    height: '100%',
    padding: 16,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
  }
});