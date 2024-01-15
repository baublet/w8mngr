import { assertIsError } from "../../../shared/assertIsError.js";
import { Maybe } from "../../../shared/types.js";
import { Context } from "../../createContext.js";
import { ActivityLogInput } from "../../generated.js";
import { doTimes } from "../../helpers/doTimes.js";
import { rawInputToUnit } from "../../helpers/rawInputToUnit.js";
import { rootService } from "./rootService.js";
import { activityDataService } from "../activity/index.js";
import { promiseHandler } from "../../../shared/promiseHandler.js";
import { activityLibraryDataService } from "../activityLibrary/index.js";
import { getUniqueId } from "../../../shared/getUniqueId.js";

export async function saveMutation(
  context: Context,
  {
    input,
    userId,
    day,
    activityId,
    activityLibraryActivityId,
  }: {
    input: ActivityLogInput[];
    userId: string;
    activityId?: string | null;
    activityLibraryActivityId?: string | null;
    day: string;
  },
): Promise<Error | undefined> {
  if (!activityId && !activityLibraryActivityId) {
    return new Error(
      "Either activityId or activityLibraryActivityId must be provided. Received: " +
        JSON.stringify({ activityId, activityLibraryActivityId }),
    );
  }

  const activity = await promiseHandler(async () => {
    if (activityId) {
      return activityDataService.findOneOrFail(context, activityId);
    }

    if (activityLibraryActivityId) {
      return activityLibraryDataService.copyToActivity(context, {
        activityLibraryActivityId,
        userId,
      });
    }

    throw new Error(
      "Unreachable code: activityId and activityLibraryActivityId were both falsy",
    );
  });

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
        }),
      );
    }
  }

  try {
    const upsertResults = await rootService.upsert(
      context,
      entries.map((activityLog) => ({
        activityId: activity.id,
        userId,
        day,
        ...activityLog,
      })),
      (q) => q.where("userId", "=", userId),
    );

    if (!activityId) {
      const error = new Error(
        `Unknown error upserting activity log. Expected an upsert result. Instead received ${JSON.stringify(
          upsertResults,
        )}`,
      );
      return error;
    }

    return undefined;
  } catch (error) {
    assertIsError(error);
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
