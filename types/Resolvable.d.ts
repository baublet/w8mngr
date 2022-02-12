export type Resolvable<T> =
  | T
  | Promise<T>
  | {
      [K in keyof T]: T[K] extends object
        ?
            | T[K]
            | (() =>
                | T[K]
                | Promise<T[K]>
                | Resolvable<T[K]>
                | Promise<Resolvable<T[K]>>)
            | Resolvable<T[K]>
        : T[K] | (() => T[K] | Promise<T[K]>);
    };
