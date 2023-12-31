import { rootService } from "./rootService.js";
import { saveMutation } from "./saveMutation.js";

export const activityLogDataService = {
  ...rootService,
  saveMutation,
};

export type { ActivityLogEntity as ActivityLog } from "./types.js";
