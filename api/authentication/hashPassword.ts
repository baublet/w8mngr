import { createDigest } from "./createDigest.js";

export function hashPassword(
  plainTextPassword: string,
  salt: string
): Promise<string> {
  return createDigest(salt + plainTextPassword + salt);
}
