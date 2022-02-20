export function stringToNumberOr<T>(
  value: string,
  defaultValue: T
): T | number {
  if (value === "") {
    return defaultValue;
  }

  if (typeof defaultValue !== "number") {
    return defaultValue;
  }
  const number = Number(value);

  if (isNaN(number) || isFinite(number)) {
    return defaultValue;
  }

  return defaultValue;
}
