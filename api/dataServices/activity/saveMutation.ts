import { Context } from "../../createContext";
import { ActivityInput } from "../../generated";
import { activityMuscleDataService } from "../activityMuscle";
import { rootService } from "./rootService";

export async function saveMutation(
  context: Context,
  { input, userId }: { input: ActivityInput; userId: string }
) {
  try {
    const { muscleGroups, ...activityProperties } = input;

    const upsertResults = await rootService.upsertBy(
      context,
      [{ ...activityProperties, userId }],
      ["userId"]
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

    return {
      activity: rootService.findOneOrFailBy(context, (q) =>
        q.where("id", "=", activityId).where("userId", "=", userId)
      ),
      errors: [],
    };
  } catch (error) {
    return {
      activity: undefined,
      errors: [error],
    };
  }
}
