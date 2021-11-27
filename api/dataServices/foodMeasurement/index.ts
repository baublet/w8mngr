import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const foodDataService = {
  ...createDataService(getQuery, "FoodMeasurement"),
};

export { FoodMeasurement } from "./types";
