type LogStatus = 'success' | 'failed';

interface Log {
    id: string;
    description: string;
    createdAt: string;
    status: LogStatus;
    kcal: number | null; // only here when status is 'success'
}
