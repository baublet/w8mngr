import { Context } from "../../createContext";
import { FoodLogEntity } from "./types";
import { query } from "./query";
import { assertIsTruthy } from "../../../shared";

export async function getByDay(
  context: Context,
  day: string
): Promise<FoodLogEntity[]> {
  const userId = context.getCurrentUserId();
  return query(context, (q) => {
    q.select("*").where("userId", "=", userId).andWhere("day", "=", day);
    return q;
  });
}
