import hash from "object-hash";

const cache = new Map<string, { value: any; expiry: number }>();

export const globalInMemoryCache = {
  clear: (key: string) => cache.delete(key),
  getOrSet: async <T>({
    key,
    expiry = Date.now() + 1000 * 30, // 30 seconds by default
    fn,
  }: {
    key: any;
    /**
     * Key expiry date in milliseconds
     */
    expiry?: number;
    fn: () => Promise<T>;
  }): Promise<T> => {
    const keyHash = hash({ key });

    const existingRecord = cache.get(keyHash);
    const now = Date.now();
    if (existingRecord && existingRecord.expiry + now > now) {
      return existingRecord.value;
    }

    try {
      const newValue = await fn();
      cache.set(keyHash, {
        value: newValue,
        expiry,
      });

      return newValue;
    } catch (error) {
      throw error;
    }
  },
};
