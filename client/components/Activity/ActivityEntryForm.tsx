import * as React from "react";
import Input from "client/components/Forms/Input";

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
}

export default function ActivityEntryForm(
  props: ActivityEntryFormProps
): React.ReactComponentElement<any> {
  const [reps, setReps] = React.useState(props.reps ? `${props.reps}` : ""),
    [work, setWork] = React.useState(props.work || "");

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
