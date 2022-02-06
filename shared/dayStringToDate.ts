const memoizedCache = new Map<string, Date>();

export function dayStringToDate(day: string): Date {
  const extant = memoizedCache.get(day);
  if (extant) {
    return extant;
  }

  const year = parseInt(day.substring(0, 4), 10);
  const month = parseInt(day.substring(4, 6), 10);
  const dayOfMonth = parseInt(day.substring(6, 8), 10);
  const date = new Date(year, month - 1, dayOfMonth);

  memoizedCache.set(day, date);

  return date;
}
