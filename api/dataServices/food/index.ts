import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";

export const foodDataService = {
  ...rootService,
  saveMutation,
};

export { FoodEntity } from "./types";
