import { rootService } from "./rootService";

import { getByDay } from "./getByDay";
import { stats } from "./stats";

export const foodLogDataService = {
  ...rootService,
  getByDay,
  stats,
};

export { FoodLogEntity } from "./types";
