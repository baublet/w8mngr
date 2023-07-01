import { Context } from "../../createContext";
import { rootService } from "./rootService";
import { FoodLogEntity } from "./types";

export async function getByDay(
  context: Context,
  day: string
): Promise<FoodLogEntity[]> {
  const userId = context.getCurrentUserId(true);
  return rootService.findBy(context, (q) =>
    q.where("userId", "=", userId).where("day", "=", day)
  );
}
