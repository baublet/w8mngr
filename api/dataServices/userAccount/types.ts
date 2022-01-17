export interface UserAccountEntity {
  id: string;
  userId: string;
  source: "github" | "local";
  sourceIdentifier: string;
  sourceData: Record<string, any>;
  passwordHash?: string;
  verified: boolean;
}
