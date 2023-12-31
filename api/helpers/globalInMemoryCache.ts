import hash from "object-hash";
import { log } from "../config/log.js";

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
      log("debug", `Cache hit for key ${JSON.stringify(key)}`);
      return existingRecord.value;
    }

    try {
      const newValue = await fn();
      cache.set(keyHash, {
        value: newValue,
        expiry,
      });
      log(
        "debug",
        `Cache miss for key ${JSON.stringify(
          key
        )}. Saving to cache for ${expiry}ms`
      );

      return newValue;
    } catch (error) {
      log("error", "getOrSet cache function error", {
        error,
      });
      throw error;
    }
  },
};
