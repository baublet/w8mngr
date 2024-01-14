import { Context } from "../../createContext.js";
import { FoodEntity } from "./types.js";
import { userDataService } from "../user/index.js";
import { rootService } from "./rootService.js";
import { dbService } from "../../config/db.js";

const POPULARITY_PERIOD_MS = 1000 * 60 * 60 * 24 * 30;

export async function popular(context: Context): Promise<FoodEntity[]> {
  const admins = await userDataService.getAdminUsers(context);
  const userId = context.getCurrentUserId(true);
  const query = context.services.get(dbService)("W8MNGR_1");
  const foodLogFoods = await query
    .selectFrom("foodLogFood")
    .innerJoin("foodLog", "foodLog.id", "foodLogFood.foodId")
    .select("foodId")
    .select(({ fn }) => fn.count("foodId").as("foodCount"))
    .where("foodId", "in", (q) =>
      q
        .selectFrom("food")
        .select("id")
        .where("archived", "=", 0)
        .where((q) =>
          q.or([
            q("userId", "=", userId),
            q(
              "userId",
              "in",
              admins.map((a) => a.id),
            ),
          ]),
        ),
    )
    .where(
      "createdAt",
      ">",
      new Date(Date.now() - POPULARITY_PERIOD_MS).getMilliseconds(),
    )
    .groupBy("foodId")
    .orderBy("foodCount", "desc")
    .limit(25)
    .execute();

  return rootService.findBy(context, (q) =>
    q.where(
      "id",
      "in",
      foodLogFoods.map((f) => f.foodId),
    ),
  );
}
