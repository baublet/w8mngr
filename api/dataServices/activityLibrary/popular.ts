import { Context } from "../../createContext.js";
import type { ActivityLibraryEntity } from "./types.js";
import { dbService } from "../../config/db.js";

export async function popular(
  context: Context
): Promise<ActivityLibraryEntity[]> {
  const db = context.services.get(dbService)("W8MNGR_1");

  const popularActivityLibraryActivities = await db
    .selectFrom("activityLibrary")
    .selectAll()
    .orderBy("popularity desc")
    .limit(10)
    .execute();

  return popularActivityLibraryActivities;
}
