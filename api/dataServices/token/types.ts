export type TokenEntity = {
  id: string;
  tokenDigest: string;
  type: "auth" | "remember" | "forgot";
  userAccountId: string;
  expires: Date;
  clientId: string;
};

export const TOKEN_EXPIRY_OFFSET: Record<TokenEntity["type"], number> = {
  auth: 1000 * 60 * 60 * 24 * 3, // 3 days
  forgot: 1000 * 60 * 60, // 1 hour
  remember: 1000 * 60 * 60 * 24 * 365, // 1 year
};
