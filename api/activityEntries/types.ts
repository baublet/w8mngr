import { ActivityType } from "api/activities/types";

export interface ActivityEntryType {
  id: number;
  user_id: number;
  activity_id: number;
  routine_id: number;
  day: number;
  reps: number;
  work: number;
  calories: number;
  created_at: string;
  updated_at: string;
}
