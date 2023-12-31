import { rootService } from "./rootService.js";
import { saveMutation } from "./saveMutation.js";
import { popular } from "./popular.js";

export const foodDataService = {
  ...rootService,
  popular,
  saveMutation,
};

export type { FoodEntity as FoodEntity } from "./types.js";
