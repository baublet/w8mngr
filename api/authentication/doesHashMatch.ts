import { configService } from "../config/config.js";
import { Context } from "../createContext.js";
import { hashPassword } from "./hashPassword.js";

export async function doesHashMatch(
  context: Context,
  plainTextPassword: string,
  hashedPassword: undefined | string | null,
): Promise<boolean> {
  const salt = context.services.get(configService).get("SALT");
  const hashedPasswordWithDefault = hashedPassword || "";
  const hashPlainTextPassword = await hashPassword(plainTextPassword, salt);
  return hashPlainTextPassword === hashedPasswordWithDefault;
}
