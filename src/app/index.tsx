import Feather from '@expo/vector-icons/Feather';
import {router} from 'expo-router';
import {Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';

export default function HomeScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <ThemedView style={[styles.root, {paddingTop: insets.top + Spacing.three}]}>
            <ThemedText type="subtitle">Logs</ThemedText>

            <View style={[styles.emptyState, {borderColor: theme.backgroundSelected}]}>
                <ThemedText themeColor="textSecondary">No logs yet</ThemedText>
            </View>

            <ThemedText themeColor="textSecondary" style={styles.emptyHint}>
                Log your first meal to see volume and nutrition estimates here.
            </ThemedText>

            <Pressable
                onPress={() => router.push('/new-log')}
                style={({pressed}) => [styles.fab, {backgroundColor: theme.text}, pressed && styles.fabPressed]}
                hitSlop={12}
            >
                <Feather name="plus" size={28} color={theme.background} />
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: Spacing.four,
        gap: Spacing.four
    },
    emptyState: {
        borderWidth: 1,
        borderRadius: 16,
        minHeight: 140,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyHint: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20
    },
    fab: {
        position: 'absolute',
        right: Spacing.four,
        bottom: Spacing.five,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fabPressed: {
        opacity: 0.85
    }
});