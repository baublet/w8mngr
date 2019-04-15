import * as React from "react";
import EmptyNote from "client/components/Type/EmptyNote";
import { Query } from "react-apollo";

import activityEntriesQuery from "shared/queries/activityEntries";
import ActivityEntry from "./ActivityEntry";
import ContentContainer from "../Containers/ContentContainer";

interface ActivityEntriesProps {
  activityId: number;
  activityType: number;
  day: number;
}

export default function ActivityEntries({
  activityId,
  activityType,
  day
}: ActivityEntriesProps): React.ReactComponentElement<any> {
  return (
    <Query
      query={activityEntriesQuery}
      variables={{ activityId, day }}
      pollInterval={6000}
    >
      {(props: any) => {
        if (!props.data.activityEntries) {
          return (
            <EmptyNote>
              You have not yet logged any entries for this activity for this
              day. Use the form below to add some.
            </EmptyNote>
          );
        }
        return (
          <ContentContainer>
            {props.data.activityEntries.map(entry => {
              return (
                <ActivityEntry
                  key={entry.id}
                  activityId={activityId}
                  activityEntryId={entry.id}
                  activityType={activityType}
                  reps={entry.reps}
                  work={entry.work}
                  day={entry.day}
                />
              );
            })}
          </ContentContainer>
        );
      }}
    </Query>
  );
}
