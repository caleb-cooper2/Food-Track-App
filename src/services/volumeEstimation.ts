import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

export interface VolumeEstimateResponse {
    volume_cm3: number;
    confidence: "high" | "medium" | "low";
    food_pixel_count: number;
    food_coverage_pct: number;
    max_food_height_cm: number;
    mean_food_height_cm: number;
    plate_depth_m: number;
    scale_correction_factor: number;
    intrinsics_source: "exif" | "error";
    debug_overlay_b64: string | null;
}

export type VolumeEstimateResult = { success: true; data: VolumeEstimateResponse } | { success: false; error: string };

const VOLUME_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/estimate-volume`;
const REQUEST_TIMEOUT_MS = 15_000;

export async function estimateFoodVolume(imageUri: string): Promise<VolumeEstimateResult> {
    const file = new File(imageUri);

    const formData = new FormData();
    formData.append("file", file);

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
            return { success: false, error: `Server error ${response.status}: ${errorBody}` };
        }

        const data: VolumeEstimateResponse = await response.json();
        return { success: true, data };
    } catch (err: unknown) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === "AbortError") {
            return { success: false, error: "Request timed out after 15s" };
        }

        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown network error",
        };
    }
}