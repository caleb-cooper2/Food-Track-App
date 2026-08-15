import NetInfo from '@react-native-community/netinfo';
import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

import { getParticipantCode } from '@/hooks/use-onboarding';

export interface VolumeEstimateItem {
    prompt: string;
    matched_food: string | null;
    volume_cm3: number;
    mass_g: number | null;
    mass_interval_g: [number, number] | null;
    density_source: string | null;
    presentation: string | null;
    nutrients: FoodNutrients | null; // Rescaled by volume endpoint to be in relation to estimated mass
    coverage_pct: number;
    segmentation_score: number;
    geometry_confidence: number;
}

export interface VolumeEstimateDiagnostics {
    food_pixel_count: number;
    food_coverage_pct: number;
    plate_depth_m: number;
    intrinsics_source: "exif" | "fallback" | "depthpro_fov";
    scale_ref: string;
    scale_source: string;
    scale_factor: number | null;
    items: VolumeEstimateItem[];
    items_with_masses: number;
    items_with_nutrients: number;
    total_nutrients: FoodNutrients | null; // Rescaled by volume endpoint to be in relation to estimated mass
    nlp_available: boolean;
}

export interface VolumeEstimateResponse {
    approach: "monocular-geometric" | "deep-learning" | "multi-view";
    volume_cm3: number | null;
    mass_g: number | null;
    confidence: "high" | "medium" | "low";
    diagnostics: VolumeEstimateDiagnostics;
}

export type VolumeEstimateErrorKind = "timeout" | "network" | "server" | "config" | "unknown";
export type JobPollStatus = "pending" | "processing";

export type VolumeEstimateResult =
    | { success: true; data: VolumeEstimateResponse }
    | { success: false; kind: VolumeEstimateErrorKind; error: string };

interface SubmitJobResponse {
    job_id: string;
    status: string;
    poll_token: string;
}

interface PollJobResponse {
    job_id: string;
    status: string;
    result?: VolumeEstimateResponse;
    error_message?: string;
}

const SUBMIT_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/submit`;
const pollEndpoint = (jobId: string) => `${process.env.EXPO_PUBLIC_API_URL}/api/v1/poll/${jobId}`;

const SUBMIT_TIMEOUT_MS = 30_000;
const POLL_REQUEST_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 2_000;
const POLL_OVERALL_TIMEOUT_MS = 120_000;

export type ScaleRef = "utensil" | "size_prior" | "checkerboard" | "auto";

// In case NetInfo misses something
function isNetworkError(err: unknown): boolean {
    if (!(err instanceof TypeError)) return false;
    return /network request failed|failed to fetch|network error/i.test(err.message);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function toErrorResult(err: unknown, timeoutMs: number) : { success: false; kind: VolumeEstimateErrorKind; error: string } {
    if (err instanceof Error && err.name === "AbortError") {
        return { success: false, kind: "timeout", error: `Request timed out after ${timeoutMs / 1000}s` };
    }
    if (isNetworkError(err)) {
        return { success: false, kind: "network", error: "Could not connect to the server" };
    }
    return {
        success: false,
        kind: "unknown",
        error: err instanceof Error ? err.message : "Unknown network error"
    };
}

export async function estimateFoodVolume(
    imageUri: string,
    description: string,
    scaleRef: ScaleRef = "size_prior",
    onStatusUpdate?: (status: JobPollStatus) => void
): Promise<VolumeEstimateResult> {
    const netState = await NetInfo.fetch();
    if (netState.isConnected === false || netState.isInternetReachable === false) {
        return {success: false, kind: "network", error: "No internet connection detected"};
    }

    const participantCode = await getParticipantCode();
    if (!participantCode) {
        return {success: false, kind: "config", error: "No participant code found - please complete onboarding"};
    }

    const submitResult = await submitJob(imageUri, description, scaleRef, participantCode);
    if (!submitResult.success) return submitResult;

    return pollForResult(submitResult.jobId, submitResult.pollToken, onStatusUpdate);
}

type SubmitResult =
    | { success: true; jobId: string; pollToken: string }
    | { success: false; kind: VolumeEstimateErrorKind; error: string };

async function submitJob(
    imageUri: string,
    description: string,
    scaleRef: ScaleRef = "size_prior",
    participantCode: string
): Promise<SubmitResult> {
    const file = new File(imageUri);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("participant_code", participantCode);
    formData.append("scale_ref", scaleRef);
    formData.append("text", description);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
        const response = await fetch(SUBMIT_ENDPOINT, {
            method: "POST",
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorBody = await response.text();
            return { success: false, kind: "server", error: `Server error ${response.status}: ${errorBody}` };
        }

        const data: SubmitJobResponse = await response.json();
        return { success: true, jobId: data.job_id, pollToken: data.poll_token };
    } catch (err: unknown) {
        clearTimeout(timeoutId);
        return toErrorResult(err, SUBMIT_TIMEOUT_MS);
    }
}

async function pollForResult(
    jobId: string,
    pollToken: string,
    onStatusUpdate?: (status: JobPollStatus) => void
): Promise<VolumeEstimateResult> {
    const deadline = Date.now() + POLL_OVERALL_TIMEOUT_MS;
    let lastReportedStatus: string | null = null;

    while (Date.now() < deadline) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), POLL_REQUEST_TIMEOUT_MS);

        try {
            const url = `${pollEndpoint(jobId)}?poll_token=${encodeURIComponent(pollToken)}`;
            const response = await fetch(url, { method: "POST", signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await response.text();
                return { success: false, kind: "server", error: `Server error ${response.status}: ${errorBody}`}
            }

            const data: PollJobResponse = await response.json();
            const status = data.status;

            if (status === "completed") {
                if (!data.result) {
                    return { success: false, kind: "server", error: "Job completed with no result" };
                }
                return { success: true, data: data.result };
            } else if (status === "failed") {
                return { success: false, kind: "server", error: data.error_message ?? `Job ${jobId} failed` };
            }

            if (status !== lastReportedStatus && (status === "pending"|| status === "processing")) {
                lastReportedStatus = status;
                onStatusUpdate?.(status);
            }
        } catch (err: unknown) {
            clearTimeout(timeoutId);
            const errorResult = toErrorResult(err, POLL_REQUEST_TIMEOUT_MS);
            if (errorResult.kind !== "timeout") return errorResult; // a slow single poll shouldn't kill the job, instead we keep trying until the overall deadline
        }

        await sleep(POLL_INTERVAL_MS)
    }

    return { success: false, kind: "timeout", error: `Polling for job ${jobId} timed out after ${POLL_OVERALL_TIMEOUT_MS / 1000}s` };
}
