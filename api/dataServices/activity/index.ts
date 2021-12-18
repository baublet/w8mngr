import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const activityDataService = {
  ...createDataService(getQuery, "Activity"),
};

export { Activity } from "./types";
