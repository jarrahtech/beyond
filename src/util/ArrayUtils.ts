export function append<T> (arr: T[], ...item: T[]): T[] {
  arr.push(...item)
  return arr
}
