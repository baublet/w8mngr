import * as React from "react";
import AddButton from "../Button/AddButton";
import { Mutation } from "react-apollo";
import createActivityEntryQuery from "shared/queries/activityEntries.create";
import createActivityEntryOperation from "./operations/createActivityEntry";
import ActivityEntryForm from "./ActivityEntryForm";
import { ActivityTypeType } from "api/activities/types";

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

  React.useEffect(() => {
    switch (props.activityType) {
      case ActivityTypeType.DISTANCE:
      case ActivityTypeType.TIMED:
        workEl.current.focus();
        break;
      default:
        repsEl.current.focus();
    }
  }, []);

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
            setWork
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
