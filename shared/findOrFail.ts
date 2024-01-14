export function findOrFail<T extends any[]>(
  array: T,
  predicate: (arg: T[0], i: number) => boolean,
): T[number] {
  const found = array.find(predicate);
  if (!found) {
    throw new Error("Not found");
  }
  return found;
}
