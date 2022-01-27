import bcrypt from "bcrypt";

export function doesHashMatch(
  plainTextPassword: string,
  hashedPassword: undefined | string | null
): Promise<boolean> {
  const hashedPasswordWithDefault = hashedPassword || "";
  return bcrypt.compare(plainTextPassword, hashedPasswordWithDefault);
}
