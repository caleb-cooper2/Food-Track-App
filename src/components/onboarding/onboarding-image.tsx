import {Image} from 'expo-image';
import type {ComponentProps} from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '@/hooks/use-theme';

type OnboardingImageCardProps = {
  source: ComponentProps<typeof Image>['source'];
};

export function OnboardingImage({ source }: OnboardingImageCardProps) {
  const theme = useTheme();

  return (
      <View style={[styles.card, { borderColor: theme.backgroundSelected }]}>
        <Image
            source={source}
            style={styles.image}
            contentFit="cover"
            contentPosition={{top: '80%'}}
            transition={120}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
