import {router} from 'expo-router';
import {Pressable, StyleSheet, View} from 'react-native';

import {LogIcon} from '@/components/logs/log-icon';
import {StatusBadge} from '@/components/logs/status-badge';
import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';
import {formatTime12h} from '@/utils/format-log-date';

type LogRowProps = {
    log: Log;
};

export function LogRow({ log }: LogRowProps) {
    return (
        <Pressable
            onPress={() => router.push(`/log/${log.id}`)}
            style={({pressed}) => [styles.root, pressed && styles.pressed]}
        >
            <LogIcon description={log.description} />

            <View style={styles.details}>
                <ThemedText type="default" numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
                    {log.description}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                    {formatTime12h(new Date(log.createdAt))}
                </ThemedText>
            </View>

            <StatusBadge log={log} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.three,
        paddingVertical: Spacing.three
    },
    pressed: {
        opacity: 0.6
    },
    details: {
        flex: 1,
        gap: Spacing.half
    },
    description: {
        fontWeight: '700'
    }
});
