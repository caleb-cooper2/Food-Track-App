import type {ReactNode} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';

type OnboardingPageProps = {
  title: string;
  subtitle?: string | null;
  align?: 'center' | 'top-left'; // center for first page, top-left for the rest
  children?: ReactNode;
};

export function OnboardingPage({ title, subtitle, align = 'center', children }: OnboardingPageProps) {
  const { height } = useWindowDimensions();
  const isTopLeft = align === 'top-left';

  return (
      <View
          style={[
            styles.container,
            isTopLeft && {
              minHeight: height - 180,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              paddingTop: Spacing.six
            },
          ]}
      >
        <ThemedText style={[styles.title, isTopLeft && styles.titleLeft]}>{title}</ThemedText>
        {subtitle && (
            <ThemedText themeColor="textSecondary" style={[styles.subtitle, isTopLeft && styles.subtitleLeft]}>
              {subtitle}
            </ThemedText>
        )}
        {children}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.five,
    gap: Spacing.four
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700'
  },
  titleLeft: {
    textAlign: 'left',
    fontSize: 20,
    lineHeight: 26
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 21
  },
  subtitleLeft: {
    textAlign: 'left'
  }
});
