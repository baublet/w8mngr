export type ReturnTypeWithErrors<T> = Error | T;

export function assertIsError(error: unknown): asserts error is Error {
  if (error instanceof Error) {
    return;
  }
  throw new Error(
    `Non-error object thrown. Type: ${typeof error}. Value: ${error}`
  );
}
