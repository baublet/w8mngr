import React from "react";

import { NewActivityLogForm } from "./NewActivityLogForm";
import { ActivityType, useGetActivityLogQuery } from "../../generated";
import { PrimaryLoader } from "../Loading/Primary";
import { ActivityLogEntry } from "./ActivityLogEntry";

export function ActivityLog({
  activityId,
  activityType,
  day,
  underInput,
}: {
  activityId: string;
  activityType: ActivityType;
  day: string;
  underInput?: React.ReactNode;
}) {
  const { loading, data } = useGetActivityLogQuery({
    variables: {
      activityId,
      day,
    },
  });


  const logs = data?.currentUser?.activities.edges[0]?.node.logs.edges;

  if (loading || !logs) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-start gap-8 flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          {!logs || logs.length === 0 ? (
            <div className="border-t border-slate-50 mt-4 opacity-25 max-w-sm font-thin text-2xl">
              Nothing here, yet! Get started by entering a set in the form.
            </div>
          ) : (
            logs.map((log) => (
              <ActivityLogEntry
                key={log.node.id}
                day={day}
                activityId={activityId}
                log={log.node}
                activityType={activityType}
              />
            ))
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <NewActivityLogForm
            activityType={activityType}
            activityId={activityId}
            day={day}
          />
          {underInput && underInput}
        </div>
      </div>
    </div>
  );
}
