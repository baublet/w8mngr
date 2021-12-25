import React from "react";
import { useHistory } from "react-router";

import { DayNavigator } from "../DayNavigator";
import { NewActivityLogForm } from "./NewActivityLogForm";
import { ActivityType, useGetActivityLogQuery } from "../../generated";
import { PrimaryLoader } from "../Loading/Primary";
import { ActivityLogEntry } from "./ActivityLogEntry";

export function ActivityLog({
  activityId,
  activityType,
  day,
}: {
  activityId: string;
  activityType: ActivityType;
  day: string;
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

  const onRefresh = React.useCallback(() => {}, []);

  const logs = data?.currentUser?.activities.edges[0]?.node.logs.edges;

  if (loading || !logs) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      <DayNavigator
        onChange={setDay}
        rootUrl={`/activities/${activityId}/log/`}
        onRefresh={onRefresh}
      />
      {logs.length === 0 ? (
        <div>No logs, yet!</div>
      ) : (
        logs.map((log) => <ActivityLogEntry key={log.node.id} log={log.node} />)
      )}
      <div>
        <NewActivityLogForm activityType={activityType} />
      </div>
    </div>
  );
}
