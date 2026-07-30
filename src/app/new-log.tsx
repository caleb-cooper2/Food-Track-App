import {router} from 'expo-router';
import {useCallback, useEffect, useState} from 'react';

import {CaptureStep} from '@/components/new-log/capture-step';
import {DescribeStep} from '@/components/new-log/describe-step';
import {ProcessingStep} from '@/components/new-log/processing-step';

type Step = 'capture' | 'describe' | 'processing';

const PROCESSING_DELAY_MS = 2500;

export default function NewLogScreen() {
    const [step, setStep] = useState<Step>('capture');
    const [capturedUri, setCapturedUri] = useState<string | null>(null);
    const [description, setDescription] = useState('');

    const handleCaptured = useCallback((uri: string) => {
        setCapturedUri(uri);
        setStep('describe');
    }, []);

    const handleRetake = useCallback(() => {
        setCapturedUri(null);
        setStep('capture');
    }, []);

    const handleSubmit = useCallback(() => {
        setStep('processing');
    }, []);

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
