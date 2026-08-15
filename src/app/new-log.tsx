import {router} from 'expo-router';
import {useCallback, useState} from 'react';

import {CaptureStep} from '@/components/new-log/capture-step';
import {DescribeStep} from '@/components/new-log/describe-step';
import {useLogs} from '@/hooks/use-logs';
import {useOnboarding} from '@/hooks/use-onboarding';
import {submitLogEstimate} from '@/services/logSubmission';
import {persistLogImage} from '@/utils/storage-image';

type Step = 'capture' | 'describe' | 'processing';

function generateId(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export default function NewLogScreen() {
    const [step, setStep] = useState<Step>('capture');
    const [capturedUri, setCapturedUri] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const {addLog, updateLog} = useLogs();
    const {resetOnboarding} = useOnboarding();

    const handleCaptured = useCallback(async (uri: string) => {
        const persistedUri = await persistLogImage(uri);
        setCapturedUri(persistedUri);
        setStep('describe');
    }, []);

    const handleRetake = useCallback(() => {
        setCapturedUri(null);
        setStep('capture');
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!capturedUri) return;

        const id = generateId();
        const persistedUri = await persistLogImage(capturedUri, id);

        addLog({
            id,
            description,
            createdAt: new Date().toISOString(),
            imageUri: persistedUri,
            status: 'pending',
            kcal: null,
            nutrients: null,
            total_mass_g: null,
            confidence: null,
            items_with_nutrients: null,
            items: null,
            failureKind: null,
        });

        submitLogEstimate(id, persistedUri, description, updateLog, resetOnboarding);

        router.back();
    }, [addLog, capturedUri, description, resetOnboarding, updateLog]);

    if (step === 'capture') {
        return <CaptureStep onCancel={() => router.back()} onCaptured={handleCaptured} />;
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
