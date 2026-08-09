import {router, useLocalSearchParams} from 'expo-router';
import {ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View} from 'react-native';
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
import {submitLogEstimate} from '@/services/logSubmission';

function failureMessage(kind: Log['failureKind']): string {
    switch (kind) {
        case 'timeout': return "This took too long to process.";
        case 'network': return "We couldn't reach the server, check your Wifi or cellular connection.";
        case 'server': return "Something went wrong processing this log.";
        case 'config': return "Your account setup needs a quick check before this can process.";
        default: return "This log failed to process.";
    }
}

export default function LogDetailScreen() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const {logs, removeLog, updateLog} = useLogs();

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

    const handleDelete = () => {
        Alert.alert('Delete log', 'This can\'t be undone.', [
            {text: 'Cancel', style: 'cancel'},
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    removeLog(log.id);
                    router.back();
                }
            }
        ]);
    };

    const handleRetry = () => {
        if (log.imageUri === null) return;
        updateLog(log.id, {status: 'processing'});
        submitLogEstimate(log.id, log.imageUri, log.description, updateLog);
    };

    return (
        <ThemedView style={[styles.root, {paddingTop: insets.top + Spacing.three}]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={12}>
                    <ThemedText themeColor="textSecondary">Back</ThemedText>
                </Pressable>

                <ThemedText type="smallBold">Log</ThemedText>

                <Pressable onPress={() => router.push(`/edit-log/${log.id}`)} hitSlop={12}>
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
                    <ThemedText type="small" themeColor="textSecondary">
                        {formatLogTimestamp(new Date(log.createdAt))}
                        {log.total_mass_g != null && ` • ≈ ${Math.round(log.total_mass_g)} g estimated`}
                    </ThemedText>
                </View>

                {log.confidence == "low" && (
                    <ThemedText type="small" style={styles.warningNote}>
                        {`Low confidence - the photo angle made the portion size difficult to estimate`}
                    </ThemedText>
                )}

                {log.status === 'processing' ? (
                    <View style={styles.noMatch}>
                        <ActivityIndicator />
                        <ThemedText themeColor="textSecondary" style={styles.noMatchText}>
                            Currently working out the nutrition for this log, please wait...
                        </ThemedText>
                    </View>
                ) : log.status === 'failed' ? (
                    <View style={styles.noMatch}>
                        <ThemedText themeColor="textSecondary" style={styles.noMatchText}>
                            {failureMessage(log.failureKind)}
                        </ThemedText>
                        <View style={styles.actionButtons}>
                            <Pressable 
                                onPress={handleRetry} 
                                style={[styles.actionButton, {backgroundColor: theme.backgroundElement}]}
                                hitSlop={12}
                            >
                                <ThemedText style={styles.actionButtonLabel}>Retry</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                ) : nutrients ? ( // Food nutrients found!
                    <View style={styles.nutrients}>
                        {NUTRIENT_DISPLAY_ORDER
                            .filter(({key}) => nutrients[key] != null)
                            .map(({key, label, unit, referenceValue}) => (
                                <NutrientBar key={key} label={label} unit={unit} value={nutrients[key]!} referenceValue={referenceValue} />
                            ))}
                    </View>
                ) : ( // No food matches at all, but pipeline still ran fine
                    <View style={styles.noMatch}>
                        <ThemedText themeColor="textSecondary" style={styles.noMatchText}>
                            We couldn't identify the foods from your description.
                        </ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.noMatchText}>
                            <ThemedText type="default" style={styles.noMatchLink} onPress={() => router.push(`/edit-log/${log.id}`)}>
                                Edit log
                            </ThemedText>
                            {' and try a different wording.'}
                        </ThemedText>
                    </View>
                )}

                {log.status === 'success' && nutrients && log.items != null && log.items_with_nutrients != null && log.items.length !== log.items_with_nutrients && (
                    <ThemedText type="small" style={styles.warningNote}>
                        {`Only counted ${log.items_with_nutrients} of ${log.items.length} foods - totals may be incorrect`}
                    </ThemedText>
                )}

                {log.items != null && log.items.length > 0 && (
                    <View style={styles.itemsBlock}>
                        <ThemedText themeColor="textSecondary" type="small" style={styles.label}>
                            RECOGNISED FOODS
                        </ThemedText>

                        {log.items.map((item, index) => (
                            <View key={index} style={styles.item}>
                                <ThemedText>{item.prompt}</ThemedText>
                                <ThemedText type="small" themeColor="textSecondary">
                                    {item.matched_food != null
                                        ? `${item.matched_food}${item.mass_g != null ? ` • ~ ${Math.round(item.mass_g)} g` : ''}`
                                        : 'no match'}
                                </ThemedText>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <Pressable onPress={handleDelete} style={[styles.deleteButton, {backgroundColor: theme.backgroundElement}]} hitSlop={12}>
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
    warningNote: {
        color: '#9A7A4A'
    },
    description: {
        fontWeight: '700'
    },
    nutrients: {
        gap: Spacing.three
    },
    label: {
        letterSpacing: 0.5,
        marginBottom: -Spacing.two
    },
    itemsBlock: {
        gap: Spacing.three
    },
    noMatch: {
        alignItems: 'center',
        gap: Spacing.three,
        paddingVertical: Spacing.five
    },
    noMatchText: {
        textAlign: 'center'
    },
    noMatchLink: {
        fontWeight: '700',
        textDecorationLine: 'underline'
    },
    item: {
        gap: Spacing.half
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
    },
    actionButtons: {
        gap: Spacing.two,
        alignItems: 'center'
    },
    actionButton: {
        borderRadius: 8,
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.three,
        alignItems: 'center'
    },
    actionButtonLabel: {
        fontSize: 15,
        fontWeight: '600'
    },
    actionButtonLink: {
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline'
    }
});
