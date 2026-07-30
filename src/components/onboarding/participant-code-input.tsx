import {StyleSheet, TextInput} from 'react-native';

import {Spacing} from '@/constants/theme';

type ParticipantCodeInputProps = {
    value: string;
    onChangeText: (text: string) => void;
};

export function ParticipantCodeInput({value, onChangeText}: ParticipantCodeInputProps) {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="e.g. P014"
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            maxLength={4}
            returnKeyType="done"
            style={styles.input}
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