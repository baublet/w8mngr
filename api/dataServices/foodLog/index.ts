import { rootService } from "./rootService.js";

import { getByDay } from "./getByDay.js";
import { stats } from "./stats.js";

export const foodLogDataService = {
  ...rootService,
  getByDay,
  stats,
};

export type { FoodLogEntity } from "./types.js";
