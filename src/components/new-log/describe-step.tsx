import {Image} from 'expo-image';
import {useEffect, useRef, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ThemedText} from '@/components/themed-text';
import {Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';

type DescribeStepProps = {
    imageUri: string;
    description: string;
    onChangeDescription: (value: string) => void;
    onRetake: () => void;
    onSubmit: () => void;
};

export function DescribeStep({imageUri, description, onChangeDescription, onRetake, onSubmit}: DescribeStepProps) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const canSubmit = description.trim().length > 0;
    const [imageAspectRatio, setImageAspectRatio] = useState(3 / 4);
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const subscription = Keyboard.addListener('keyboardDidShow', () => {
            scrollRef.current?.scrollToEnd({animated: true});
        });
        return () => subscription.remove();
    }, []);

    return (
        <KeyboardAvoidingView
            style={[styles.root, {backgroundColor: theme.background, paddingTop: insets.top + Spacing.three}]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <Pressable onPress={onRetake} hitSlop={12}>
                    <ThemedText themeColor="textSecondary">Retake</ThemedText>
                </Pressable>

                <ThemedText type="smallBold">New log</ThemedText>

                <Pressable onPress={onSubmit} disabled={!canSubmit} hitSlop={12}>
                    <ThemedText themeColor={canSubmit ? 'text' : 'textSecondary'} type="smallBold" style={!canSubmit && styles.submitDisabled}>
                        Submit
                    </ThemedText>
                </Pressable>
            </View>

            <ScrollView
                ref={scrollRef}
                contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + Spacing.four}]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <Image
                    source={{uri: imageUri}}
                    style={[styles.photo, {aspectRatio: imageAspectRatio, backgroundColor: theme.background}]}
                    contentFit="contain"
                    onLoad={(event) => setImageAspectRatio(event.source.width / event.source.height)}
                />

                <ThemedText themeColor="textSecondary" type="small" style={styles.label}>
                    DESCRIPTION
                </ThemedText>

                <TextInput
                    value={description}
                    onChangeText={onChangeDescription}
                    placeholder="describe ingredients, sauces, cooking method etc"
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    style={[styles.input, {borderColor: theme.backgroundSelected, color: theme.text}]}
                />

                <ThemedText themeColor="textSecondary" type="small" style={styles.hint}>
                    Tip: the more detail here provides the best chance of an accurate estimate.
                </ThemedText>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: Spacing.four
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.four
    },
    content: {
        flexGrow: 1,
        gap: Spacing.four
    },
    photo: {
        alignSelf: 'center',
        width: '100%',
        maxHeight: 420,
        borderRadius: 16
    },
    label: {
        letterSpacing: 0.5,
        marginBottom: -Spacing.two
    },
    input: {
        minHeight: 100,
        maxHeight: 160,
        borderWidth: 1,
        borderRadius: 14,
        padding: Spacing.three,
        fontSize: 15,
        lineHeight: 21,
        textAlignVertical: 'top'
    },
    hint: {
        marginTop: -Spacing.two
    },
    submitDisabled: {
        opacity: 0.5
    }
});
