/**
 * Compile-time artifacts for the client
 */
export function getConfigValue<T extends keyof typeof CONFIG_VALUES>(
  key: T
): typeof CONFIG_VALUES[T] {
  return CONFIG_VALUES[key];
}

const CONFIG_VALUES = {
  GRAPHQL_ENDPOINT: "http://127.0.0.1:8787/",
  MINIMUM_REQUEST_MS: 50,
} as const;
