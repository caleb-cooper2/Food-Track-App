function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dayLabel(date: Date, now: Date): string {
    const day = startOfDay(date).getTime();
    const today = startOfDay(now);
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    if (day === today.getTime()) return 'TODAY';
    if (day === yesterday.getTime()) return 'YESTERDAY';

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${date.getFullYear()}`;
}

export function formatTime12h(date: Date): string {
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    const hours = date.getHours() % 12 || 12;
    return `${hours}:${minutes} ${period}`;
}

export function formatLogTimestamp(date: Date, now: Date = new Date()): string {
    const label = dayLabel(date, now);
    const day = label === 'TODAY' ? 'Today' : label === 'YESTERDAY' ? 'Yesterday' : label;
    return `${day}, ${formatTime12h(date)}`;
}

interface LogGroup {
    label: string;
    logs: Log[];
}

export function groupLogsByDay(logs: Log[], now: Date = new Date()): LogGroup[] {
    const groups: LogGroup[] = [];

    // Assuming logs already sorted by date
    for (const log of logs) {
        const label = dayLabel(new Date(log.createdAt), now);
        const lastGroup = groups[groups.length - 1];

        if (lastGroup && lastGroup.label === label) {
            lastGroup.logs.push(log);
        } else {
            groups.push({ label, logs: [log] });
        }
    }

    return groups;
}
