import { deleteByIds } from "./delete";
import { upsert } from "./upsert";
import { getByDay } from "./getByDay";
import { getConnection } from "./getConnection";

export const foodLogDataService = {
  deleteByIds,
  getByDay,
  getConnection,
  upsert,
};

export { FoodLogEntity } from "./types";
