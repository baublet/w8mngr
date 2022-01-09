type NestedArray<T> = Array<NestedArray<T> | T>;

export function flattenArray<T>(input: NestedArray<T>, acc: T[] = []): T[] {
  return input.reduce((_: T[], current) => {
    if (Array.isArray(current)) return flattenArray(current, acc);
    acc.push(current);
    return acc;
  }, []);
}
