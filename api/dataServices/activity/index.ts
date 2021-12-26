import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import { saveMutation } from "./saveMutation";
import { stats } from "./stats";
import { popular } from "./popular";

export const activityDataService = {
  ...createDataService(getQuery, "Activity"),
  popular,
  saveMutation,
  stats,
};

export { Activity } from "./types";
