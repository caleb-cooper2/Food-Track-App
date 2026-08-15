import { Directory, File, Paths } from 'expo-file-system';

export async function persistLogImage(sourceUri: string, logId?: string): Promise<string> {
    if (!sourceUri) return sourceUri;

    if (sourceUri.startsWith(Paths.document.uri)) {
        return sourceUri;
    }

    const logsDirectory = new Directory(Paths.document, 'food-logs');

    try {
        logsDirectory.create({ intermediates: true, idempotent: true });
    } catch (error) {
        console.warn('[storage-image] Failed to create food-logs directory, falling back to original image URI:', error);
        return sourceUri;
    }

    const filename = `${logId ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`}.jpg`;
    const destinationFile = new File(logsDirectory, filename);

    try {
        const sourceFile = new File(sourceUri);
        await sourceFile.copy(destinationFile, { overwrite: true });
        return destinationFile.uri;
    } catch (error) {
        console.warn('[storage-image] Failed to persist log image to app storage:', error);
        return sourceUri;
    }
}

export async function migrateLogImages(logs: Log[]): Promise<Log[]> {
    if (!logs.length) return logs;

    return Promise.all(
        logs.map(async (log) => {
            if (!log.imageUri) return log;
            try {
                const migratedUri = await persistLogImage(log.imageUri, log.id);
                if (migratedUri !== log.imageUri) console.debug('[storage-image] migrated image for log', log.id, migratedUri);
                return { ...log, imageUri: migratedUri };
            } catch (err) {
                console.warn('[storage-image] migrate failed for log', log.id, err);
                return log;
            }
        })
    );
}

export async function deleteLogImage(imageUri: string | null): Promise<void> {
    if (!imageUri || !imageUri.startsWith(Paths.document.uri)) return;

    try {
        const file = new File(imageUri);
        file.delete();
    } catch (error) {
        console.warn('[storage-image] Failed to delete log image from app storage:', error);
    }
}