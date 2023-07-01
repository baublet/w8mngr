import { config } from "../config/config";
import { createDigest } from "./createDigest";

export function hashPassword(plainTextPassword: string): Promise<string> {
  const salt = config.get("SALT");
  return createDigest(salt + plainTextPassword + salt);
}
