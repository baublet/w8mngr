import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import { saveMutation } from "./saveMutation";
import { stats } from "./stats";

export const activityDataService = {
  ...createDataService(getQuery, "Activity"),
  saveMutation,
  stats,
};

export { Activity } from "./types";
