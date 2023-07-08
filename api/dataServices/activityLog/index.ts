import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";

export const activityLogDataService = {
  ...rootService,
  saveMutation,
};

export { ActivityLogEntity as ActivityLog } from "./types";
