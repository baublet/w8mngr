import * as React from "react";
import Input from "client/components/Forms/Input";
import MultilineInput from "client/components/Forms/MultilineInput";
import PrimaryButton from "client/components/Button/Primary";
import ActivityDeleteButton from "./ActivityDeleteButton";
import EditActivityType from "./EditActivityType";
import MuscleGroupsForm from "./MuscleGroupsForm";

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
  [key: string]: string | number;
}

export default function ActivityForm(
  props: ActivityFormProps
): React.ReactComponentElement<any> {
  const initialState: ActivityFormState = {
      name: props.name || "",
      description: props.description || "",
      activity_type: props.activity_type || 0
    },
    [values, setValues] = React.useState(initialState),
    [muscleGroups, setMuscleGroups] = React.useState(
      props.muscle_groups || "00000000000000"
    ),
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
      if (muscleGroups != props.muscle_groups) return true;
      return false;
    };
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          props.onSave(
            Object.assign({}, values, {
              id: props.id,
              muscle_groups: muscleGroups
            })
          );
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
        {!props.muscle_groups ? (
          ""
        ) : (
          <div className="mt-3">
            <MuscleGroupsForm
              values={props.muscle_groups}
              handleValueUpdate={setMuscleGroups}
            />
          </div>
        )}
        <div className="flex flex-row-reverse mt-3">
          <PrimaryButton
            type="submit"
            disabled={props.loading || !changed()}
            className={props.loading || !changed() ? "opacity-50" : ""}
          >
            {props.saveLabel || "Save Food"}
          </PrimaryButton>
          {!props.id ? false : <ActivityDeleteButton id={props.id} />}
        </div>
      </form>
    </>
  );
}
