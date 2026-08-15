import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useRef} from "react";
import {useLogs} from "@/hooks/use-logs";
import {resumePolling} from "@/services/volumeEstimation";
import {applyEstimateResult} from "@/services/applyEstimateResult";
import {submitLogEstimate} from "@/services/logSubmission";

const STORAGE_KEY = 'pendingVolumeJobs';

export interface PendingJob {
    logId: string;
    jobId: string;
    pollToken: string;
    deadline: number;
}

async function readAll(): Promise<Record<string, PendingJob>> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        return {};
    }
}

export async function savePendingJob(job: PendingJob): Promise<void> {
    const jobs = await readAll();
    jobs[job.logId] = job;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export async function removePendingJob(logId: string): Promise<void> {
    const jobs = await readAll();
    delete jobs[logId]
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export async function getPendingJobs(): Promise<PendingJob[]> {
    const all = await readAll();
    const list = Object.values(all);
    return list;
}

export function useResumePendingLogs() {
    const { logs, updateLog } = useLogs();
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        (async () => {
            const pending = await getPendingJobs();
            const pendingByLog = new Map(pending.map((p) => [p.logId, p]));

            for (const job of pending) {
                const matchingLog = logs.find((l) => l.id === job.logId);
                if (!matchingLog) {
                    await removePendingJob(job.logId);
                    continue;
                }

                updateLog(job.logId, { status: 'processing' });

                resumePolling(job.jobId, job.pollToken, job.deadline, (status) => {
                    updateLog(job.logId, { status: status });
                }).then((result) => {
                    removePendingJob(job.logId);
                    applyEstimateResult(job.logId, result, updateLog);
                }).catch((err) => {
                    console.warn('[pending-jobs] resumePolling error for', job.logId, err);
                });
            }

            for (const log of logs) {
                if (log.status !== 'processing' && log.status !== 'pending') continue;
                if (pendingByLog.has(log.id)) continue;
                if (!log.imageUri) continue;

                try {
                    await submitLogEstimate(log.id, log.imageUri, log.description, updateLog);
                } catch (err) {
                    console.warn('[pending-jobs] failed to resubmit log', log.id, err);
                }
            }
        })();

    }, [logs, updateLog]);
}