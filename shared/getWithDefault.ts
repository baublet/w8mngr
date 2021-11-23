export function getWithDefault<T>(
  ...values: [...values: T[], defaultValue: Present<T>]
): Present<T> {
  for (const value of values) {
    if (isPresent(value)) {
      return value;
    }
  }

  throw new Error("Expected a default value, but none was present.");
}

type Present<T> = Exclude<T, null | undefined | void>;

function isPresent<T>(value: T): value is Present<T> {
  return value != null;
}
