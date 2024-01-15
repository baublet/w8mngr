import { Context } from "../../createContext.js";
import type { ActivityLibraryEntity } from "./types.js";
import { dbService } from "../../config/db.js";
import { rootService } from "./rootService.js";
import { getUniqueId } from "../../../shared/getUniqueId.js";
import { activityDataService, Activity } from "../activity/index.js";

/**
 * Idempotent function that copies the most popular activity library items to
 * the user's activity list, but only if it doesn't already exist.
 */
export async function copyToActivity(
  context: Context,
  {
    activityLibraryActivityId,
    userId,
  }: {
    userId: string;
    activityLibraryActivityId: string;
  },
): Promise<Activity> {
  const libraryActivity = await rootService.findOneOrFail(
    context,
    activityLibraryActivityId,
  );

  const activityFromThatLibraryActivity = await activityDataService.findOneBy(
    context,
    (q) =>
      q
        .where("activityLibraryId", "=", activityLibraryActivityId)
        .where("userId", "=", userId)
        .where("archived", "=", 0),
  );

  if (activityFromThatLibraryActivity) {
    return activityFromThatLibraryActivity;
  }

  const created = await activityDataService.create(context, [
    {
      ...libraryActivity,
      id: getUniqueId(),
      userId,
    },
  ]);

  return created[0];
}
