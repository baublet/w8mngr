import dateDistance from "date-fns/formatDistance/index.js";

import { dayStringFromDate } from "../../../../shared/dayStringFromDate.js";
import { dayStringToDate } from "../../../../shared/dayStringToDate.js";
import { Resolvable } from "../../../../shared/types.js";
import { Context } from "../../../createContext.js";
import { ActivityStats, ActivityType } from "../../../generated.js";
import { numberToContextualUnit } from "../../../helpers/numberToContextualUnit.js";
import { activityDataService } from "../../activity/index.js";
import { activityLogDataService } from "../../activityLog/index.js";
import { getVisualizationDataResolvers } from "./visualizationData.js";

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
  const activity = await activityDataService.findOneOrFail(context, activityId);

  const now = new Date();
  const todayDateString = dayStringFromDate(now);

  const lastLogNode = async () => {
    const lastLoggedActivity = await activityLogDataService.findBy(
      context,
      (q) =>
        q
          .where("activityId", "=", activityId)
          .where("userId", "=", userId)
          .where("day", "<", todayDateString)
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
              .where("day", "=", lastLogDayString)
              .where("userId", "=", userId)
              .orderBy("createdAt", "asc")
          ) as any)
        : undefined,
    };
  };

  const personalRecordNode = async () => {
    const recordColumn = getPersonalRecordColumn(activity.type as ActivityType);
    const personalRecord = await activityLogDataService.findBy(context, (q) =>
      q
        .where("activityId", "=", activityId)
        .where("userId", "=", userId)
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
      activityType: activity.type as ActivityType,
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
      activityType: activity.type as ActivityType,
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
