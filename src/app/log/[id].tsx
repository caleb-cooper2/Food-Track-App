import {router, useLocalSearchParams} from 'expo-router';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {LogPhoto} from '@/components/log-detail/log-photo';
import {NutrientBar} from '@/components/log-detail/nutrient-bar';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {NUTRIENT_DISPLAY_ORDER} from '@/constants/daily-intake';
import {Spacing} from '@/constants/theme';
import {useLogs} from '@/hooks/use-logs';
import {useTheme} from '@/hooks/use-theme';
import {formatLogTimestamp} from '@/utils/format-log-date';

export default function LogDetailScreen() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const {logs} = useLogs();

    const log = logs.find((entry) => entry.id === id);

    if (!log) {
        return (
            <ThemedView style={[styles.root, styles.notFound, {paddingTop: insets.top + Spacing.three}]}>
                <ThemedText themeColor="textSecondary">Log not found</ThemedText>
                <Pressable onPress={() => router.back()} hitSlop={12}>
                    <ThemedText type="smallBold">Back</ThemedText>
                </Pressable>
            </ThemedView>
        );
    }

    const nutrients = log.nutrients;

    return (
        <ThemedView style={[styles.root, {paddingTop: insets.top + Spacing.three}]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={12}>
                    <ThemedText themeColor="textSecondary">Back</ThemedText>
                </Pressable>

                <ThemedText type="smallBold">Log</ThemedText>

                <Pressable hitSlop={12}>
                    <ThemedText type="smallBold">Edit</ThemedText>
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + Spacing.four}]}
                showsVerticalScrollIndicator={false}
            >
                <LogPhoto log={log} />

                <View style={styles.descriptionBlock}>
                    <ThemedText type="default" style={styles.description}>{log.description}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{formatLogTimestamp(new Date(log.createdAt))}</ThemedText>
                </View>

                {log.status === 'success' && nutrients ? (
                    <View style={styles.nutrients}>
                        {NUTRIENT_DISPLAY_ORDER
                            .filter(({key}) => nutrients[key] != null)
                            .map(({key, label, unit, referenceValue}) => (
                                <NutrientBar key={key} label={label} unit={unit} value={nutrients[key]!} referenceValue={referenceValue} />
                            ))}
                    </View>
                ) : (
                    <ThemedText type="small" themeColor="textSecondary">
                        This log failed to process, so no nutrition estimate is available.
                    </ThemedText>
                )}
            </ScrollView>

            <Pressable style={[styles.deleteButton, {backgroundColor: theme.backgroundElement}]} hitSlop={12}>
                <ThemedText style={styles.deleteLabel}>Delete log</ThemedText>
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: Spacing.four
    },
    notFound: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.three
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.four
    },
    content: {
        gap: Spacing.four
    },
    descriptionBlock: {
        gap: Spacing.one
    },
    description: {
        fontWeight: '700'
    },
    nutrients: {
        gap: Spacing.three
    },
    deleteButton: {
        borderRadius: 16,
        paddingVertical: Spacing.three,
        alignItems: 'center',
        marginBottom: Spacing.three
    },
    deleteLabel: {
        color: '#C13333',
        fontSize: 17,
        fontWeight: '700'
    }
});
