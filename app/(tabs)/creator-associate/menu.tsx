import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';

export default function MenuScreen() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.headerContainer}>
                <Header />
            </View>
            <View style={styles.content}>
                <Text style={[
                    styles.title,
                    {
                        color: colors.textPrimary,
                        fontFamily: fonts.bold,
                        fontSize: fontSize['2xl'],
                    }
                ]}>
                    Menu
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    headerContainer: {
        zIndex: 1000, // Ensure header is above other elements
        elevation: 1000, // For Android
        position: 'relative',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 1, // Lower z-index than header
    },
    title: {
        marginBottom: 20,
    },
});