import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

export interface FoodNutrients {
    energy_kj: number | null;
    protein_g: number | null;
    fat_g: number | null;
    carbs_g: number | null;
    fibre_g: number | null;
    sodium_mg: number | null;
}

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

export type VolumeEstimateResult = { success: true; data: VolumeEstimateResponse } | { success: false; error: string };

const VOLUME_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/estimate-volume`;
const REQUEST_TIMEOUT_MS = 60_000; // 60 secs

export type ScaleRef = "utensil" | "size_prior" | "checkerboard" | "auto";

export async function estimateFoodVolume(
    imageUri: string,
    description: string,
    scaleRef: ScaleRef = "size_prior"
): Promise<VolumeEstimateResult> {
    const file = new File(imageUri);

    const formData = new FormData();
    formData.append("file", file);
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
            return { success: false, error: `Server error ${response.status}: ${errorBody}` };
        }

        const data: VolumeEstimateResponse = await response.json();
        return { success: true, data };
    } catch (err: unknown) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === "AbortError") {
            return { success: false, error: "Request timed out after 60s" };
        }

        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown network error",
        };
    }
}