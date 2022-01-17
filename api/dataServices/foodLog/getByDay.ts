import { Context } from "../../createContext";
import { FoodLogEntity } from "./types";
import { getQuery } from "./query";

export async function getByDay(
  context: Context,
  day: string
): Promise<FoodLogEntity[]> {
  const userId = context.getCurrentUserId();
  const queryFactory = await getQuery(context);
  return queryFactory()
    .select("*")
    .where("userId", "=", userId)
    .andWhere("day", "=", day);
}
