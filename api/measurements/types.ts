export interface MeasurementType {
  id: number;
  food_id: number;
  amount: number;
  unit: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  popularity: number;
  created_at: string;
  updated_at: string;
}
