import { flattenArray } from "../../../../shared/flattenArray";
import { Context } from "../../../createContext.js";
import { dbService } from "../../../config/db.js";
import { ActivityType, ActivityVisualizationInput } from "../../../generated.js";
import { getDateRangeWithDefault } from "../../../helpers/getDateRangeWithDefault.js";
import { globalInMemoryCache } from "../../../helpers/globalInMemoryCache.js";
import { numberToContextualUnit } from "../../../helpers/numberToContextualUnit.js";
import { ActivityLogEntity } from "../../activityLog/types.js";

export function getVisualizationDataResolvers({
  activityId,
  activityType,
  userId,
  context,
}: {
  activityId: string;
  activityType: ActivityType;
  userId: string;
  context: Context;
}): any {
  return {
    maximumWork: getSetHandlerByDay({
      key: "maximumWork",
      context,
      accumulator: (logs) => {
        const work = logs.reduce((acc, log) => {
          const work = log.work || 0;
          return work > acc ? work : acc;
        }, 0);
        return {
          work,
          workLabel: numberToContextualUnit(context, {
            activityType,
            work,
          }),
          day: logs[0].day,
        };
      },
      activityId,
      userId,
    }),
    averageWork: getSetHandlerByDay({
      key: "averageWork",
      context,
      accumulator: (logs) => {
        const work =
          logs.reduce((acc, log) => acc + (log.work || 0), 0) / logs.length;
        return {
          work,
          workLabel: numberToContextualUnit(context, {
            activityType,
            work,
          }),
          day: logs[0].day,
        };
      },
      activityId,
      userId,
    }),
    maximumReps: getSetHandlerByDay({
      key: "maximumReps",
      context,
      accumulator: (logs) => ({
        work: logs.reduce(
          (acc, log) => ((log.work || 0) > acc ? log.reps || 0 : acc),
          0
        ),
        day: logs[0].day,
      }),
      activityId,
      userId,
    }),
    averageReps: getSetHandlerByDay({
      key: "averageReps",
      context,
      accumulator: (logs) => ({
        work: logs.reduce((acc, log) => acc + (log.work || 0), 0) / logs.length,
        day: logs[0].day,
      }),
      activityId,
      userId,
    }),
    scatterPlot: getSetHandlerByDay({
      key: "scatterPlot",
      context,
      activityId,
      userId,
      accumulator: (logs) =>
        logs.map((log) => ({
          ...log,
          workLabel: numberToContextualUnit(context, {
            activityType,
            work: log.work,
          }),
        })),
    }),
  };
}

function getSetHandlerByDay({
  key,
  context,
  accumulator,
  activityId,
  userId,
}: {
  key: string;
  context: Context;
  accumulator?: (
    log: Pick<ActivityLogEntity, "day" | "reps" | "work">[]
  ) => any | any[];
  activityId: string;
  userId: string;
}): (
  parent: unknown,
  args: any
) => Promise<Pick<ActivityLogEntity, "work" | "reps" | "day">[]> {
  return async (
    parent: unknown,
    args: { input?: ActivityVisualizationInput } = {}
  ) => {
    const cacheKey = `getSetHandlerByDay-${activityId}-${userId}-${JSON.stringify(
      args
    )}-${key}`;
    return globalInMemoryCache.getOrSet({
      key: cacheKey,
      expiry: Date.now() + 1000 * 60,
      fn: async () => {
        const { from, to } = getDateRangeWithDefault(args?.input);
        const db = context.services.get(dbService)("W8MNGR_1");
        const results = await db
          .selectFrom("activityLog")
          .select(["day", "work", "reps"])
          .where("day", "in", (query) =>
            query
              .selectFrom("activityLog")
              .select("day")
              .distinct()
              .where("activityId", "=", activityId)
              .where("userId", "=", userId)
              .where("day", ">=", from)
              .where("day", "<=", to)
          )
          .where("userId", "=", userId)
          .where("activityId", "=", activityId)
          .orderBy("day", "asc")
          .orderBy("createdAt")
          .execute();

        if (!accumulator) {
          return results;
        }

        // Group them by day
        const dayLogs = results.reduce((acc, log) => {
          if (!acc[log.day]) {
            acc[log.day] = [];
          }
          acc[log.day].push(log);
          return acc;
        }, {} as Record<string, Pick<ActivityLogEntity, "work" | "reps" | "day">[]>);

        // Transform the logs by day
        return flattenArray(
          Object.entries(dayLogs).map(([, logs]) => accumulator(logs))
        );
      },
    });
  };
}
