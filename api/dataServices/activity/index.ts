import { popular } from "./popular";
import { rootService } from "./rootService";
import { saveMutation } from "./saveMutation";
import { stats } from "./stats";

export const activityDataService = {
  ...rootService,
  popular,
  saveMutation,
  stats,
};

export type { ActivityEntity as Activity } from "./types";
