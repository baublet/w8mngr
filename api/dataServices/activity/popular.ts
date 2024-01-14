import { Context } from "../../createContext.js";
import type { ActivityEntity } from "./types.js";
import { dbService, sql } from "../../config/db.js";
import { userPopularActivities } from "../../resolvers/user/popularActivities.js";
import { activityLibraryDataService } from "../activityLibrary/index.js";
import { assertIsTruthy } from "../../../shared/assertIsTruthy.js";
import { log } from "../../config/log.js";

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
      popularActivityIds.map(({ activityId }) => activityId),
    )
    .selectAll()
    .execute();

  const libraryActivitiesToFetch = activities
    .filter((a) => typeof a.activityLibraryId !== "undefined")
    .map((a) => a.id);

  const libraryActivities = await activityLibraryDataService.findBy(
    context,
    (q) => q.where("id", "in", libraryActivitiesToFetch),
  );

  if (libraryActivitiesToFetch.length > 0) {
    // Mutate the popular activities stuff
    for (const userActivity of activities) {
      if (typeof userActivity.activityLibraryId !== "undefined") {
        const activity = libraryActivities.find(
          (a) => a.id === userActivity.activityLibraryId,
        );
        if (!activity) {
          log(
            context,
            "error",
            "Invariance violation. A user activity is associated with a library activity. But the library activity does not exist.",
            {
              userActivity,
              libraryActivities,
            },
          );
          continue;
        }
        Object.assign(userActivity, activity, {
          id: userActivity.id,
          __typename: "ActivityLibraryActivity",
        });
      }
    }
  }

  return activities;
}
