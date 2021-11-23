import { Context } from "../../createContext";
import { errors } from "../../helpers";
import { FoodLogEntity} from "./types";
import { query, FoodLogQueryBuilder } from "./query";

export async function findOneOrFail(
  context: Context,
  where: (whereQuery: FoodLogQueryBuilder) => Promise<void> | void
): Promise<FoodLogEntity> {
  const results = await query(context, async (query) => {
    query.select("*");
    await where(query);
    query.limit(1);
    return query;
  });
  if (!results[0]) {
    throw new errors.NotFoundError("FoodLog.findOneOrFail: food log not found");
  }
  return results[0];
}
