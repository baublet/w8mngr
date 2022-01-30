import { getQueryBuilderFactory } from "../../config";
import { FoodMeasurement } from "./types";

export const getQuery =
  getQueryBuilderFactory<FoodMeasurement>("food_measurement");
