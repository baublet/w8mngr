import React from "react";
import { useHistory } from "react-router";

import { DayNavigator } from "../DayNavigator";
import { NewActivityLogForm } from "./NewActivityLogForm";
import {
  ActivityType,
  useGetActivityLogQuery,
  ActivityStats,
} from "../../generated";
import { PrimaryLoader } from "../Loading/Primary";
import { ActivityLogEntry } from "./ActivityLogEntry";
import { ActivityStatsComponent } from "./ActivityStats";

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
  const { replace } = useHistory();
  const [stateDay, setDay] = React.useState(day);
  const { loading, data } = useGetActivityLogQuery({
    variables: {
      activityId,
      day: stateDay,
    },
  });

  React.useEffect(() => {
    replace(`/activities/${activityId}/log/${stateDay}`);
  }, [stateDay]);
  React.useEffect(() => {
    setDay(day);
  }, [day]);

  const onRefresh = React.useCallback(() => {}, []);

  const logs = data?.currentUser?.activities.edges[0]?.node.logs.edges;

  if (loading || !logs) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <DayNavigator
        onChange={setDay}
        rootUrl={`/activities/${activityId}/log/`}
        onRefresh={onRefresh}
      />
      <div className="flex justify-between items-start gap-4">
        <div className="w-1/2">
          {!logs || logs.length === 0 ? (
            <div className="pt-4 border-t border-gray-50 mt-4 opacity-25 max-w-sm font-thin text-2xl">
              Nothing here, yet! Get started by entering a set in the form.
            </div>
          ) : (
            logs.map((log) => (
              <ActivityLogEntry
                key={log.node.id}
                log={log.node}
                activityType={activityType}
              />
            ))
          )}
        </div>
        <div className="flex flex-col gap-4">
          <NewActivityLogForm
            activityType={activityType}
            activityId={activityId}
            day={stateDay}
          />
          {underInput && underInput}
        </div>
      </div>
    </div>
  );
}
