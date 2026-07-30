interface NutrientMeta {
    key: keyof FoodNutrients;
    label: string;
    unit: string;
    referenceValue: number;
}

/**
 * Generic reference values from NZ Ministry of Health %DI figures, matches how food nutrition tables display
 * % daily intake values for each nutrient
 *
 * https://www.nzihf.co.nz/media-resources-1/articles/personal%20training-nutrition-guidelines-adults
 */
export const NUTRIENT_DISPLAY_ORDER: NutrientMeta[] = [
    { key: 'energy_kj', label: 'Energy', unit: 'kJ', referenceValue: 8700 },
    { key: 'protein_g', label: 'Protein', unit: 'g', referenceValue: 50 },
    { key: 'carbs_g', label: 'Carbs', unit: 'g', referenceValue: 310 },
    { key: 'fat_g', label: 'Fat', unit: 'g', referenceValue: 70 },
    { key: 'fibre_g', label: 'Fibre', unit: 'g', referenceValue: 30 },
    { key: 'sodium_mg', label: 'Sodium', unit: 'mg', referenceValue: 2300 }
];
