export type FoodLogEntity = {
  id: string;
  userId: string;
  day: string;
  description: string;
  calories?: number | null;
  fat?: number | null;
  carbs?: number | null;
  protein?: number | null;
};
