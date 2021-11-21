export function filterFalsyKeys<T>(
  arr: T[]
): Exclude<T, undefined | null | "" | false>[] {
  return arr.filter(Boolean) as Exclude<T, undefined | null | "" | false>[];
}
