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

export type VolumeEstimateResult =
    | { success: true; data: VolumeEstimateResponse }
    | { success: false; kind: VolumeEstimateErrorKind; error: string };

const VOLUME_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/estimate-volume`;
const REQUEST_TIMEOUT_MS = 120_000; // 120 secs

// In case NetInfo misses something
function isNetworkError(err: unknown): boolean {
    if (!(err instanceof TypeError)) return false;
    return /network request failed|failed to fetch|network error/i.test(err.message);
}

export type ScaleRef = "utensil" | "size_prior" | "checkerboard" | "auto";

export async function estimateFoodVolume(
    imageUri: string,
    description: string,
    scaleRef: ScaleRef = "size_prior"
): Promise<VolumeEstimateResult> {
    const netState = await NetInfo.fetch();
    if (netState.isConnected === false || netState.isInternetReachable === false) {
        return { success: false, kind: "network", error: "No internet connection detected" };
    }

    const participantCode = await getParticipantCode();
    if (!participantCode) {
        return { success: false, kind: "config", error: "No participant code found - please complete onboarding" };
    }

    const file = new File(imageUri);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("participant_code", participantCode);
    formData.append("scale_ref", scaleRef);
    formData.append("text", description);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(VOLUME_ENDPOINT, {
            method: "POST",
            body: formData,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorBody = await response.text();
            return { success: false, kind: "server", error: `Server error ${response.status}: ${errorBody}` };
        }

        const data: VolumeEstimateResponse = await response.json();
        return { success: true, data };
    } catch (err: unknown) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === "AbortError") {
            return { success: false, kind: "timeout", error: `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s` };
        }

        if (isNetworkError(err)) {
            return { success: false, kind: "network", error: "Could not connect to the server" };
        }

        return {
            success: false,
            kind: "unknown",
            error: err instanceof Error ? err.message : "Unknown network error",
        };
    }
}