export function assertIsTruthy<T extends any>(
  subject: T
): asserts subject is Exclude<T, undefined | null | "" | false | 0> {
  if (subject) {
    return;
  }

  throw new Error(`Invariance violation. Expected subject ${subject} to be truthy!`);
}
