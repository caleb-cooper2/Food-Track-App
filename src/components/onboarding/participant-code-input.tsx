import {StyleSheet, TextInput} from 'react-native';

import {Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';

type ParticipantCodeInputProps = {
    value: string;
    onChangeText: (text: string) => void;
};

export function ParticipantCodeInput({value, onChangeText}: ParticipantCodeInputProps) {
    const theme = useTheme();

    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="e.g. P014"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            maxLength={4}
            returnKeyType="done"
            style={[styles.input, {borderColor: theme.backgroundSelected, color: theme.text}]}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        minHeight: 52,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
        fontSize: 17,
        letterSpacing: 3,
        textAlign: 'center'
    }
});