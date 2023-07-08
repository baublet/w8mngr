import { getUniqueId } from "../../shared/getUniqueId";

/**
 * This is a weak approximation of a machine's fingerprint. We don't care about
 * who's using that machine, we just want to be able to associate auth tokens
 * with a particular machine per account so we can safely reuse and selectively
 * expire them.
 */
export function getClientId(request: Request): string {
  const existingClientIdentifier = request.headers.get("w8mngr-client-id");

  if (existingClientIdentifier) {
    return existingClientIdentifier;
  }

  return getUniqueId();
}
