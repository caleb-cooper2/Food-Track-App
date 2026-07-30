import {StyleSheet, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';

type NutrientBarProps = {
    label: string;
    value: number;
    unit: string;
    referenceValue: number;
};

export function NutrientBar({ label, value, unit, referenceValue }: NutrientBarProps) {
    const theme = useTheme();
    const fillPercent = referenceValue > 0 ? Math.min(Math.max(value / referenceValue, 0), 1) * 100 : 0;

    return (
        <View style={styles.root}>
            <View style={styles.labelRow}>
                <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{Math.round(value)}{unit === 'g' ? 'g' : ` ${unit}`}</ThemedText>
            </View>

            <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
                <View style={[styles.fill, { width: `${fillPercent}%`, backgroundColor: theme.text }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        gap: Spacing.one
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    track: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden'
    },
    fill: {
        height: '100%',
        borderRadius: 4
    }
});
