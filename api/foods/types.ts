export interface FoodEntryType {
  id: number;
  description: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  day: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  [key: string]: string | number;
}

export interface FoodType {
  id: number;
  name: string;
  description: string;
  popularity: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}
