import { deleteFoodMeasurement } from "./delete";
import { rootService } from "./rootService";

export const foodMeasurementDataService = {
  ...rootService,
  deleteFoodMeasurement,
};

export type { FoodMeasurementEntity } from "./types";
