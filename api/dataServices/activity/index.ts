import { popular } from "./popular.js";
import { rootService } from "./rootService.js";
import { saveMutation } from "./saveMutation.js";
import { stats } from "./stats/index.js";

export const activityDataService = {
  ...rootService,
  popular,
  saveMutation,
  stats,
};

export type { ActivityEntity as Activity } from "./types.js";
