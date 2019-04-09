import * as React from "react";
import Input from "client/components/Forms/Input";
import AddButton from "../Button/AddButton";
import { Mutation } from "react-apollo";
import createActivityEntryQuery from "shared/queries/activityEntries.create";
import createActivityEntryOperation from "./operations/createActivityEntry";

export interface NewActivityEntryFormProps {
  day: number;
  activityId: number;
}

export default function ActivityEntryForm(
  props: NewActivityEntryFormProps
): React.ReactComponentElement<any> {
  const [reps, setReps] = React.useState(""),
    [work, setWork] = React.useState("");

  return (
    <Mutation mutation={createActivityEntryQuery}>
      {createActivityEntryFn => (
        <form
          onSubmit={e => {
            e.preventDefault();
            createActivityEntryOperation(
              createActivityEntryFn,
              props.day,
              props.activityId,
              reps,
              work,
              setReps,
              setWork
            );
          }}
        >
          <div className="flex">
            <Input
              name="reps"
              type="text"
              placeholder="reps"
              className="mr-2"
              value={reps}
              onChange={(e: any) => setReps(e.target.value)}
            />
            <Input
              name="work"
              type="text"
              placeholder="work"
              className="mr-3"
              value={work}
              onChange={(e: any) => setWork(e.target.value)}
            />
            <AddButton type="submit" />
          </div>
        </form>
      )}
    </Mutation>
  );
}
