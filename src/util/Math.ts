export function clamp(val: number, min: number, max: number) { return Math.max(min, Math.min(max, val)); }
export function clamp01(val: number) { return Math.max(0, Math.min(1, val)); }