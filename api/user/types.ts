export interface UserType {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  password_digest: string;
  remember_digest: string;
  reset_digest: string;
  reset_sent_at: string;
  role: string;
  preferences: string;
}
