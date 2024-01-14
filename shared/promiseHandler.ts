export function promiseHandler<T extends AnyAsyncFunction>(
  fn: T,
): Promise<AsyncFunctionEndReturn<T>> {
  return new Promise((resolve, reject) => {
    try {
      fn()
        .then((result) => resolve(result as AsyncFunctionEndReturn<T>))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

type AnyAsyncFunction = () => Promise<unknown>;
type AsyncFunctionEndReturn<T extends AnyAsyncFunction> =
  T extends () => Promise<infer U> ? U : never;
