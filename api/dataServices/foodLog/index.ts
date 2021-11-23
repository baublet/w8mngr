import { deleteByIds } from "./delete";
import { upsert } from "./upsert";
import { getByDay } from "./getByDay";
import { getConnection } from "./getConnection";
import { findOneOrFail } from "./findOneOrFail";

export const foodLogDataService = {
  deleteByIds,
  findOneOrFail,
  getByDay,
  getConnection,
  upsert,
};

export { FoodLogEntity } from "./types";
