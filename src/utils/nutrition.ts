export function kcalFromEnergyKj(energyKj: number | null | undefined): number | null {
    if (energyKj == null) return null;
    return Math.round(energyKj / 4.184);
}
