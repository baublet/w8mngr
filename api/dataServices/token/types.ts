import { InsertableDatabaseRecord, Database } from "../../config/db";

export type TokenEntity = InsertableDatabaseRecord<Database["token"]>;

export const tokenTypes = [
  "auth",
  "remember",
  "passwordReset",
  "emailVerification",
  "emailLogin",
] as const;

export type TokenTypes = typeof tokenTypes[number];

export function assertIsTokenType(value: string): asserts value is TokenTypes {
  if (!tokenTypes.includes(value as TokenTypes)) {
    throw new Error(`Invalid token type: ${value}`);
  }
}

export const TOKEN_EXPIRY_OFFSET: Record<TokenTypes, number> = {
  auth: 1000 * 60 * 60 * 24 * 3, // 3 days
  passwordReset: 1000 * 60 * 60, // 1 hour
  emailVerification: 1000 * 60 * 60, // 1 hours
  emailLogin: 1000 * 60 * 30, // 30 minutes
  remember: 1000 * 60 * 60 * 24 * 365, // 1 year
};
