import * as React from "react";
import Input from "components/Forms/Input";
import MultilineInput from "components/Forms/MultilineInput";
import PrimaryButton from "components/Button/Primary";

export interface ActivityFormProps {
  onSave: (food: any) => void;
  saveLabel?: string;
  id?: number;
  loading?: boolean;
  onChange?: () => void;
  name?: string;
  description?: string;
}

export interface ActivityFormState {
  id?: number;
  name: string;
  description: string;
  [key: string]: string | number;
}

export default function ActivityForm(
  props: ActivityFormProps
): React.ReactComponentElement<any> {
  const initialState: ActivityFormState = {
      name: props.name || "",
      description: props.description || ""
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
        <div className="flex flex-row-reverse mt-3">
          <PrimaryButton
            type="submit"
            disabled={props.loading || !changed()}
            className={props.loading || !changed() ? "opacity-75" : "fart"}
          >
            {props.saveLabel || "Save Food"}
          </PrimaryButton>
          {!props.id ? false : <b>Delete</b>}
        </div>
      </form>
    </>
  );
}
