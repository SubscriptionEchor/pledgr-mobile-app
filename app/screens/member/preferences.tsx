import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PreferencesScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [profileVisibility, setProfileVisibility] = useState(false);
    const [adultContent, setAdultContent] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [creatorUpdates, setCreatorUpdates] = useState(false);
    const [commentReplies, setCommentReplies] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <SubHeader title="Preferences" />
            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile & Adult Content Group */}
                <View style={styles.card}> 
                    <Text style={[styles.groupTitle, { color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Privacy & Content</Text>
                    {/* Profile visibility */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Profile visibility</Text>
                            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }]}>Control who can see your profile and activity</Text>
                        </View>
                        <Switch
                            value={profileVisibility}
                            onValueChange={setProfileVisibility}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={profileVisibility ? colors.primary : colors.surface}
                        />
                    </View>
                    {/* Adult content */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Adult content</Text>
                            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }]}>Show or hide adult content in your feed</Text>
                        </View>
                        <Switch
                            value={adultContent}
                            onValueChange={setAdultContent}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={adultContent ? colors.primary : colors.surface}
                        />
                    </View>
                </View>
                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                {/* Notification Preferences Group */}
                <View style={styles.card}> 
                    <Text style={[styles.groupTitle, { color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Notification preferences</Text>
                    {/* Members newsletter */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Members newsletter</Text>
                            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }]}>Receive updates and news for members</Text>
                        </View>
                        <Switch
                            value={newsletter}
                            onValueChange={setNewsletter}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={newsletter ? colors.primary : colors.surface}
                        />
                    </View>
                    {/* Special offers */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Special offers</Text>
                            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }]}>Get notified about special deals and offers</Text>
                        </View>
                        <Switch
                            value={specialOffers}
                            onValueChange={setSpecialOffers}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={specialOffers ? colors.primary : colors.surface}
                        />
                    </View>
                    {/* Creator updates */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Creator updates</Text>
                            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }]}>Stay informed about creator news and updates</Text>
                        </View>
                        <Switch
                            value={creatorUpdates}
                            onValueChange={setCreatorUpdates}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={creatorUpdates ? colors.primary : colors.surface}
                        />
                    </View>
                    {/* Comment replies */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.semibold, fontSize: fontSize.md }]}>Comment replies</Text>
                            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }]}>Get alerts when someone replies to your comments</Text>
                        </View>
                        <Switch
                            value={commentReplies}
                            onValueChange={setCommentReplies}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={commentReplies ? colors.primary : colors.surface}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        gap: 24,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    labelContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 12,
    },
    title: {
        // fontWeight handled by fontFamily
    },
    description: {
        marginTop: 2,
    },
    groupTitle: {
        marginBottom: 8,
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 4,
    },
}); 