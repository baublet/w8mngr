import { getUniqueId } from "../../../shared/getUniqueId.js";
import { Context } from "../../createContext.js";
import { ActivityInput } from "../../generated.js";
import { activityMuscleDataService } from "../activityMuscle/index.js";
import { rootService } from "./rootService.js";

export async function saveMutation(
  context: Context,
  { input, userId }: { input: ActivityInput; userId: string }
) {
  try {
    const { muscleGroups, ...activityProperties } = input;

    activityProperties.id = activityProperties.id || getUniqueId();

    const upsertResults = await rootService.upsertBy(
      context,
      [{ ...activityProperties, userId }],
      ["id"]
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
