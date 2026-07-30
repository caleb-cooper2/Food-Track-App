import {Pressable, StyleSheet, Text} from 'react-native';

import {Spacing} from '@/constants/theme';

type OnboardingFooterButtonProps = {
  label: string;
  disabled: boolean;
  onPress: () => void;
};

export function OnboardingFooterButton({ label, disabled, onPress }: OnboardingFooterButtonProps) {
  return (
      <Pressable
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => [styles.button, disabled && styles.buttonDisabled, pressed && styles.pressed]}
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
  buttonDisabled: {
    backgroundColor: '#2C2C2E',
    opacity: 0.6
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
