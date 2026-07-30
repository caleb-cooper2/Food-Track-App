import {StyleSheet, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';

export function QuoteCard({ children }: { children: string }) {
  const theme = useTheme();

  return (
      <View style={[styles.card, { borderColor: theme.backgroundSelected }]}>
        <ThemedText style={styles.text}>{'“'}{children}{'”'}</ThemedText>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.four
  },
  text: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22
  }
});
