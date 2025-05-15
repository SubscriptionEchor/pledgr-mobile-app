import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function PlaceholderScreen() {
    const { colors, fonts, fontSize } = useTheme();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <View style={styles.content}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize['2xl'], marginBottom: 16 }}>Coming Soon</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md, textAlign: 'center' }}>
                    This page is under construction and will be available soon.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
}); 