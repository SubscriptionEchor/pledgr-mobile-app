import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function DownloadsScreen() {
    const { colors, fonts, fontSize } = useTheme();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.bold, fontSize: fontSize['2xl'], marginTop: 8, marginLeft: 16, marginBottom: 16 }}>My Downloads</Text>
            <View style={styles.content}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md }}>
                    You have no downloads yet.
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