export type DeepRequired<T> = Exclude<
  {
    [K in keyof T]: Exclude<Required<DeepRequired<T[K]>>, null | undefined>;
  },
  null | undefined
>;
