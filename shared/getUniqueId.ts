import { ulidFactory } from "ulid-workers";

const ulid = ulidFactory();

/**
 * Wrapped in case I want to move providers again. Cloudflare workers has a limited
 * subset of node APIs that breaks the ulid package. So we wrap it here if we ever
 * want to move somewhere that supports native ULIDs; or some other format.
 */
export function getUniqueId() {
  return ulid();
}
