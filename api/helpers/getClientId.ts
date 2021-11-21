import { Request, Response } from "express";
import { ulid } from "ulid";

/**
 * This is a weak approximation of a machine's fingerprint. We don't care about
 * who's using that machine, we just want to be able to associate auth tokens
 * with a particular machine per account so we can safely reuse and selectively
 * expire them.
 */
export function getClientId(req: Request, res: Response): string {
  const existingClientIdentifier: string | undefined =
    req.cookies.w8mngrClientId;

  if (existingClientIdentifier) {
    return existingClientIdentifier;
  }

  const clientIdentifier = ulid();
  res.cookie("w8mngrClientId", clientIdentifier, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10), // 10 year expiry for these
  });

  return clientIdentifier;
}
