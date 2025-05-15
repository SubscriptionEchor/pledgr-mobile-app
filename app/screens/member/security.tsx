import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { SubHeader } from '@/components/SubHeader';

export default function SecurityScreen() {
    const { colors } = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <SubHeader title="Security" />
        </SafeAreaView>
    );
} 