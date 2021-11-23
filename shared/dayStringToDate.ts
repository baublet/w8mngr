export function dayStringToDate(day: string): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setFullYear(parseInt(day.substr(0, 4), 10));
  date.setMonth(parseInt(day.substr(4, 2), 10) - 1);
  date.setDate(parseInt(day.substr(6, 2), 10));
  return date;
}
