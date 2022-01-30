import { getQueryBuilderFactory } from "../../config/db";
import { FoodMeasurement } from "./types";

export const getQuery =
  getQueryBuilderFactory<FoodMeasurement>("food_measurement");
