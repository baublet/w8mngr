import { MeasurementType } from "api/measurements/types";

export interface FoodType {
  id: number;
  name: string;
  description: string;
  popularity: number;
  user_id: number;
  measurements?: Array<MeasurementType>;
  created_at: string;
  updated_at: string;
}
