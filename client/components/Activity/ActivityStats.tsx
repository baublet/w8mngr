import cx from "classnames";
import React from "react";

import { ActivityType, GetActivityDetailsQuery } from "../../generated";
import { Panel } from "../Containers";
import { TrophyIcon } from "../Icons/Trophy";
import { Link } from "../Link";
import { ActivityMaximumWorkChart } from "./ActivityMaximumWorkChart";

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
  const maximumWork = stats.visualizationData.maximumWork;

  if (!personalRecord && !lastLog) {
    return null;
  }

  return (
    <div>
      <Panel className="flex flex-col gap-4">
        {personalRecord && (
          <div className="flex flex-col gap-2">
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
              <span className="flex-grow">
                Last&nbsp;{activity.name}&nbsp;Log
              </span>
              <Link
                className="text-slate-700 no-underline text-sm hover:underline hover:text-slate-800 flex-shrink"
                to={`/activities/${activity.id}/log/${lastLog.day}`}
              >
                {lastLog.ago}
              </Link>
            </div>
            <div
              className={cx("flex text-sm text-slate-600 w-full", {
                "flex-col gap-2": activityType === "WEIGHT",
                "flex-wrap flex-row gap-4": activityType !== "WEIGHT",
              })}
            >
              {lastLog.logs.map((log) => (
                <RepText
                  key={log.id}
                  activityType={activityType}
                  reps={log.reps}
                  work={log.work}
                />
              ))}
            </div>
          </div>
        )}
      </Panel>
      {maximumWork && maximumWork.length > 3 && (
        <Panel className="p-2">
          <div className="text-lg font-thin">Progress</div>
          <div className="text-sm text-slate-500">Top set per day</div>
          <div className="aspect-video">
            <ActivityMaximumWorkChart data={maximumWork} />
          </div>
        </Panel>
      )}
    </div>
  );
}

function RepText({
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
      return <div>{work}</div>;
    case "REPETITIVE":
      return <div>{reps} reps</div>;
    case "WEIGHT":
      return (
        <div className="flex gap-2 w-full">
          <div className="w-1/12 text-right">{reps}</div>
          <div className="w-1/12 text-center">&times;</div>
          <div className="w-10/12">{work}</div>
        </div>
      );
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
