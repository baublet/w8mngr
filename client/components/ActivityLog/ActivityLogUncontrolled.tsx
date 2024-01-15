import React from "react";

import { ActivityType } from "../../generated";
import { ActivityLogEntry } from "./ActivityLogEntry";
import { NewActivityLogForm } from "./NewActivityLogForm";

export function ActivityLogUncontrolled({
  activityId,
  activityLibraryActivityId,
  activityType,
  day,
  underInput,
  logs,
}: {
  activityId?: string;
  activityLibraryActivityId?: string;
  activityType: ActivityType;
  day: string;
  underInput?: React.ReactNode;
  logs: {
    id: string;
    reps?: number | null | undefined;
    work?: string | null | undefined;
  }[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {!logs || logs.length === 0 ? (
            <div className="pt-4 border-t border-slate-50 mt-4 text-slate-400 max-w-sm font-thin text-2xl">
              Nothing here, yet! Get started by entering a set in the form.
            </div>
          ) : (
            logs.map((log) => (
              <ActivityLogEntry
                key={log.id}
                day={day}
                activityId={activityId}
                activityLibraryActivityId={activityLibraryActivityId}
                log={log}
                activityType={activityType}
              />
            ))
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <NewActivityLogForm
            activityType={activityType}
            activityId={activityId}
            activityLibraryActivityId={activityLibraryActivityId}
            day={day}
          />
          {underInput && underInput}
        </div>
      </div>
    </div>
  );
}
