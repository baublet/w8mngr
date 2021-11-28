import omit from "lodash.omit";

export function withNumericKeys<
  T extends Record<string, any>,
  TKeys extends keyof T
>(record: T, keys: TKeys[], defaultNumber: number = 0): Omit<T, TKeys> {
  return {
    ...omit(record, ...keys),
    ...keys.reduce((numericKeyedObjects, key) => {
      numericKeyedObjects[key] = record[key]
        ? parseInt(record[key], 10)
        : defaultNumber;
      if (isNaN(numericKeyedObjects[key])) {
        numericKeyedObjects[key] = defaultNumber;
      }
      return numericKeyedObjects;
    }, {} as any),
  };
}
