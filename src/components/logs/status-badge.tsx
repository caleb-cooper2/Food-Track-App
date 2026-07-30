import {StyleSheet, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';

type StatusBadgeProps = {
    log: Log;
};

const STYLES = {
    light: {
        success: { background: '#DCF5E3', text: '#1F8A4C' },
        failed: { background: '#FBDCDC', text: '#C13333' }
    },
    dark: {
        success: { background: '#173425', text: '#4ADE80' },
        failed: { background: '#3A1A1A', text: '#F87171' }
    }
} as const;

export function StatusBadge({ log }: StatusBadgeProps) {
    const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
    const { background, text } = STYLES[scheme][log.status];
    const label = log.status === 'success' ? `${log.kcal} kcal` : 'Failed';

    return (
        <View style={[styles.badge, { backgroundColor: background }]}>
            <ThemedText type="small" style={[styles.label, { color: text }]}>
                {label}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: 999,
        paddingVertical: Spacing.half,
        paddingHorizontal: Spacing.two,
        alignSelf: 'flex-start'
    },
    label: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '700'
    }
});
