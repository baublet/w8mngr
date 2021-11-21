import crypto from "crypto";

const SALT = process.env.PASSWORD_SALT || "Don't use the default, please!";

export function createDigest(subject: string = ""): string {
  const hash = crypto.createHmac("sha512", SALT);
  hash.update(subject);
  return hash.digest("hex");
}
