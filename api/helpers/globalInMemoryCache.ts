import hash from "object-hash";

import { log } from "../config/log";
import { registerRecurringTask } from "./registerRecurringTask";

const cache = new Map<string, { value: any; expiry: number }>();

registerRecurringTask({
  taskKey: "pruneGlobalInMemoryCache",
  task: async () => {
    // Prune expired tokens
    log("debug", "Pruning expired in-memory cache keys");
    const now = Date.now();
    for (const key of Array.from(cache.keys())) {
      const cacheItem = cache.get(key);
      if (cacheItem && cacheItem.expiry < now) {
        cache.delete(key);
      }
    }
  },
  intervalMs: 30000,
});

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
