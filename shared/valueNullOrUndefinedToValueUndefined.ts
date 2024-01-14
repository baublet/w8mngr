export function valueNullOrUndefinedToValueUndefined<TOriginal>(
  value: TOriginal,
): Exclude<TOriginal, null> | undefined {
  if (value === null) {
    return undefined;
  } else {
    return value as Exclude<TOriginal, null> | undefined;
  }
}
