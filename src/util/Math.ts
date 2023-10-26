export function clamp (val: number, min: number, max: number): number { return Math.max(min, Math.min(max, val)) }
export function clamp01 (val: number): number { return Math.max(0, Math.min(1, val)) }
export function isEven (x: number): boolean { return (x & 1) === 0 }
