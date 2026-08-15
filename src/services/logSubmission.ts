import {estimateFoodVolume, JobPollStatus} from "@/services/volumeEstimation";
import {kcalFromEnergyKj} from "@/utils/nutrition";

type UpdateLog = (id: string, patch: Partial<Log>) => void;

export function submitLogEstimate(
    id: string,
    imageUri: string,
    description: string,
    updateLog: UpdateLog,
    onConfigError?: () => void
) {
    const handleStatusUpdate = (status: JobPollStatus) => {
        updateLog(id, { status: status });
    };

    estimateFoodVolume(imageUri, description, "size_prior", handleStatusUpdate).then((result) => {
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
    });
}