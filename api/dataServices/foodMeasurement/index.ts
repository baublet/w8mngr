import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const foodMeasurementDataService = {
  ...createDataService(getQuery, "FoodMeasurement"),
};

export { FoodMeasurement } from "./types";
