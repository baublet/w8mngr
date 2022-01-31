import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const activityMuscleDataService = {
  ...createDataService(getQuery, "ActivityMuscle"),
};

export { ActivityMuscle } from "./types";
