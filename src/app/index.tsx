import Feather from '@expo/vector-icons/Feather';
import {router} from 'expo-router';
import {Pressable, SectionList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {LogRow} from '@/components/logs/log-row';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Spacing} from '@/constants/theme';
import {useLogs} from '@/hooks/use-logs';
import {useTheme} from '@/hooks/use-theme';
import {groupLogsByDay} from '@/utils/format-log-date';

export default function HomeScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const {logs} = useLogs();

    const sortedLogs = [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const sections = groupLogsByDay(sortedLogs).map((group) => ({title: group.label, data: group.logs}));

    return (
        <ThemedView style={[styles.root, {paddingTop: insets.top + Spacing.three}]}>
            <ThemedText type="subtitle">Logs</ThemedText>

            {sections.length === 0 ? (
                <>
                    <View style={[styles.emptyState, {borderColor: theme.backgroundSelected}]}>
                        <ThemedText themeColor="textSecondary">No logs yet</ThemedText>
                    </View>

                    <ThemedText themeColor="textSecondary" style={styles.emptyHint}>
                        Log your first meal to see volume and nutrition estimates here.
                    </ThemedText>
                </>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(log: Log) => log.id}
                    renderItem={({item}) => <LogRow log={item} />}
                    renderSectionHeader={({section: {title}}) => (
                        <ThemedText type="small" themeColor="textSecondary" style={styles.sectionHeader}>
                            {title}
                        </ThemedText>
                    )}
                    ItemSeparatorComponent={() => <View style={[styles.separator, {backgroundColor: theme.backgroundSelected}]} />}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: insets.bottom + Spacing.six}}
                />
            )}

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
    sectionHeader: {
        letterSpacing: 0.5,
        fontWeight: '700',
        paddingTop: Spacing.three,
        paddingBottom: Spacing.one
    },
    separator: {
        height: StyleSheet.hairlineWidth
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