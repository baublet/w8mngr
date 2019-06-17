export enum ActivityTypeType {
  WEIGHTLIFTING = 0,
  TIMED = 1,
  DISTANCE = 2,
  REPETITIVE = 3
}

export interface ActivityType {
  id: number;
  user_id: number;
  name: string;
  description: string;
  exrx?: string;
  activity_type: ActivityTypeType;
  muscle_groups: string;
  calories_formula: number;
  popularity: number;
  deleted: boolean;
  intensity: number;
  created_at: string;
  updated_at: string;
}
