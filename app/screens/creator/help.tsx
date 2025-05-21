import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { Mail, MessageCircle, FileText, HelpCircle } from 'lucide-react-native';

const HELP_ITEMS = [
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions',
    icon: HelpCircle,
  },
  {
    id: 'contact',
    title: 'Contact Support',
    description: 'Get in touch with our support team',
    icon: Mail,
  },
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Chat with a support representative',
    icon: MessageCircle,
  },
  {
    id: 'documentation',
    title: 'Creator Documentation',
    description: 'Learn how to make the most of your creator page',
    icon: FileText,
  },
];

export default function HelpScreen() {
  const { colors, fonts, fontSize } = useTheme();

  const handleItemPress = (id: string) => {
    // Handle navigation to specific help sections
    console.log(`Navigate to ${id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SubHeader title="Help & Support" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.medium }]}>
          How can we help you?
        </Text>
        
        <View style={styles.helpItems}>
          {HELP_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.helpItem, { backgroundColor: colors.surface }]}
              onPress={() => handleItemPress(item.id)}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: `${colors.primary}15` }
              ]}>
                <item.icon size={24} color={colors.primary} />
              </View>
              <View style={styles.itemContent}>
                <Text style={[
                  styles.itemTitle,
                  { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.md }
                ]}>
                  {item.title}
                </Text>
                <Text style={[
                  styles.itemDescription,
                  { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }
                ]}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  helpItems: {
    gap: 16,
  },
  helpItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
  },
}); 