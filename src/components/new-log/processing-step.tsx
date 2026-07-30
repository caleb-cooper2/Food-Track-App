import {ActivityIndicator, StyleSheet} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';

export function ProcessingStep() {
    const theme = useTheme();

    return (
        <ThemedView style={styles.root}>
            <ActivityIndicator size="large" color={theme.text} />

            <ThemedText style={styles.title}>Processing...</ThemedText>

            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                Please keep the app open during processing, it may take a minute or so.
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.five,
        gap: Spacing.two
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginTop: Spacing.three
    },
    subtitle: {
        textAlign: 'center'
    }
});
