import React from "react";

import { ActivityType, useGetActivityLogQuery } from "../../generated";
import { PrimaryLoader } from "../Loading/Primary";
import { ActivityLogEntry } from "./ActivityLogEntry";
import { NewActivityLogForm } from "./NewActivityLogForm";
import { ActivityLogUncontrolled } from "./ActivityLogUncontrolled";

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

  const logs = data?.currentUser?.activities.edges[0]?.node.logs.edges.map(
    (l) => l.node,
  );

  if (loading || !logs) {
    return <PrimaryLoader />;
  }

  return (
    <ActivityLogUncontrolled
      activityType={activityType}
      activityId={activityId}
      day={day}
      underInput={underInput}
      logs={logs}
    />
  );
}
