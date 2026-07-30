function at(daysAgo: number, hour: number, minute: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
}

export const MOCK_LOGS: Log[] = [
    {
        id: '1',
        description: 'Grilled chicken, rice and broccoli',
        createdAt: at(0, 12, 41),
        imageUri: null,
        status: 'success',
        kcal: 612,
        nutrients: { energy_kj: 2561, protein_g: 46, carbs_g: 70, fat_g: 16, fibre_g: 7, sodium_mg: 520 }
    },
    {
        id: '2',
        description: 'Greek yoghurt and muesli',
        createdAt: at(0, 8, 12),
        imageUri: null,
        status: 'success',
        kcal: 312,
        nutrients: { energy_kj: 1305, protein_g: 18, carbs_g: 40, fat_g: 9, fibre_g: 4, sodium_mg: 120 }
    },
    {
        id: '3',
        description: 'Ham sandwich with a side salad',
        createdAt: at(1, 13, 5),
        imageUri: null,
        status: 'success',
        kcal: 540,
        nutrients: { energy_kj: 2259, protein_g: 28, carbs_g: 55, fat_g: 22, fibre_g: 5, sodium_mg: 890 }
    },
    {
        id: '4',
        description: 'Pasta with bolognese sauce and garlic bread',
        createdAt: at(1, 11, 54),
        imageUri: null,
        status: 'failed',
        kcal: null,
        nutrients: null
    },
    {
        id: '5',
        description: 'pavlova with lots of whipped cream and strawberries',
        createdAt: at(4, 9, 30),
        imageUri: null,
        status: 'success',
        kcal: 430,
        nutrients: { energy_kj: 1799, protein_g: 5, carbs_g: 58, fat_g: 18, fibre_g: 2, sodium_mg: 95 }
    }
];
