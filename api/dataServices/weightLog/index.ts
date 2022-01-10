import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import { saveMutation } from "./saveMutation";

export const weightLogDataService = {
  ...createDataService(getQuery, "WeightLog"),
  saveMutation,
};

export { WeightLog } from "./types";
