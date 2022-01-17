export type TokenEntity = {
  id: string;
  tokenDigest: string;
  type: "auth" | "remember" | "passwordReset" | "emailVerification";
  userAccountId: string;
  expires: Date;
  clientId: string;
};

export const TOKEN_EXPIRY_OFFSET: Record<TokenEntity["type"], number> = {
  auth: 1000 * 60 * 60 * 24 * 3, // 3 days
  passwordReset: 1000 * 60 * 60, // 1 hour
  emailVerification: 1000 * 60 * 60, // 1 hours
  remember: 1000 * 60 * 60 * 24 * 365, // 1 year
};
