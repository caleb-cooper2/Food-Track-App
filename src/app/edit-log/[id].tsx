import {router, useLocalSearchParams} from 'expo-router';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {LogPhoto} from '@/components/log-detail/log-photo';
import {ProcessingStep} from '@/components/new-log/processing-step';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Spacing} from '@/constants/theme';
import {useLogs} from '@/hooks/use-logs';
import {useOnboarding} from '@/hooks/use-onboarding';
import {useTheme} from '@/hooks/use-theme';
import {estimateFoodVolume} from '@/services/volumeEstimation';
import {estimateFailureAlert} from '@/utils/estimate-error-alert';
import {kcalFromEnergyKj} from '@/utils/nutrition';

type Step = 'describe' | 'processing';

export default function EditLogScreen() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const {logs, updateLog} = useLogs();
    const {resetOnboarding} = useOnboarding();
    const scrollRef = useRef<ScrollView>(null);
    const [step, setStep] = useState<Step>('describe');
    const [description, setDescription] = useState('');

    const log = logs.find((entry) => entry.id === id);
    const canSave = description.trim().length > 0;

    useEffect(() => {
        if (log) setDescription(log.description);
    }, [log]);

    useEffect(() => {
        const subscription = Keyboard.addListener('keyboardDidShow', () => {
            scrollRef.current?.scrollToEnd({animated: true});
        });
        return () => subscription.remove();
    }, []);

    const handleCancel = useCallback(() => {
        router.back();
    }, []);

    const handleSave = useCallback(async () => {
        if (!log || !log.imageUri) return;
        setStep('processing');

        const result = await estimateFoodVolume(log.imageUri, description);

        if (result.success) {
            const nutrients = result.data.diagnostics.total_nutrients;
            updateLog(log.id, {
                description,
                createdAt: new Date().toISOString(),
                status: 'success',
                kcal: kcalFromEnergyKj(nutrients?.energy_kj),
                nutrients: nutrients ?? null,
                total_mass_g: result.data.mass_g,
                confidence: result.data.confidence,
            });
            router.back();
            return;
        }

        updateLog(log.id, {
            description,
            createdAt: new Date().toISOString(),
            status: 'failed',
            kcal: null,
            nutrients: null,
            total_mass_g: null,
            confidence: null
        });

        const {title, message} = estimateFailureAlert(result.kind);
        if (result.kind === 'config') {
            resetOnboarding();
            Alert.alert(title, message);
            return;
        }

        Alert.alert(title, message, [{text: 'OK', onPress: () => router.back()}]);
    }, [log, description, updateLog, resetOnboarding]);

    if (!log) {
        return (
            <ThemedView style={[styles.root, styles.notFound, {paddingTop: insets.top + Spacing.three}]}>
                <ThemedText themeColor="textSecondary">Log not found</ThemedText>
                <Pressable onPress={() => router.back()} hitSlop={12}>
                    <ThemedText type="smallBold">Back</ThemedText>
                </Pressable>
            </ThemedView>
        );
    }

    if (step === 'processing') {
        return <ProcessingStep />;
    }

    return (
        <KeyboardAvoidingView
            style={[styles.root, {backgroundColor: theme.background, paddingTop: insets.top + Spacing.three}]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <Pressable onPress={handleCancel} hitSlop={12}>
                    <ThemedText themeColor="textSecondary">Cancel</ThemedText>
                </Pressable>

                <ThemedText type="smallBold">Edit log</ThemedText>

                <Pressable onPress={handleSave} disabled={!canSave} hitSlop={12}>
                    <ThemedText themeColor={canSave ? 'text' : 'textSecondary'} type="smallBold" style={!canSave && styles.submitDisabled}>
                        Save
                    </ThemedText>
                </Pressable>
            </View>

            <ScrollView
                ref={scrollRef}
                contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + Spacing.four}]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <LogPhoto log={log} />

                <ThemedText themeColor="textSecondary" type="small" style={styles.label}>
                    DESCRIPTION
                </ThemedText>

                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="describe ingredients, sauces, cooking method etc"
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    style={[styles.input, {borderColor: theme.backgroundSelected, color: theme.text}]}
                />

                <ThemedText themeColor="textSecondary" type="small" style={styles.hint}>
                    Note: editing re-submits for a new estimate
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
    notFound: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.three
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
