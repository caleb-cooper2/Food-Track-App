import {VolumeEstimateResult} from "@/services/volumeEstimation";
import {kcalFromEnergyKj} from "@/utils/nutrition";

type UpdateLog = (id: string, patch: Partial<Log>) => void;

export function applyEstimateResult(
    id: string,
    result: VolumeEstimateResult,
    updateLog: UpdateLog,
    onConfigError?: () => void
) {
    console.debug('[applyEstimateResult] applying', { id, result });
    if (result.success) {
        const nutrients = result.data.diagnostics.total_nutrients;
        updateLog(id, {
            status: 'success',
            kcal: kcalFromEnergyKj(nutrients?.energy_kj),
            nutrients: nutrients ?? null,
            total_mass_g: result.data.mass_g,
            confidence: result.data.confidence,
            items_with_nutrients: result.data.diagnostics.items_with_nutrients,
            items: result.data.diagnostics.items,
            failureKind: null
        });
        return;
    }

    console.debug('[applyEstimateResult] failed result for', id, result);
    updateLog(id, {
        status: 'failed',
        kcal: null,
        nutrients: null,
        total_mass_g: null,
        confidence: null,
        items_with_nutrients: null,
        items: null,
        failureKind: result.kind
    });

    if (result.kind === 'config') {
        onConfigError?.();
    }
}