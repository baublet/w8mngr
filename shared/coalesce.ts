type AOrB<A, B> = A extends undefined | null ? B : A;
type Truthy<T> = Exclude<T, undefined | null>;

export function coalesce<A, B extends Truthy<A>>(
  ...args: [A, B]
): Exclude<AOrB<A, B>, never[]> {
  for (const arg of args) {
    const anyArg: any = arg;
    if (
      anyArg !== undefined &&
      anyArg !== null &&
      anyArg !== "" &&
      anyArg !== false
    ) {
      return arg as any;
    }
  }
  return args[args.length - 1] as any;
}

export const or = coalesce;
