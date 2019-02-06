export interface UserType {
  id: Number;
  email: String;
  created_at: String;
  updated_at: String;
  password_digest: String;
  remember_digest: String;
  reset_digest: String;
  reset_sent_at: String;
  role: String;
  preferences: String;
}
