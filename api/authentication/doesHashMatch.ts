import { hashPassword } from "./hashPassword";

export async function doesHashMatch(
  plainTextPassword: string,
  hashedPassword: undefined | string | null
): Promise<boolean> {
  const hashedPasswordWithDefault = hashedPassword || "";
  const hashPlainTextPassword = await hashPassword(plainTextPassword);
  return hashPlainTextPassword === hashedPasswordWithDefault;
}
