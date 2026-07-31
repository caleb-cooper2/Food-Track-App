import {router} from 'expo-router';
import {useCallback, useState} from 'react';
import {Alert} from 'react-native';

import {CaptureStep} from '@/components/new-log/capture-step';
import {DescribeStep} from '@/components/new-log/describe-step';
import {ProcessingStep} from '@/components/new-log/processing-step';
import {useLogs} from '@/hooks/use-logs';
import {useOnboarding} from '@/hooks/use-onboarding';
import {estimateFoodVolume} from '@/services/volumeEstimation';
import {estimateFailureAlert} from '@/utils/estimate-error-alert';
import {kcalFromEnergyKj} from '@/utils/nutrition';

type Step = 'capture' | 'describe' | 'processing';

function generateId(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export default function NewLogScreen() {
    const [step, setStep] = useState<Step>('capture');
    const [capturedUri, setCapturedUri] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const {addLog} = useLogs();
    const {resetOnboarding} = useOnboarding();

    const handleCaptured = useCallback((uri: string) => {
        setCapturedUri(uri);
        setStep('describe');
    }, []);

    const handleRetake = useCallback(() => {
        setCapturedUri(null);
        setStep('capture');
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!capturedUri) return;
        setStep('processing');

        const result = await estimateFoodVolume(capturedUri, description);

        if (result.success) {
            const nutrients = result.data.diagnostics.total_nutrients;
            addLog({
                id: generateId(),
                description,
                createdAt: new Date().toISOString(),
                imageUri: capturedUri,
                status: 'success',
                kcal: kcalFromEnergyKj(nutrients?.energy_kj),
                nutrients: nutrients ?? null
            });
            router.back();
            return;
        }

        addLog({
            id: generateId(),
            description,
            createdAt: new Date().toISOString(),
            imageUri: capturedUri,
            status: 'failed',
            kcal: null,
            nutrients: null
        });

        const {title, message} = estimateFailureAlert(result.kind);
        if (result.kind === 'config') {
            resetOnboarding();
            Alert.alert(title, message);
            return;
        }

        Alert.alert(title, message, [{text: 'OK', onPress: () => router.back()}]);
    }, [addLog, capturedUri, description, resetOnboarding]);

    if (step === 'capture') {
        return <CaptureStep onCancel={() => router.back()} onCaptured={handleCaptured} />;
    }

    if (step === 'processing') {
        return <ProcessingStep />;
    }

    return (
        <DescribeStep
            imageUri={capturedUri!}
            description={description}
            onChangeDescription={setDescription}
            onRetake={handleRetake}
            onSubmit={handleSubmit}
        />
    );
}
