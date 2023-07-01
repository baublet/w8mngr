import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";

export const activityLogDataService = {
  ...rootService,
  saveMutation,
};

export { ActivityLogEntity } from "./types";
