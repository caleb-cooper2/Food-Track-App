type LogStatus = 'success' | 'failed';

interface Log {
    id: string;
    description: string;
    createdAt: string;
    imageUri: string | null;
    status: LogStatus;
    kcal: number | null; // only here when status is 'success'
    nutrients: FoodNutrients | null; // only here when status is 'success'
}