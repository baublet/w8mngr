export function assertIsTruthy<T extends any>(
  subject: T,
  message: string = `Invariance violation. Expected subject ${subject} to be truthy!`
): asserts subject is Exclude<T, undefined | null | "" | false | 0> {
  if (subject) {
    return;
  }

  throw new Error(message);
}
