import { Context } from "../../createContext";
import { activityLogDataService } from "./index";
import { ActivityLogInput } from "../../graphql-types";
import { dbService } from "../../config";
import { activityDataService } from "..";
import { assertIsError } from "../../../shared";

export async function saveMutation(
  context: Context,
  {
    input,
    userId,
    day,
    activityId,
  }: {
    input: ActivityLogInput[];
    userId: string;
    activityId: string;
    day: string;
  }
): Promise<Error | undefined> {
  const activity = await activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", activityId)
  );

  const db = await context.services.get(dbService);
  await db.transact();
  try {
    const upsertResults = await activityLogDataService.upsert(
      context,
      input.map((activityLog) => ({
        activityId: activity.id,
        userId,
        day,
        ...activityLog,
      })),
      (q) => q.where("userId", "=", userId)
    );

    if (!activityId) {
      const error = new Error(
        `Unknown error upserting activity log. Expected an upsert result. Instead received ${JSON.stringify(
          upsertResults
        )}`
      );
      await db.rollback(error);
      return error;
    }

    await db.commit();
    return undefined;
  } catch (error) {
    assertIsError(error);
    await db.rollback(error);
    return error;
  }
}
