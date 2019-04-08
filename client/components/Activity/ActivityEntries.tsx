import * as React from "react";
import { ActivityType } from "api/activities/types";
import EmptyNote from "client/components/Type/EmptyNote";
import ActivityComponent from "./ActivityComponent";
import { Query } from "react-apollo";

import activityEntriesQuery from "shared/queries/activityEntries";

interface ActivityEntriesProps {
  activityId: number;
  day: number;
}

export default function ActivityEntries({
  activityId,
  day
}: ActivityEntriesProps): React.ReactComponentElement<any> {
  return (
    <>
      <Query query={activityEntriesQuery} variables={{ activityId, day }}>
        {(props: any) => {
          if (!props.activityEntries) {
            return (
              <EmptyNote>
                You have not yet logged any entries for this activity for this
                day. Use the form below to add some.
              </EmptyNote>
            );
          }
          return props.activityEntries.map(entry => {
            return (
              <div>
                {entry.reps} - {entry.work}
              </div>
            );
          });
        }}
      </Query>
    </>
  );
}
