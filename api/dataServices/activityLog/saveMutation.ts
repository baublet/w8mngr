import { Context } from "../../createContext";
import { activityLogDataService } from "./index";
import { ActivityLogInput } from "../../graphql-types";
import { dbService } from "../../config";
import { activityDataService } from "..";
import { assertIsError } from "../../../shared";
import { doTimes, rawInputToUnit } from "../../helpers";

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

  const entries: { work?: number; reps?: number; id?: Maybe<string> }[] = [];
  for (const { reps: inputReps, work, id } of input) {
    const { reps, sets } = getRepsAndSets(inputReps);

    if (activity.type === "DISTANCE") {
      entries.push({
        id,
        work: rawInputToUnit({ work, unit: "millimeters", defaultUnit: "s" }),
      });
    } else if (activity.type === "REPETITIVE") {
      doTimes(sets, () => entries.push({ id, reps }));
    } else if (activity.type === "TIMED") {
      entries.push({
        id,
        work: rawInputToUnit({ work, unit: "grams", defaultUnit: "lbs" }),
      });
    } else if (activity.type === "WEIGHT") {
      doTimes(sets, () =>
        entries.push({
          id,
          reps: reps,
          work: rawInputToUnit({ work, unit: "grams", defaultUnit: "lbs" }),
        })
      );
    }
  }

  const db = await context.services.get(dbService);
  await db.transact();
  try {
    const upsertResults = await activityLogDataService.upsert(
      context,
      entries.map((activityLog) => ({
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

function getRepsAndSets(repsAndSets: Maybe<string> | undefined): {
  reps: number;
  sets: number;
} {
  const parts = (repsAndSets || "").split("x");

  const repsString = parts[0] || "0";
  const setsString = parts[1] || "1";

  return {
    reps: parseInt(repsString.trim(), 10),
    sets: parseInt(setsString.trim(), 10),
  };
}
