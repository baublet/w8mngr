export type ReturnTypeWithErrors<T> = Error | T;

export type SomeRequired<T, TRequired extends keyof T> = Omit<T, TRequired> &
  Required<Pick<T, TRequired>>;

export type Maybe<T> = T | undefined | null;

export type DeepRequired<T> = Exclude<
  {
    [K in keyof T]: Exclude<Required<DeepRequired<T[K]>>, null | undefined>;
  },
  null | undefined
>;

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
