function at(daysAgo: number, hour: number, minute: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
}

export const MOCK_LOGS: Log[] = [
    { id: '1', description: 'Grilled chicken, rice and broccoli', createdAt: at(0, 12, 41), status: 'success', kcal: 612 },
    { id: '2', description: 'Greek yoghurt and muesli', createdAt: at(0, 8, 12), status: 'success', kcal: 312 },
    { id: '3', description: 'Ham sandwich with a side salad', createdAt: at(1, 13, 5), status: 'success', kcal: 540 },
    { id: '4', description: 'Pasta with bolognese sauce and garlic bread', createdAt: at(1, 11, 54), status: 'failed', kcal: null },
    { id: '5', description: 'pavlova with lots of whipped cream and strawberries', createdAt: at(4, 9, 30), status: 'success', kcal: 430 }
];
