import { getQueryBuilderFactory } from "../../config";
import { FoodLogFoodMeasurement } from "./types";

export const getQuery = getQueryBuilderFactory<FoodLogFoodMeasurement>(
  "food_log_food_measurement"
);
