export const root3 = Math.sqrt(3);
export const root3div3 = root3/3.0;

export function defined<T>(arr: (T | undefined)[]): T[] { return arr.filter(e => e!==undefined) as T[]; }

export function maxByFn<T>(arr: T[], fn: (e: T) => number): T | undefined {
  return arr.reduce<[T | undefined, number]>((max, e) => { 
    const v = fn(e);
    return v>max[1]?[e, fn(e)]:max; 
  }, [undefined, Number.MIN_VALUE])[0];
}

export function minByFn<T>(arr: T[], fn: (e: T) => number): T | undefined {
  return arr.reduce<[T | undefined, number]>((max, e) => { 
    const v = fn(e);
    return v<max[1]?[e, fn(e)]:max; 
  }, [undefined, Number.MAX_VALUE])[0];
}

export function clamp(val: number, min: number, max: number) { return Math.max(min, Math.min(max, val)); }
export function clamp01(val: number) { return Math.max(0, Math.min(1, val)); }