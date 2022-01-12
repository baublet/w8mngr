import { createDataService } from "../createDataService";

import { getByDay } from "./getByDay";
import { stats } from "./stats";

import { getQuery } from "./query";

export const foodLogDataService = {
  ...createDataService(getQuery, "FoodLog"),
  getByDay,
  stats,
};

export { FoodLogEntity } from "./types";
