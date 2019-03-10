import * as React from "react";
import { Mutation } from "react-apollo";
import deleteActivityQuery from "shared/queries/activities.delete";
import activitiesQuery from "shared/queries/activities";
import DeleteButton from "../Button/DeleteButton";
import history from "client/history";

interface ActivityDeleteButtonProps {
  id: number;
}

export default function ActivityDeleteButton(props: ActivityDeleteButtonProps) {
  return (
    <Mutation mutation={deleteActivityQuery}>
      {deleteActivityFn => (
        <DeleteButton
          onClick={() => {
            deleteActivityFn({
              variables: {
                id: props.id
              },
              update: proxy => {
                const data: any = proxy.readQuery({
                  query: activitiesQuery
                });
                data.activities = data.activities || [];
                proxy.writeQuery({
                  query: activitiesQuery,
                  data: {
                    activities: data.activities.filter(
                      activity => activity.id !== props.id
                    )
                  }
                });
                history.replace("/activities");
                window.scrollTo(0, 0);
              }
            });
          }}
        >
          Delete
        </DeleteButton>
      )}
    </Mutation>
  );
}
