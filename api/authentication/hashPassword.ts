import { config } from "../config/config.js";
import { createDigest } from "./createDigest.js";

export function hashPassword(plainTextPassword: string): Promise<string> {
  const salt = config.get("SALT");
  return createDigest(salt + plainTextPassword + salt);
}
