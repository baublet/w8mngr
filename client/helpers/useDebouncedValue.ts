import { useEffect, useState } from "react";

export function useDebouncedValue<T>(
  value: T,
  debounceIntervalMs: number = 750
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceIntervalMs);
    return () => clearTimeout(timeout);
  }, [value]);

  return debouncedValue;
}
