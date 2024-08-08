function compressedSigmoid(x: number): number {
    return 1 / (1 + Math.exp(-20 * (x - 0.25)))
}

/**
 * sigmoid ease in out
 */
export function easeInOut(unit_interval: number, peak_val: number): number {
    return (unit_interval <= 0.5 ? compressedSigmoid(unit_interval) : compressedSigmoid(1 - unit_interval)) * peak_val
}

export function easeIn(unit_interval: number, peak_val: number): number {
    return compressedSigmoid(unit_interval / 2) * peak_val
}

export function easeOut(unit_interval: number, peak_val: number): number {
    return compressedSigmoid((1 - unit_interval) / 2) * peak_val
}