import { getQueryProvider, getQueryBuilderFactory } from "../../config";
import { FoodLogFoodMeasurement } from "./types";
import { QueryBuilderForQuery } from "../../config/db";

export const query = getQueryProvider<FoodLogFoodMeasurement>(
  "food_log_food_measurement"
);
export const getQuery = getQueryBuilderFactory<FoodLogFoodMeasurement>(
  "food_log_food_measurement"
);
export type FoodLogFoodMeasurementQueryBuilder = QueryBuilderForQuery<
  typeof query
>;
