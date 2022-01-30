import { assertIsError } from "../../../shared";
import { dbService } from "../../config";
import { Context } from "../../createContext";
import { ActivityLogInput } from "../../graphql-types";
import { doTimes, rawInputToUnit } from "../../helpers";
import { rootService } from "./rootService";
import { activityDataService } from "..";

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
        work: rawInputToUnit({
          work,
          unit: "millimeters",
          defaultUnit: "kilometers",
        }),
      });
    } else if (activity.type === "REPETITIVE") {
      doTimes(sets, () => entries.push({ id, reps }));
    } else if (activity.type === "TIMED") {
      entries.push({
        id,
        work: rawInputToUnit({ work, unit: "seconds", defaultUnit: "seconds" }),
      });
    } else if (activity.type === "WEIGHT") {
      doTimes(sets, () =>
        entries.push({
          id,
          reps: reps,
          work: rawInputToUnit({ work, unit: "grams", defaultUnit: "pounds" }),
        })
      );
    }
  }

  const db = await context.services.get(dbService);
  await db.transact();

  try {
    const upsertResults = await rootService.upsert(
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
  if (!repsAndSets) {
    return {
      reps: 1,
      sets: 1,
    };
  }

  if (!repsAndSets.includes("x")) {
    return {
      sets: 1,
      reps: parseInt(repsAndSets.trim(), 10),
    };
  }
  const parts = (repsAndSets || "").split("x");

  const setsString = parts[0] || "0";
  const repsString = parts[1] || "1";

  return {
    reps: parseInt(repsString.trim(), 10),
    sets: parseInt(setsString.trim(), 10),
  };
}
