import * as React from "react";
import { Mutation } from "react-apollo";
import DeleteButton from "../Button/DeleteIconButton";
import deleteActivityEntryQuery from "shared/queries/activityEntries.delete";
import activityEntriesQuery from "shared/queries/activityEntries";

export interface DeleteActivityEntryButtonProps {
  id: number;
  activityId: number;
  day: number;
}

export default function DeleteActivityEntryButton({
  id,
  activityId,
  day
}: DeleteActivityEntryButtonProps): React.ReactComponentElement<any> {
  return (
    <Mutation mutation={deleteActivityEntryQuery}>
      {deleteActivityEntryFn => (
        <DeleteButton
          onClick={() => {
            deleteActivityEntryFn({
              variables: {
                id
              },
              optimisticResponse: {
                __typename: "Mutation",
                createActivity: {
                  __typename: "ActivityEntry",
                  id
                }
              },
              update: (proxy, { data: { deleteActivityEntry } }) => {
                console.log(deleteActivityEntry);
                let data: any = proxy.readQuery({
                  query: activityEntriesQuery,
                  variables: {
                    activityId,
                    day
                  }
                });
                data.activityEntries = data.activityEntries.filter(
                  entry => entry.id !== id
                );
                proxy.writeQuery({
                  query: activityEntriesQuery,
                  variables: {
                    activityId,
                    day
                  },
                  data
                });
              }
            });
          }}
        />
      )}
    </Mutation>
  );
}
