import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';

export default function LibraryScreen() {
    const { colors, fonts, fontSize } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header />
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
                    Library
                </Text>
                {/* Empty state */}
                <View style={{ alignItems: 'center', marginTop: 32 }}>
                    <Text style={{
                        color: colors.textSecondary,
                        fontFamily: fonts.semibold,
                        fontSize: fontSize.xl,
                        marginBottom: 8,
                    }}>
                        No collection yet
                    </Text>
                    <Text style={{
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.md,
                        textAlign: 'center',
                        maxWidth: 260,
                    }}>
                        Create your first collection to organize your content
                    </Text>
                </View>
            </View>
        </View>
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
    title: {
        marginBottom: 20,
    },
});