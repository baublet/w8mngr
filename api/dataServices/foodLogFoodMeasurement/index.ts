import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const foodLogFoodMeasurementDataService = {
  ...createDataService(getQuery, "FoodLogFoodMeasurement"),
};

export { FoodLogFoodMeasurement } from "./types";
