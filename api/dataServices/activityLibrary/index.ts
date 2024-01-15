import { rootService } from "./rootService.js";
import { popular } from "./popular.js";
import { copyToActivity } from "./copyToActivity.js";

export const activityLibraryDataService = {
  ...rootService,
  copyToActivity,
  popular,
};

export type { ActivityLibraryEntity } from "./types.js";
