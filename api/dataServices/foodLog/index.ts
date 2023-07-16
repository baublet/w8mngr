import { rootService } from "./rootService";

import { getByDay } from "./getByDay";
import { stats } from "./stats";

export const foodLogDataService = {
  ...rootService,
  getByDay,
  stats,
};

export type { FoodLogEntity } from "./types";
