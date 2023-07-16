import { Context } from "../../createContext";
import type { ActivityEntity } from "./types";
import { dbService, sql } from "../../config/db";

export async function popular(context: Context): Promise<ActivityEntity[]> {
  const userId = context.getCurrentUserId(true);
  const db = context.services.get(dbService)("W8MNGR_1");

  const popularActivityIds: { activityId: string }[] = await db
    .selectFrom("activityLog")
    .select("activityId")
    .select(({ fn }) => fn.count("id").as("activityCount"))
    .where("userId", "=", userId)
    .where("archived", "=", 0)
    .groupBy("activityId")
    .orderBy(sql`"activityCount" DESC`)
    .limit(10)
    .execute();

  if (popularActivityIds.length === 0) {
    return [];
  }

  const activities = await db
    .selectFrom("activity")
    .where(
      "id",
      "in",
      popularActivityIds.map(({ activityId }) => activityId)
    )
    .selectAll()
    .execute();

  return activities;
}
