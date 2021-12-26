import React from "react";

import { ActivityStats, GetActivityDetailsQuery } from "../../generated";

import { TrophyIcon } from "../Icons/Trophy";
import { Link } from "../Link";

export function ActivityStatsComponent({
  queryData,
}: {
  queryData: GetActivityDetailsQuery;
}) {
  const stats = queryData.currentUser?.activities.edges[0].node.stats;

  if (!stats) {
    return null;
  }

  const personalRecord = stats.personalRecord;
  const lastLog = stats.lastLog;

  if(!personalRecord && !lastLog) {
    return null;
  }

  return (
    <div className="p-4 rounded bg-gray-50 border border-gray-500 opacity-75 hover:opacity-100">
      {personalRecord && (
        <div className="flex flex-col gap-4">
          <div className="text-lg font-thin">Personal Record</div>
          <div className="flex items-center gap-2">
            <div className="text-xl text-gray-500">
              <TrophyIcon />
            </div>
            <Link
              to={personalRecord.link}
              className="font-bold text-gray-600 no-underline text-sm hover:underline hover:text-gray-700"
            >
              {personalRecord.work || personalRecord.reps} (
              {personalRecord.reps ? `${personalRecord.reps} reps` : ""},{" "}
              {personalRecord.ago})
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
