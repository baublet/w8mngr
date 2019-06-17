import * as React from "react";
import Input from "client/components/Forms/Input";
import gramsToWeight from "shared/transformers/activity/gramsToWeight";
import { ActivityTypeType } from "api/activities/types";
import msToTime from "shared/transformers/activity/msToTime";

export interface ActivityEntryFormProps {
  activityType: number;
  actions: any;
  onSubmit?: (
    reps: number,
    work: string,
    setReps: React.Dispatch<string>,
    setWork: React.Dispatch<string>
  ) => void;
  onChange?: (reps: number, work: string) => void;
  reps?: number;
  work?: string;
  forwardedRepsRef?: React.RefObject<HTMLInputElement>;
  forwardedWorkRef?: React.RefObject<HTMLInputElement>;
}

function workFieldForType(type: ActivityTypeType): string {
  switch (type) {
    case ActivityTypeType.DISTANCE:
      return "Distance";
    case ActivityTypeType.TIMED:
      return "Time";
    case ActivityTypeType.WEIGHTLIFTING:
      return "Weight";
  }
  return "";
}

function hasWork(type: ActivityTypeType): boolean {
  switch (type) {
    case ActivityTypeType.DISTANCE:
    case ActivityTypeType.TIMED:
    case ActivityTypeType.WEIGHTLIFTING:
      return true;
  }
  return false;
}

function hasReps(type: ActivityTypeType): boolean {
  switch (type) {
    case ActivityTypeType.DISTANCE:
    case ActivityTypeType.TIMED:
      return false;
  }
  return true;
}

export default function ActivityEntryForm(
  props: ActivityEntryFormProps
): React.ReactComponentElement<any> {
  const [reps, setReps] = React.useState(props.reps ? `${props.reps}` : "");
  const [work, setWork] = React.useState("");
  const workFieldLabel = workFieldForType(props.activityType);

  React.useEffect(() => {
    if (!props.work) {
      return;
    }
    switch (props.activityType) {
      case ActivityTypeType.DISTANCE:
        // setWork((parseInt(props.work, 10)));
        return;
      case ActivityTypeType.TIMED:
        setWork(msToTime(parseInt(props.work, 10)));
        return;
      case ActivityTypeType.WEIGHTLIFTING:
        setWork(gramsToWeight(parseInt(props.work, 10)));
        return;
    }
  }, []);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        props.onSubmit(parseInt(reps, 10), work, setReps, setWork);
      }}
    >
      <div className="flex">
        {!hasReps(props.activityType) ? (
          false
        ) : (
          <Input
            name="reps"
            type="text"
            placeholder="Repetitions"
            value={reps}
            forwardedRef={props.forwardedRepsRef}
            onChange={(e: any) => setReps(e.target.value)}
            onBlur={() =>
              props.onChange ? props.onChange(parseInt(reps, 10), work) : ""
            }
          />
        )}
        {!hasWork(props.activityType) ? (
          false
        ) : (
          <Input
            name="work"
            type="text"
            placeholder={workFieldLabel}
            className={hasReps(props.activityType) ? "ml-2" : ""}
            value={work}
            forwardedRef={props.forwardedWorkRef}
            onChange={(e: any) => setWork(e.target.value)}
            onBlur={() =>
              props.onChange ? props.onChange(parseInt(reps, 10), work) : ""
            }
          />
        )}
        {props.actions}
      </div>
    </form>
  );
}
