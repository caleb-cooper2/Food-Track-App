import {router} from 'expo-router';
import {useCallback, useEffect, useState} from 'react';

import {CaptureStep} from '@/components/new-log/capture-step';
import {DescribeStep} from '@/components/new-log/describe-step';
import {ProcessingStep} from '@/components/new-log/processing-step';
import {useLogs} from '@/hooks/use-logs';

type Step = 'capture' | 'describe' | 'processing';

const PROCESSING_DELAY_MS = 2500;

function generateId(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export default function NewLogScreen() {
    const [step, setStep] = useState<Step>('capture');
    const [capturedUri, setCapturedUri] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const {addLog} = useLogs();

    const handleCaptured = useCallback((uri: string) => {
        setCapturedUri(uri);
        setStep('describe');
    }, []);

    const handleRetake = useCallback(() => {
        setCapturedUri(null);
        setStep('capture');
    }, []);

    const handleSubmit = useCallback(() => {
        // Not wired up to the volume/NLP endpoint yet, so nutrients stay null for now
        addLog({
            id: generateId(),
            description,
            createdAt: new Date().toISOString(),
            imageUri: capturedUri,
            status: 'failed',
            kcal: null,
            nutrients: null
        });
        setStep('processing');
    }, [addLog, capturedUri, description]);

    useEffect(() => {
        if (step !== 'processing' || !capturedUri) return;

        let cancelled = false;
        const timeout = setTimeout(async () => {
            if (!cancelled) router.back();
        }, PROCESSING_DELAY_MS);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [step, capturedUri]);

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
