import { Context } from "../../createContext.js";
import { rootService } from "./rootService.js";
import { FoodLogEntity } from "./types.js";

export async function getByDay(
  context: Context,
  day: string,
): Promise<FoodLogEntity[]> {
  const userId = context.getCurrentUserId(true);
  return rootService.findBy(context, (q) =>
    q.where("userId", "=", userId).where("day", "=", day),
  );
}
