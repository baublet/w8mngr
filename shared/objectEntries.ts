export function objectEntries<T extends {}>(
  subject: T
): { [K in keyof T]: [K, T[K]] }[keyof T][] {
  return Object.entries(subject) as { [K in keyof T]: [K, T[K]] }[keyof T][];
}