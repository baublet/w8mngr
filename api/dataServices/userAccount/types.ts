export interface UserAccountEntity {
  id: string;
  userId: string;
  source: "github" | "local";
  sourceIdentifier: string;
  sourceData: Record<string, any>;
  passwordDigest?: string;
  tokenDigest?: string;
  rememberTokenDigest?: string;
}
