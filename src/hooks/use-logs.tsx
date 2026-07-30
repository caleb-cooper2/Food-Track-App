/**
 * Holds the list of meal logs shown on the home screen. Uses mock data for now
 */
import {createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState} from 'react';

import {MOCK_LOGS} from '@/data/mock-logs';

type LogsContextValue = {
    logs: Log[];
    addLog: (log: Log) => void;
};

const LogsContext = createContext<LogsContextValue | null>(null);

export function LogsProvider({ children }: PropsWithChildren) {
    const [logs, setLogs] = useState<Log[]>(MOCK_LOGS);

    const addLog = useCallback((log: Log) => {
        setLogs((prev) => [log, ...prev]);
    }, []);

    const value = useMemo(() => ({ logs, addLog }), [logs, addLog]);

    return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
}

export function useLogs() {
    const context = useContext(LogsContext);
    if (!context) throw new Error('useLogs must be used within a LogsProvider');
    return context;
}
