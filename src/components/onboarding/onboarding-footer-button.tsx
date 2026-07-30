import {Pressable, StyleSheet, Text} from 'react-native';

import {Spacing} from '@/constants/theme';

type OnboardingFooterButtonProps = {
  label: string;
  onPress: () => void;
};

export function OnboardingFooterButton({ label, onPress }: OnboardingFooterButtonProps) {
  return (
      <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center'
  },
  pressed: {
    opacity: 0.85
  },
  label: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700'
  }
});
