import { MutationFn } from "react-apollo";
import { History } from "history";
import activitiesQuery from "shared/queries/activities";
import readActivityQuery from "shared/queries/activities.read";

export default function updateActivityOperation(
  id: number,
  name: string,
  description: string,
  history: History,
  updateActivityFn: MutationFn
) {
  updateActivityFn({
    variables: {
      id,
      name,
      description
    },
    optimisticResponse: {
      __typename: "Mutation",
      updateActivity: {
        __typename: "Activity",
        id,
        name,
        description
      }
    },
    update: (proxy, { data: { updateActivity } }) => {
      if (!updateActivity || !updateActivity.id) {
        return;
      }
      const data: any = proxy.readQuery({
        query: activitiesQuery
      });
      data.activities.forEach(activity => {
        if (activity.id == updateActivity.id) {
          activity = updateActivity;
        }
      });
      proxy.writeQuery({
        query: activitiesQuery,
        data: {
          activities: data.activities
        }
      });
      proxy.writeQuery({
        query: readActivityQuery,
        variables: { id: updateActivity.id },
        data: {
          activity: updateActivity
        }
      });
      history.replace(`/activities`);
    }
  });
}
