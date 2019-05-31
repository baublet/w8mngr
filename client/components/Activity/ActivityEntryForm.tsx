import * as React from "react";
import Input from "client/components/Forms/Input";
import gramsToWeight from "shared/transformers/activity/gramsToWeight";
import weightToGrams from "shared/transformers/activity/weightToGrams";

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

export default function ActivityEntryForm(
  props: ActivityEntryFormProps
): React.ReactComponentElement<any> {
  const [reps, setReps] = React.useState(props.reps ? `${props.reps}` : "");
  const [work, setWork] = React.useState("");

  React.useEffect(() => {
    if (!props.work) {
      return;
    }
    setWork(gramsToWeight(parseInt(props.work, 10)));
  }, []);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        props.onSubmit(parseInt(reps, 10), work, setReps, setWork);
      }}
    >
      <div className="flex">
        <Input
          name="reps"
          type="text"
          placeholder="reps"
          value={reps}
          forwardedRef={props.forwardedRepsRef}
          onChange={(e: any) => setReps(e.target.value)}
          onBlur={() =>
            props.onChange ? props.onChange(parseInt(reps, 10), work) : ""
          }
        />
        {props.activityType !== 0 ? (
          false
        ) : (
          <Input
            name="work"
            type="text"
            placeholder="work"
            className="ml-2"
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
