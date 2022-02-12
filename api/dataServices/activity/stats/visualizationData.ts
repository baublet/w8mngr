import { flattenArray } from "../../../../shared";
import { Context } from "../../../createContext";
import {
  ActivityType,
  ActivityVisualizationInput,
} from "../../../generated";
import {
  getDateRangeWithDefault,
  globalInMemoryCache,
  numberToContextualUnit,
} from "../../../helpers";
import { getQuery } from "../../activityLog/query";
import { ActivityLog } from "../../activityLog/types";

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
        const work = logs.reduce(
          (acc, log) => (log.work > acc ? log.work : acc),
          0
        );
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
        const work = logs.reduce((acc, log) => acc + log.work, 0) / logs.length;
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
        work: logs.reduce((acc, log) => (log.work > acc ? log.reps : acc), 0),
        day: logs[0].day,
      }),
      activityId,
      userId,
    }),
    averageReps: getSetHandlerByDay({
      key: "averageReps",
      context,
      accumulator: (logs) => ({
        work: logs.reduce((acc, log) => acc + log.work, 0) / logs.length,
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
    log: Pick<ActivityLog, "day" | "reps" | "work">[]
  ) => any | any[];
  activityId: string;
  userId: string;
}): (
  parent: unknown,
  args: any
) => Promise<Pick<ActivityLog, "work" | "reps" | "day">[]> {
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
        const queryFactory = await getQuery(context);
        const query = queryFactory();
        const results = await query
          .select("day", "work", "reps")
          .whereIn("day", (query) =>
            query
              .distinct("day")
              .where("activityId", "=", activityId)
              .andWhere("userId", "=", userId)
              .andWhere("day", ">=", from)
              .andWhere("day", "<=", to)
          )
          .andWhere("userId", "=", userId)
          .andWhere("activityId", "=", activityId)
          .orderBy("day", "asc")
          .orderBy("createdAt");

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
        }, {} as Record<string, Pick<ActivityLog, "work" | "reps" | "day">[]>);

        // Transform the logs by day
        return flattenArray(
          Object.entries(dayLogs).map(([, logs]) => accumulator(logs))
        );
      },
    });
  };
}
