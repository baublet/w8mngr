import * as React from "react";
import AddButton from "../Button/AddButton";
import { Mutation } from "react-apollo";
import updateActivityEntryQuery from "shared/queries/activityEntries.update";
import updateActivityEntryOperation from "./operations/updateActivityEntry";
import ActivityEntryForm from "./ActivityEntryForm";
import DeleteActivityEntryButton from "./ActivityEntryDeleteButton";

export interface ActivityEntryProps {
  activityId: number;
  activityType: number;
  activityEntryId: number;
  reps: number;
  work: number;
  day: number;
}

export default function ActivityEntry({
  activityId,
  activityType,
  activityEntryId,
  reps,
  work,
  day
}: ActivityEntryProps): React.ReactComponentElement<any> {
  return (
    <Mutation mutation={updateActivityEntryQuery}>
      {updateActivityEntryFn => {
        const onChange = (reps: number, work: string) => {
          updateActivityEntryOperation(
            updateActivityEntryFn,
            day,
            activityId,
            activityEntryId,
            reps,
            work
          );
        };
        return (
          <ActivityEntryForm
            activityType={activityType}
            onChange={onChange}
            onSubmit={() => {}}
            actions={
              <>
                <AddButton type="submit" className="screen-reader-text" />
                <DeleteActivityEntryButton
                  activityId={activityId}
                  day={day}
                  id={activityEntryId}
                />
              </>
            }
            reps={reps}
            work={work.toString()}
          />
        );
      }}
    </Mutation>
  );
}
