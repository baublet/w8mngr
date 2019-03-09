import * as React from "react";
import Input from "client/components/Forms/Input";
import MultilineInput from "client/components/Forms/MultilineInput";
import PrimaryButton from "client/components/Button/Primary";
import ActivityDeleteButton from "./ActivityDeleteButton";
import EditActivityType from "./EditActivityType";
import MuscleGroups from "./MuscleGroups";

export interface ActivityFormProps {
  onSave: (food: any) => void;
  saveLabel?: string;
  id?: number;
  loading?: boolean;
  onChange?: () => void;
  name?: string;
  description?: string;
  activity_type?: number;
  muscle_groups?: string;
}

export interface ActivityFormState {
  id?: number;
  name: string;
  description: string;
  activity_type: number;
  muscle_groups?: string;
  [key: string]: string | number;
}

export default function ActivityForm(
  props: ActivityFormProps
): React.ReactComponentElement<any> {
  const initialState: ActivityFormState = {
      name: props.name || "",
      description: props.description || "",
      activity_type: props.activity_type || 0,
      muscle_groups: props.muscle_groups || "00000000000000"
    },
    [values, setValues] = React.useState(initialState),
    onChange = (event: any) => {
      if (props.onChange) {
        props.onChange();
      }
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    },
    changed = () => {
      if (values.name != props.name) return true;
      if (values.description != props.description) return true;
      if (values.activity_type != props.activity_type) return true;
      if (values.muscle_groups != props.muscle_groups) return true;
      return false;
    };
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          props.onSave(Object.assign({}, values, { id: props.id }));
        }}
      >
        <Input
          name={"name"}
          value={values.name}
          placeholder={"Name"}
          onChange={onChange}
          disabled={props.loading}
          className="text-lg"
        />
        <MultilineInput
          name={"description"}
          value={values.description}
          placeholder={"Description"}
          onChange={onChange}
          disabled={props.loading}
          className="mt-3"
        />
        <div className="mt-3">
          <EditActivityType
            onChange={onChange}
            selectedType={values.activity_type}
          />
        </div>
        <div className="mt-3">
          <MuscleGroups values={values.muscle_groups} />
        </div>
        <div className="flex flex-row-reverse mt-3">
          <PrimaryButton
            type="submit"
            disabled={props.loading || !changed()}
            className={props.loading || !changed() ? "opacity-75" : "fart"}
          >
            {props.saveLabel || "Save Food"}
          </PrimaryButton>
          {!props.id ? false : <ActivityDeleteButton id={props.id} />}
        </div>
      </form>
    </>
  );
}
