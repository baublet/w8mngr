import { getQueryBuilderFactory } from "../../config/db";
import { FoodLogFoodMeasurement } from "./types";

export const getQuery = getQueryBuilderFactory<FoodLogFoodMeasurement>(
  "food_log_food_measurement"
);
