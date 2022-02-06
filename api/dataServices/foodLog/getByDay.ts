import { Context } from "../../createContext";
import { getQuery } from "./query";
import { FoodLogEntity } from "./types";

export async function getByDay(
  context: Context,
  day: string
): Promise<FoodLogEntity[]> {
  const userId = context.getCurrentUserId(true);
  const queryFactory = await getQuery(context);
  return queryFactory()
    .select("*")
    .where("userId", "=", userId)
    .andWhere("day", "=", day);
}
