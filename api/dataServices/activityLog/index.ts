import { createDataService } from "../createDataService";
import { getQuery } from "./query";
import {saveMutation} from "./saveMutation"

export const activityLogDataService = {
  ...createDataService(getQuery, "ActivityLog"),
  saveMutation
};

export { ActivityLog } from "./types";
