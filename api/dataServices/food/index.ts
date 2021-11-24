import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const foodDataService = {
  ...createDataService(getQuery, "Food"),
};

export { FoodEntity } from "./types";
