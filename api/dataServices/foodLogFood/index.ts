import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const foodLogFoodDataService = {
  ...createDataService(getQuery, "FoodLogFood"),
};

export { FoodLogFood } from "./types";
