export type Opt<T> = T | undefined

export function flatmap<T, U> (v: Opt<T>, fn: (x: T) => Opt<U>): Opt<U> {
  return v === undefined ? undefined : fn(v)
}
export function getOrElse<T> (v: Opt<T>, fn: () => T): T {
  return v ?? fn()
}
export function ifDef<T> (v: Opt<T>, fn: (v: T) => void): void {
  if (v !== undefined) fn(v)
}
export function ifDefElse<T, U> (v: Opt<T>, defFn: (v: T) => U, elseFn: () => U): U {
  return v === undefined ? elseFn() : defFn(v)
}

export function defined<T> (arr: Array<Opt<T>>): T[] { return arr.filter(e => e !== undefined) as T[] }

export function maxByFn<T> (arr: T[], fn: (e: T) => number): Opt<T> {
  return arr.reduce<[T | undefined, number]>((max, e) => {
    const v = fn(e)
    return v > max[1] ? [e, fn(e)] : max
  }, [undefined, Number.MIN_VALUE])[0]
}

export function minByFn<T> (arr: T[], fn: (e: T) => number): Opt<T> {
  return arr.reduce<[T | undefined, number]>((max, e) => {
    const v = fn(e)
    return v < max[1] ? [e, fn(e)] : max
  }, [undefined, Number.MAX_VALUE])[0]
}
