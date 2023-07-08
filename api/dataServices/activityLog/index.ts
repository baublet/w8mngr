import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";

export const activityLogDataService = {
  ...rootService,
  saveMutation,
};

export { ActivityLog } from "./types";
