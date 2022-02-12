import { dbService } from "../../config/db";
import { Context } from "../../createContext";
import { ActivityInput } from "../../generated";
import { activityMuscleDataService } from "../activityMuscle";
import { rootService } from "./rootService";

export async function saveMutation(
  context: Context,
  { input, userId }: { input: ActivityInput; userId: string }
) {
  const db = await context.services.get(dbService);
  await db.transact();
  try {
    const { muscleGroups, ...activityProperties } = input;

    const upsertResults = await rootService.upsert(
      context,
      [{ ...activityProperties, userId }],
      (q) => q.where("userId", "=", userId)
    );
    const activityId = upsertResults[0].id;

    if (!activityId) {
      throw new Error(
        `Unknown error upserting activity. Expected an upsert result. Instead received ${JSON.stringify(
          upsertResults
        )}`
      );
    }

    if (muscleGroups) {
      await activityMuscleDataService.deleteBy(context, (query) =>
        query.where("activityId", "=", activityId)
      );
      await activityMuscleDataService.upsert(
        context,
        muscleGroups.map((muscle) => ({ activityId, muscle }))
      );
    }

    await db.commit();
    return {
      activity: rootService.findOneOrFail(context, (q) =>
        q.where("id", "=", activityId).andWhere("userId", "=", userId)
      ),
      errors: [],
    };
  } catch (error) {
    await db.rollback(error);
    return {
      activity: undefined,
      errors: [error],
    };
  }
}
