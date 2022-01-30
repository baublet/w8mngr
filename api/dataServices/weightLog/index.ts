import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";

export const weightLogDataService = {
  ...rootService,
  saveMutation,
};

export { WeightLog } from "./types";
