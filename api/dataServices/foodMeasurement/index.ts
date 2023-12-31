import { deleteFoodMeasurement } from "./delete.js";
import { rootService } from "./rootService.js";

export const foodMeasurementDataService = {
  ...rootService,
  deleteFoodMeasurement,
};

export type { FoodMeasurementEntity } from "./types.js";
