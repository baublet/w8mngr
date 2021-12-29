import { createDataService } from "../createDataService";

import { deleteByIds } from "./delete";
import { upsert } from "./upsert";
import { getByDay } from "./getByDay";
import { getConnection } from "./getConnection";
import { findOneOrFail } from "./findOneOrFail";

import { getQuery } from "./query";

export const foodLogDataService = {
  ...createDataService(getQuery, "FoodLog"),
  deleteByIds,
  findOneOrFail,
  getByDay,
  getConnection,
  upsert,
};

export { FoodLogEntity } from "./types";
