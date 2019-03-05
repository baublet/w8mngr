import * as React from "react";
import { ActivityType } from "api/activities/types";
import EmptyNote from "components/Type/EmptyNote";
import ActivityComponent from "./Activity";

interface ActivitiesListProps {
  activities: Array<ActivityType>;
}

export default function ActivitiesListComponent(
  props: ActivitiesListProps
): React.ReactComponentElement<any> {
  return (
    <>
      {!props.activities || !props.activities.length ? (
        <EmptyNote>You don't yet have any activities.</EmptyNote>
      ) : (
        props.activities.map((activity: ActivityType, index: number) => (
          <ActivityComponent key={activity.id} index={index} {...activity} />
        ))
      )}
    </>
  );
}
