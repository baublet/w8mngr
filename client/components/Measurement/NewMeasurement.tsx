import * as React from "react";
import createMeasurement from "queries/measurement.create";
import Input from "components/Forms/InputInverted";
import { Mutation } from "react-apollo";
import PanelInverted from "components/Containers/PanelInverted";
import createNewMeasurement from "operations/measurements/create";
import objectEmpty from "helpers/objectEmpty";
import AddButton from "components/Button/AddButton";

interface NewMeasurementProps {
  food_id: number;
}

export interface MeasurementFormState {
  amount: string;
  unit: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string | number;
}

function initialState(): MeasurementFormState {
  return {
    amount: "",
    unit: "",
    calories: "",
    fat: "",
    carbs: "",
    protein: ""
  };
}

export default function NewMeasurement(
  props: NewMeasurementProps
): React.ReactComponentElement<any> {
  const [values, setValues] = React.useState(initialState()),
    onChange = (event: any) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    },
    changed = !objectEmpty(values);

  const InputField = (
    name: string,
    type: string = "number"
  ): React.ReactComponentElement<any> => {
    return (
      <Input
        type={type}
        name={name.toLowerCase()}
        label={name}
        placeholder={name}
        value={`${values[name.toLowerCase()]}`}
        onChange={onChange}
        className={`text-base`}
      />
    );
  };

  return (
    <Mutation mutation={createMeasurement}>
      {createMeasurement => (
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            createNewMeasurement(props.food_id, values, createMeasurement);
            setValues(initialState());
          }}
        >
          <PanelInverted className="mt-5">
            <div className="flex">
              <div className="w-1/3">{InputField("Amount")}</div>
              <div className="w-2/3 ml-1">{InputField("Unit", "text")}</div>
            </div>
            <div className="flex mt-3">
              <div className="w-1/4">{InputField("Calories")}</div>
              <div className="w-1/4 ml-1">{InputField("Fat")}</div>
              <div className="w-1/4 ml-1">{InputField("Carbs")}</div>
              <div className="w-1/4 ml-1">{InputField("Protein")}</div>
            </div>
            <div className="flex justify-end mt-3">
              <div className="relative">
                <AddButton
                  className={changed ? "" : "opacity-50"}
                  type="submit"
                  disabled={!changed}
                >
                  <span>&#43;&nbsp;&nbsp;Add</span>
                </AddButton>
              </div>
            </div>
          </PanelInverted>
        </form>
      )}
    </Mutation>
  );
}
