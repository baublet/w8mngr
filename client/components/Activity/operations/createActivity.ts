import { MutationFn } from "react-apollo";
import { History } from "history";
import activitiesQuery from "shared/queries/activities";
import readActivityQuery from "shared/queries/activities.read";

import { defaultPerPage } from "client/components/Apollo/PaginatedQuery";

export default function createActivityOperation(
  name: string,
  description: string,
  activity_type: string,
  history: History,
  createActivityFn: MutationFn
) {
  createActivityFn({
    variables: {
      name,
      description,
      activity_type: parseInt(activity_type, 10)
    },
    optimisticResponse: {
      __typename: "Mutation",
      createActivity: {
        __typename: "Activity",
        id: -1,
        name,
        description,
        activity_type: parseInt(activity_type, 10)
      }
    },
    update: (proxy, { data: { createActivity } }) => {
      if (!createActivity || !createActivity.id) {
        return;
      }
      let data: any = {};
      try {
        data = proxy.readQuery({
          query: activitiesQuery,
          variables: {
            offset: 0,
            limit: defaultPerPage
          }
        });
      } catch (e) {
        data = { activities: [] };
      }
      proxy.writeQuery({
        query: activitiesQuery,
        variables: {
          offset: 0,
          limit: defaultPerPage
        },
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
      window.scrollTo(0, 0);
    }
  });
}
