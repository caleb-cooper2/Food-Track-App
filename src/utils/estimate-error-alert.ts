import type {VolumeEstimateErrorKind} from '@/services/volumeEstimation';

type EstimateFailureAlert = {
    title: string;
    message: string;
};

export function estimateFailureAlert(kind: VolumeEstimateErrorKind): EstimateFailureAlert {
    switch (kind) {
        case 'timeout':
            return {
                title: 'Request timed out',
                message: 'The estimate took too long to come back. We\'ve saved your log - edit it to try again later.'
            };
        case 'network':
            return {
                title: 'No connection',
                message: 'We couldn\'t reach the server. Check your Wi-Fi or cellular connection, then edit your log to try again later.'
            };
        case 'config':
            return {
                title: 'Participant code missing',
                message: 'We couldn\'t find your participant code. Please restart the app and complete onboarding again.'
            };
        default:
            return {
                title: 'Something went wrong',
                message: 'We couldn\'t process your log right now. We\'ve saved it - edit it to try again later.'
            };
    }
}
