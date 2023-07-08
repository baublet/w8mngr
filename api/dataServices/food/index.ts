import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";
import { popular } from "./popular";

export const foodDataService = {
  ...rootService,
  popular,
  saveMutation,
};

export { FoodEntity as FoodEntity } from "./types";
