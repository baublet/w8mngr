import dateDistance from "date-fns/formatDistance";

import { activityDataService } from "./";
import { Context } from "../../createContext";
import { ActivityStats, ActivityType } from "../../graphql-types";
import { activityLogDataService } from "..";
import { numberToContextualUnit } from "../../helpers";
import { dayStringFromDate, dayStringToDate } from "../../../shared";

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
          .orderBy("createdAt")
          .limit(1)
    );
    const lastLog = lastLoggedActivity[0];

    if (!lastLog) {
      return null;
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
        .orderBy(recordColumn)
        .limit(1)
    );
    const personalRecordLog = personalRecord[0];

    if (!personalRecordLog) {
      return null;
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
