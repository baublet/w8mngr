export interface UserAccountEntity {
  id: string;
  userId: string;
  source: "github";
  sourceIdentifier: string;
  sourceData: Record<string, any>
}