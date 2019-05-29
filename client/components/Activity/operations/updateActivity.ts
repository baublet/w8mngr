import { MutationFn } from "react-apollo";
import { History } from "history";
import activitiesQuery from "shared/queries/activities";
import readActivityQuery from "shared/queries/activities.read";
import scrollTo from "client/helpers/scrollTo";

export default function updateActivityOperation(
  id: number,
  name: string,
  description: string,
  activity_type: string,
  muscle_groups: string,
  history: History,
  updateActivityFn: MutationFn
) {
  updateActivityFn({
    variables: {
      id,
      name,
      description,
      activity_type: parseInt(activity_type, 10),
      muscle_groups
    },
    optimisticResponse: {
      __typename: "Mutation",
      updateActivity: {
        __typename: "Activity",
        id,
        name,
        description,
        activity_type: parseInt(activity_type, 10),
        muscle_groups
      }
    },
    update: (proxy, { data: { updateActivity } }) => {
      if (!updateActivity || !updateActivity.id) {
        return;
      }
      try {
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
      } catch (e) {
        // We don't really care to catch this. We get here when we
        // reload the edit activity page. Our activities query isn't
        // already loaded, so Apollo throws an error when we try to
        // to query it.
      }
      proxy.writeQuery({
        query: readActivityQuery,
        variables: { id: updateActivity.id },
        data: {
          activity: updateActivity
        }
      });
      history.replace(`/activity/${updateActivity.id}`);
      scrollTo();
    }
  });
}
