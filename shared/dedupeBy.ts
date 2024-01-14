export function dedupeBy<T extends Record<string, any>, Prop extends keyof T>(
  arr: T[],
  prop: Prop,
): T[] {
  return arr.filter(
    (item, index) => arr.findIndex((i) => i[prop] === item[prop]) === index,
  );
}
