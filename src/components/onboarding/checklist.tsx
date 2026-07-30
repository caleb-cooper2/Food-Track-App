import {StyleSheet, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';

type ChecklistProps = {
  items: string[];
};

export function Checklist({ items }: ChecklistProps) {
  const theme = useTheme();

  return (
      <View style={styles.container}>
        {items.map((item) => (
            <View key={item} style={styles.row}>
              <View style={[styles.box, { borderColor: theme.backgroundSelected }]} />
              <ThemedText style={styles.label}>{item}</ThemedText>
            </View>
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: Spacing.three
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    marginTop: 2
  },
  label: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20
  }
});
