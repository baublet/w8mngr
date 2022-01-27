import crypto from "crypto";

import { config } from "../config";

export function createDigest(subject: string = ""): string {
  const hash = crypto.createHmac("sha512", config.get("SALT"));
  hash.update(subject);
  return hash.digest("hex");
}
