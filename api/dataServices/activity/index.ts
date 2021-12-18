import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import {saveMutation} from "./saveMutation"

export const activityDataService = {
  ...createDataService(getQuery, "Activity"),
  saveMutation
};

export { Activity } from "./types";
