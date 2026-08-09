import {router} from 'expo-router';
import {useCallback, useState} from 'react';

import {CaptureStep} from '@/components/new-log/capture-step';
import {DescribeStep} from '@/components/new-log/describe-step';
import {useLogs} from '@/hooks/use-logs';
import {useOnboarding} from '@/hooks/use-onboarding';
import {submitLogEstimate} from "@/services/logSubmission";

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

    const handleCaptured = useCallback((uri: string) => {
        setCapturedUri(uri);
        setStep('describe');
    }, []);

    const handleRetake = useCallback(() => {
        setCapturedUri(null);
        setStep('capture');
    }, []);

    const handleSubmit = useCallback(() => {
        if (!capturedUri) return;

        const id = generateId();
        addLog({
            id,
            description,
            createdAt: new Date().toISOString(),
            imageUri: capturedUri,
            status: 'processing',
            kcal: null,
            nutrients: null,
            total_mass_g: null,
            confidence: null,
            items_with_nutrients: null,
            items: null,
            failureKind: null,
        });

        submitLogEstimate(id, capturedUri, description, updateLog, resetOnboarding);

        router.back();
    }, [addLog, updateLog, capturedUri, description]);

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
