import { Context } from "../../createContext";
import { getQuery } from "./query";
import { FoodEntity } from "./types";
import { userDataService } from "../user";
import { foodDataService } from ".";
import { findOrFail } from "../../../shared";

const POPULARITY_PERIOD_MS = 1000 * 60 * 60 * 24 * 30;

export async function popular(context: Context): Promise<FoodEntity[]> {
  const admins = await userDataService.getAdminUsers(context);
  const userId = context.getCurrentUserId(true);
  const queryFactory = await getQuery(context);
  const foodLogFoods = await queryFactory()
    .select("food_log_food.foodId")
    .count<{ foodId: string; foodCount: string }[]>("foodId", {
      as: "foodCount",
    })
    .leftJoin("food_log_food", (q) =>
      q.on("food_log_food.foodId", "=", "food.id")
    )
    .where("food.archived", "=", false)
    .andWhere((q) =>
      q.where("food.userId", "=", userId).orWhereIn("food.userId", admins)
    )
    .andWhere(
      "food_log_food.createdAt",
      ">",
      new Date(Date.now() - POPULARITY_PERIOD_MS)
    )
    .groupBy("food_log_food.foodId")
    .orderBy("foodCount", "DESC")
    .limit(25);

  const foods = await foodDataService.findBy(context, (q) =>
    q.whereIn(
      "id",
      foodLogFoods.map((f) => f.foodId)
    )
  );

  return foodLogFoods.map(({ foodId }) =>
    findOrFail(foods, (f) => f.id === foodId)
  );
}
