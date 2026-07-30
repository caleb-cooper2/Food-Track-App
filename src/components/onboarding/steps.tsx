import {StyleSheet, Text, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';

type StepsProps = {
  steps: string[];
};

export function Steps({ steps }: StepsProps) {
  return (
      <View style={styles.container}>
        {steps.map((step, index) => (
            <View key={step} style={styles.row}>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>{index + 1}</Text>
              </View>
              <ThemedText style={styles.stepLabel}>{step}</ThemedText>
            </View>
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#8E8E93',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
