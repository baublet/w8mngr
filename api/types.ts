export type ReturnTypeWithErrors<T> = Error | T;

export type SomeRequired<T, TRequired extends keyof T> = Omit<T, TRequired> &
Required<Pick<T, TRequired>>;
