import React from "react";

import { ActivityType, GetActivityDetailsQuery } from "../../generated";

import { TrophyIcon } from "../Icons/Trophy";
import { Link } from "../Link";

export function ActivityStatsComponent({
  queryData,
}: {
  queryData: GetActivityDetailsQuery;
}) {
  const activity = queryData.currentUser?.activities.edges[0].node;
  const stats = activity?.stats;
  const activityType = activity?.type;

  if (!stats || !activityType) {
    return null;
  }

  const personalRecord = stats.personalRecord;
  const lastLog = stats.lastLog;

  if (!personalRecord && !lastLog) {
    return null;
  }

  return (
    <div className="p-4 rounded bg-slate-50 border border-slate-200 opacity-50 hover:opacity-100 flex flex-col gap-8">
      {personalRecord && (
        <div className="flex flex-col gap-4">
          <div className="text-lg font-thin">Personal Record</div>
          <div className="flex items-center gap-2">
            <div className="text-xl text-slate-500">
              <TrophyIcon />
            </div>
            <Link
              to={personalRecord.link}
              className="text-slate-600 no-underline text-sm hover:underline hover:text-slate-700"
            >
              {statText({
                reps: personalRecord.reps,
                work: personalRecord.work,
                activityType,
                ago: personalRecord.ago,
              })}
            </Link>
          </div>
        </div>
      )}
      {lastLog && (
        <div className="flex flex-col gap-2 items-start">
          <div className="text-lg font-thin flex flex-col gap-0">
            <span className="flex-grow">Last&nbsp;{activity.name}&nbsp;Log</span>
            <Link
              className="text-slate-700 no-underline text-sm hover:underline hover:text-slate-800 flex-shrink"
              to={`/activities/${activity.id}/log/${lastLog.day}`}
            >
              {lastLog.ago}
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            {lastLog.logs.map((log) => (
              <div key={log.id}>
                &bull;{" "}
                {repText({ activityType, reps: log.reps, work: log.work })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function repText({
  work,
  reps,
  activityType,
}: {
  work: string | null | undefined;
  reps: number | null | undefined;
  activityType: ActivityType;
}) {
  switch (activityType) {
    case "DISTANCE":
    case "TIMED":
      return `${work}`;
    case "REPETITIVE":
      return `${reps} reps`;
    case "WEIGHT":
      return `${reps} x ${work}`;
  }
}

function statText({
  work,
  reps,
  ago,
  activityType,
}: {
  work: string | null | undefined;
  ago: string;
  reps: number | null | undefined;
  activityType: ActivityType;
}) {
  switch (activityType) {
    case "DISTANCE":
    case "TIMED":
      return `${work}, ${ago}`;
    case "REPETITIVE":
      return `${reps} reps, ${ago}`;
    case "WEIGHT":
      return `${work} (${reps} reps), ${ago}`;
  }
}
