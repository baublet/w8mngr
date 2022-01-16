import { log } from "../config";

const cache = new Map<string, { value: any; expiry: number }>();

if (process.env.NODE_ENV !== "test") {
  const pruneInterval = setInterval(() => {
    // Prune expired tokens
    log("debug", "Pruning expired in-memory cache keys");
    const now = Date.now();
    for (const key of Array.from(cache.keys())) {
      const cacheItem = cache.get(key);
      if (cacheItem && cacheItem.expiry < now) {
        log("debug", "Pruning key " + key, { cacheItem });
        cache.delete(key);
      }
    }
  }, 60000);

  process.on("SIGINT", () => {
    clearInterval(pruneInterval);
  });
}

export const globalInMemoryCache = {
  clear: (key: string) => cache.delete(key),
  getOrSet: async <T>({
    key,
    expiry = Date.now() + 1000 * 30, // 30 seconds by default
    fn,
  }: {
    key: string;
    /**
     * Key expiry date in milliseconds
     */
    expiry?: number;
    fn: () => Promise<T>;
  }): Promise<T> => {
    const existingRecord = cache.get(key);
    if (existingRecord && existingRecord.expiry > Date.now()) {
      log("debug", `Cache hit for key ${key}`);
      return existingRecord.value;
    }

    const newValue = await fn();
    cache.set(key, {
      value: newValue,
      expiry,
    });

    return newValue;
  },
};
