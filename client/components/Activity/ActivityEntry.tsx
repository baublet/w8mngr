import * as React from "react";
import AddButton from "../Button/AddButton";
import { Mutation } from "react-apollo";
import createActivityEntryQuery from "shared/queries/activityEntries.create";
import createActivityEntryOperation from "./operations/createActivityEntry";
import ActivityEntryForm from "./ActivityEntryForm";
import DeleteButton from "../Button/DeleteIconButton";
import DeleteActivityEntryButton from "./DeleteActivityEntryButton";

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
    <Mutation mutation={createActivityEntryQuery}>
      {createActivityEntryFn => {
        const onSubmit = (
          reps: number,
          work: string,
          setReps: React.Dispatch<string>,
          setWork: React.Dispatch<string>
        ) => {
          createActivityEntryOperation(
            createActivityEntryFn,
            20120101,
            activityId,
            reps,
            work,
            setReps,
            setWork
          );
        };
        return (
          <ActivityEntryForm
            activityType={activityType}
            onSubmit={onSubmit}
            actions={
              <div>
                <AddButton type="submit" className="screen-reader-text" />
                <DeleteActivityEntryButton
                  activityId={activityId}
                  day={day}
                  id={activityEntryId}
                />
              </div>
            }
            reps={reps}
            work={`${work}`}
          />
        );
      }}
    </Mutation>
  );
}
