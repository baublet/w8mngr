import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import { saveMutation } from "./saveMutation";

export const foodDataService = {
  ...createDataService(getQuery, "Food"),
  saveMutation,
};

export { FoodEntity } from "./types";
