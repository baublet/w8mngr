export interface UserAccountEntity {
  id: string;
  userId: string;
  source: "github" | "local";
  sourceIdentifier: string;
  passwordHash?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
