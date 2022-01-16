export function filterOutErrors<T extends any>(arr: T[]): Exclude<T, Error>[] {
  return arr.filter((item) => item instanceof Error === false) as Exclude<
    T,
    Error
  >[];
}
