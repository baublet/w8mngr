import bcrypt from "bcrypt";

export function doesHashMatch(
  plainTextPassword: string,
  hashedPassword: string = ""
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
