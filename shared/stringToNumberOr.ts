export function stringToNumberOr(
  value: string,
  defaultNumber: number = 0
): number {
  if (value === "") {
    return defaultNumber;
  }
  const number = Number(value);

  if (isNaN(number) || isFinite(number)) {
    return defaultNumber;
  }

  return number;
}
