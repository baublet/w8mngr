import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import {deleteFoodMeasurement} from "./delete"

export const foodMeasurementDataService = {
  ...createDataService(getQuery, "FoodMeasurement"),
  deleteFoodMeasurement
};

export { FoodMeasurement } from "./types";
