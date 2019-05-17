import { MutationFn } from "react-apollo";
import activityEntriesQuery from "shared/queries/activityEntries";
import { ActivityEntryType } from "api/activityEntries/types";

export default function updateActivityEntryOperation(
  updateActivityEntryFn: MutationFn,
  day: number,
  activityId: number,
  id: number,
  reps: number,
  work: string
): void {
  updateActivityEntryFn({
    variables: {
      id,
      reps,
      work
    },
    optimisticResponse: {
      __typename: "Mutation",
      updateActivityEntry: {
        __typename: "ActivityEntry",
        id,
        day,
        activity_id: activityId,
        reps,
        work
      }
    },
    update: (proxy, { data: { updateActivityEntry } }) => {
      if (!updateActivityEntry || !updateActivityEntry.id) {
        return;
      }
      let data: any = proxy.readQuery({
        query: activityEntriesQuery,
        variables: {
          activityId,
          day
        }
      });
      const activityEntriesCopy = data.activityEntries.slice(0);
      activityEntriesCopy.forEach((entry: ActivityEntryType, i: number) => {
        if (id !== entry.id) {
          return;
        }
        activityEntriesCopy[i].reps = reps;
        activityEntriesCopy[i].work = work;
      });
      proxy.writeQuery({
        query: activityEntriesQuery,
        variables: {
          activityId,
          day
        },
        data: {
          activityEntries: activityEntriesCopy
        }
      });
    }
  });
}
