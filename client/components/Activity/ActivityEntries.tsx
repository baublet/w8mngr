import * as React from "react";
import { ActivityType } from "api/activities/types";
import EmptyNote from "client/components/Type/EmptyNote";
import ActivityComponent from "./ActivityComponent";
import { Query } from "react-apollo";

interface ActivityEntriesProps {
  activity_id: number;
  day: number;
}

export default function ActivityEntries({
  activity_id,
  day
}: ActivityEntriesProps): React.ReactComponentElement<any> {
  return (
    <>
      <Query query={}>
        {!props.activities || !props.activities.length ? (
          <EmptyNote>You don't yet have any activities.</EmptyNote>
        ) : (
          props.activities.map((activity: ActivityType, index: number) => (
            <ActivityComponent key={activity.id} index={index} {...activity} />
          ))
        )}
      </Query>
    </>
  );
}
