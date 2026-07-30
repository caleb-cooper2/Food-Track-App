import {StyleSheet, View} from 'react-native';

import {useTheme} from '@/hooks/use-theme';

type OnboardingDotsProps = {
  count: number;
  activeIndex: number;
};

export function OnboardingDots({ count, activeIndex }: OnboardingDotsProps) {
  const theme = useTheme();

  return (
      <View style={styles.row}>
        {Array.from({ length: count }).map((_, index) => (
            <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === activeIndex ? theme.text : theme.backgroundSelected },
                ]}
            />
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  }
});
