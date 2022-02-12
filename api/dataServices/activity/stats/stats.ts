import dateDistance from "date-fns/formatDistance";

import { dayStringFromDate, dayStringToDate } from "../../../../shared";
import { Resolvable } from "../../../../shared/types";
import { Context } from "../../../createContext";
import { ActivityStats, ActivityType } from "../../../generated";
import { numberToContextualUnit } from "../../../helpers";
import { activityDataService } from "../";
import { activityLogDataService } from "../..";
import { getVisualizationDataResolvers } from "./visualizationData";

export async function stats(
  context: Context,
  {
    userId,
    activityId,
  }: {
    userId: string;
    activityId: string;
  }
): Promise<Resolvable<ActivityStats>> {
  const activity = await activityDataService.findOneOrFail(context, (q) =>
    q.where({ id: activityId })
  );

  const now = new Date();
  const todayDateString = dayStringFromDate(now);

  const lastLogNode = async () => {
    const lastLoggedActivity = await activityLogDataService.findBy(
      context,
      (q) =>
        q
          .where("activityId", "=", activityId)
          .andWhere("userId", "=", userId)
          .andWhere("day", "<", todayDateString)
          .orderBy("day", "desc")
          .limit(1)
    );
    const lastLog = lastLoggedActivity[0];

    if (!lastLog) {
      return undefined;
    }

    const lastLoggedDate = dayStringToDate(lastLog.day);
    const lastLoggedAgo = dateDistance(lastLoggedDate, now, {
      addSuffix: true,
    });
    const lastLogDayString = dayStringFromDate(lastLoggedDate);

    return {
      ago: lastLoggedAgo,
      day: lastLogDayString,
      logs: lastLogDayString
        ? (activityLogDataService.findBy(context, (q) =>
            q
              .where("activityId", "=", activityId)
              .andWhere("day", "=", lastLogDayString)
              .andWhere("userId", "=", userId)
              .orderBy("createdAt", "asc")
          ) as any)
        : undefined,
    };
  };

  const personalRecordNode = async () => {
    const recordColumn = getPersonalRecordColumn(activity.type);
    const personalRecord = await activityLogDataService.findBy(context, (q) =>
      q
        .where("activityId", "=", activityId)
        .andWhere("userId", "=", userId)
        .orderBy(recordColumn, "desc")
        .orderBy("createdAt", "asc")
        .limit(1)
    );
    const personalRecordLog = personalRecord[0];

    if (!personalRecordLog) {
      return undefined;
    }

    const personalRecordDate = dayStringToDate(personalRecordLog.day);
    const personalRecordAgo = dateDistance(personalRecordDate, now, {
      addSuffix: true,
    });
    const reps = personalRecordLog.reps;
    const rawWork = personalRecordLog.work;
    const work = await numberToContextualUnit(context, {
      activityType: activity.type,
      work: rawWork,
    });
    const personalRecordLink = `/activities/${activityId}/log/${personalRecordLog.day}`;

    return {
      reps,
      ago: personalRecordAgo,
      link: personalRecordLink,
      work,
    };
  };

  return {
    lastLog: lastLogNode,
    personalRecord: personalRecordNode,
    visualizationData: getVisualizationDataResolvers({
      activityId,
      userId,
      context,
      activityType: activity.type,
    }),
  };
}

function getPersonalRecordColumn(type: ActivityType): "work" | "reps" {
  switch (type) {
    case "WEIGHT":
    case "DISTANCE":
    case "TIMED":
      return "work";
    case "REPETITIVE":
      return "reps";
  }
}
