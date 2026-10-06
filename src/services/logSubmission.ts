import {estimateFoodVolume, JobPollStatus} from "@/services/volumeEstimation";
import {removePendingJob, savePendingJob} from "@/hooks/use-pending-jobs";
import {applyEstimateResult} from "@/services/applyEstimateResult";

type UpdateLog = (id: string, patch: Partial<Log>) => void;

export function submitLogEstimate(
    id: string,
    imageUri: string,
    description: string,
    updateLog: UpdateLog,
    onConfigError?: () => void
): Promise<void> {
    let jobCreated = false;
    let resolved = false;

    const createdPromise = new Promise<void>((resolve) => {
        const handleStatusUpdate = (status: JobPollStatus) => {
            updateLog(id, { status: status });
        };

        const handleJobCreated = async (jobId: string, pollToken: string, deadline: number) => {
            try {
                await savePendingJob({ logId: id, jobId, pollToken, deadline });
                jobCreated = true;
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            } catch (err) {
                console.warn('[logSubmission] savePendingJob failed', err);
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }
        };

        estimateFoodVolume(imageUri, description, "size_prior", handleStatusUpdate, handleJobCreated)
            .then((result) => {
                if (!jobCreated && !resolved) {
                    resolved = true;
                    resolve();
                }

                removePendingJob(id);
                applyEstimateResult(id, result, updateLog, onConfigError);
            }).catch((err) => {
                console.warn('[logSubmission] estimateFoodVolume threw', id, err);
                if (!jobCreated && !resolved) {
                    resolved = true;
                    resolve();
                }
            });
    });

    const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 8000));

    return Promise.race([createdPromise, timeoutPromise]);
}
