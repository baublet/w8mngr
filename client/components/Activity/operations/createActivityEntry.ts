import { MutationFn } from "react-apollo";
import activityEntriesQuery from "shared/queries/activityEntries";

export default function createActivityEntryOperation(
  createActivityEntryFn: MutationFn,
  day: number,
  activityId: number,
  reps: number,
  work: string,
  setReps: React.Dispatch<string>,
  setWork: React.Dispatch<string>,
  repsEl: React.RefObject<HTMLInputElement>,
  workEl: React.RefObject<HTMLInputElement>
): void {
  createActivityEntryFn({
    variables: {
      day,
      activityId,
      reps,
      work
    },
    optimisticResponse: {
      __typename: "Mutation",
      createActivity: {
        __typename: "ActivityEntry",
        id: -1,
        day,
        activity_id: activityId,
        reps,
        work
      }
    },
    update: (proxy, { data: { createActivityEntry } }) => {
      if (!createActivityEntry || !createActivityEntry.id) {
        return;
      }
      let data: any = {};
      try {
        data = proxy.readQuery({
          query: activityEntriesQuery,
          variables: {
            activityId,
            day
          }
        });
      } catch (e) {
        data = { activityEntries: [] };
      }
      proxy.writeQuery({
        query: activityEntriesQuery,
        variables: {
          activityId,
          day
        },
        data: {
          activityEntries: [createActivityEntry, ...data.activityEntries]
        }
      });
      setReps("");
      setWork("");
      repsEl.current.focus();
    }
  });
}
