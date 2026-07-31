/**
 * Holds the list of meal logs shown on the home screen, persisted across launches via AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';

const LOGS_STORAGE_KEY = 'food-logs';

type LogsContextValue = {
    logs: Log[];
    addLog: (log: Log) => void;
    updateLog: (id: string, updates: Partial<Log>) => void;
    removeLog: (id: string) => void;
};

const LogsContext = createContext<LogsContextValue | null>(null);

export function LogsProvider({ children }: PropsWithChildren) {
    const [logs, setLogs] = useState<Log[] | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(LOGS_STORAGE_KEY).then((stored) => {
            if (stored) {
                setLogs(JSON.parse(stored));
            } else {
                setLogs(new Array<Log>());
            }
        });
    }, []);

    const addLog = useCallback((log: Log) => {
        setLogs((prev) => {
            const next = [log, ...(prev ?? [])];
            AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const updateLog = useCallback((id: string, updates: Partial<Log>) => {
        setLogs((prev) => {
            const next = (prev ?? []).map((entry) => (entry.id === id ? { ...entry, ...updates } : entry));
            AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const removeLog = useCallback((id: string) => {
        setLogs((prev) => {
            const next = (prev ?? []).filter((entry) => entry.id !== id);
            AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const value = useMemo(() => ({ logs: logs ?? [], addLog, updateLog, removeLog }), [logs, addLog, updateLog, removeLog]);

    // Wait for the persisted value before mounting any routes that read logs
    if (logs === null) return null;

    return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
}

export function useLogs() {
    const context = useContext(LogsContext);
    if (!context) throw new Error('useLogs must be used within a LogsProvider');
    return context;
}
