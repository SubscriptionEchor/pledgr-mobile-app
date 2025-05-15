import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Share2, UserPlus, Copy, Twitter, Facebook, Linkedin, Gift } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { SubHeader } from '@/components/SubHeader';

const REFERRAL_CODE = 'PLEDGR123';
const REFERRAL_LINK = 'https://pledgr.com/invite/PLEDGR123';

export default function ReferralScreen() {
    const { colors, fonts, fontSize } = useTheme();
    const [copied, setCopied] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleCopy = (text: string, type: string) => {
        setCopied(type);
        // Clipboard.setStringAsync(text); // Uncomment if using expo-clipboard
        setTimeout(() => setCopied(''), 1200);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <SubHeader title="Refer Friends" />
            <Animated.ScrollView 
                style={[styles.scrollView, { opacity: fadeAnim }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
                    <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                        Get rewards each time a friend signs up using your referral. They'll get rewards too!
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.statNumber, { color: colors.primary, fontFamily: fonts.bold }]}>0</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                                Successful Referrals
                            </Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.statNumber, { color: colors.primary, fontFamily: fonts.bold }]}>0</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                                Referrals Who Became Creators
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                            Your Referral Code
                        </Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                value={REFERRAL_CODE}
                                editable={false}
                                style={[styles.input, { 
                                    color: colors.primary, 
                                    fontFamily: fonts.bold,
                                    backgroundColor: colors.background,
                                    borderColor: colors.border
                                }]}
                            />
                            <TouchableOpacity 
                                style={[styles.copyBtn, { backgroundColor: colors.primary }]} 
                                onPress={() => handleCopy(REFERRAL_CODE, 'code')}
                            >
                                <Copy size={20} color={colors.buttonText} />
                                <Text style={[styles.copyText, { color: colors.buttonText, fontFamily: fonts.bold }]}>
                                    {copied === 'code' ? 'Copied!' : 'Copy'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
                            Share Your Unique Link
                        </Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                value={REFERRAL_LINK}
                                editable={false}
                                style={[styles.input, { 
                                    color: colors.primary, 
                                    fontFamily: fonts.regular,
                                    backgroundColor: colors.background,
                                    borderColor: colors.border
                                }]}
                            />
                            <TouchableOpacity 
                                style={[styles.copyBtn, { backgroundColor: colors.primary }]} 
                                onPress={() => handleCopy(REFERRAL_LINK, 'link')}
                            >
                                <Copy size={20} color={colors.buttonText} />
                                <Text style={[styles.copyText, { color: colors.buttonText, fontFamily: fonts.bold }]}>
                                    {copied === 'link' ? 'Copied!' : 'Copy'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#1DA1F2' }]}>
                                <Twitter size={20} color={'#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#0077b5' }]}>
                                <Linkedin size={20} color={'#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#1877f3' }]}>
                                <Facebook size={20} color={'#fff'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 0,
    },
    content: {
        padding: 16,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 12,
    },
    statNumber: {
        fontSize: 32,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 18,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        padding: 20,
    },
    cardTitle: {
        fontSize: 18,
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    copyText: {
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 16,
    },
    socialBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
}); 