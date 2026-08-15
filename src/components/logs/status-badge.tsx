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
        failed: { background: '#FBDCDC', text: '#C13333' },
        processing: { background: '#FFF3D6', text: '#A07A00' },
        pending: { background: '#E5E5E5', text: '#6B7280' }
    },
    dark: {
        success: { background: '#173425', text: '#4ADE80' },
        failed: { background: '#3A1A1A', text: '#F87171' },
        processing: { background: '#3A2A00', text: '#FBBF24' },
        pending: { background: '#4B5563', text: '#9CA3AF' }
    }
} as const;

export function StatusBadge({ log }: StatusBadgeProps) {
    const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
    const { background, text } = STYLES[scheme][log.status];
    const label = log.status === 'success' ? (log.kcal != null ? `${log.kcal} kcal` : '—') : log.status === 'processing' ? 'Processing' : log.status === 'pending' ? 'Pending' : 'Failed';

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
