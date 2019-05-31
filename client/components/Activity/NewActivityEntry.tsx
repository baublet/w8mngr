import * as React from "react";
import AddButton from "../Button/AddButton";
import { Mutation } from "react-apollo";
import createActivityEntryQuery from "shared/queries/activityEntries.create";
import createActivityEntryOperation from "./operations/createActivityEntry";
import ActivityEntryForm from "./ActivityEntryForm";

export interface NewActivityEntryFormProps {
  day: number;
  activityId: number;
  activityType: number;
}

export default function NewActivityEntryForm(
  props: NewActivityEntryFormProps
): React.ReactComponentElement<any> {
  const repsEl = React.useRef(null);
  const workEl = React.useRef(null);

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
            props.day,
            props.activityId,
            reps,
            work,
            setReps,
            setWork,
            repsEl,
            workEl
          );
        };
        return (
          <ActivityEntryForm
            activityType={props.activityType}
            onSubmit={onSubmit}
            actions={<AddButton type="submit" className="ml-3" />}
            forwardedRepsRef={repsEl}
            forwardedWorkRef={workEl}
          />
        );
      }}
    </Mutation>
  );
}
