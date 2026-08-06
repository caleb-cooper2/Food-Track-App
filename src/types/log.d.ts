type LogStatus = 'success' | 'failed';
type PossibleConfidence = 'low' | 'medium' | 'high';

interface Log {
    id: string;
    description: string;
    createdAt: string;
    imageUri: string | null;
    status: LogStatus;
    kcal: number | null; // only here when status is 'success'
    nutrients: FoodNutrients | null; // only here when status is 'success'
    total_mass_g: number | null;
    confidence: PossibleConfidence | null;
}