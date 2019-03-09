import { MutationFn } from "react-apollo";
import { History } from "history";
import activitiesQuery from "shared/queries/activities";
import readActivityQuery from "shared/queries/activities.read";

export default function createActivityOperation(
  name: string,
  description: string,
  history: History,
  createActivityFn: MutationFn
) {
  createActivityFn({
    variables: {
      name,
      description
    },
    optimisticResponse: {
      __typename: "Mutation",
      createActivity: {
        __typename: "Activity",
        id: -1,
        name,
        description
      }
    },
    update: (proxy, { data: { createActivity } }) => {
      if (!createActivity || !createActivity.id) {
        return;
      }
      const data: any = proxy.readQuery({
        query: activitiesQuery
      });
      data.activities = data.activities || [];
      proxy.writeQuery({
        query: activitiesQuery,
        data: {
          activities: [...data.activities, createActivity]
        }
      });
      proxy.writeQuery({
        query: readActivityQuery,
        variables: { id: createActivity.id },
        data: {
          activity: createActivity
        }
      });
      history.replace(`/activity/${createActivity.id}/edit`);
    }
  });
}
