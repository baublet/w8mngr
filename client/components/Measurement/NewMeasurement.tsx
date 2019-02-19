import * as React from "react";
import createMeasurement from "queries/measurement.create";
import Input from "components/Forms/InputInverted";
import GhostInvertedButton from "components/Button/GhostInverted";
import UpdateIcon from "components/Icons/Update";
import { Mutation } from "react-apollo";
import PanelInverted from "components/Containers/PanelInverted";
import readFood from "queries/foods.read";

interface NewMeasurementProps {
  food_id: number;
}

interface MeasurementFormState {
  amount: string;
  unit: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string | number;
}

export default function NewMeasurement(
  props: NewMeasurementProps
): React.ReactComponentElement<any> {
  const initialState: MeasurementFormState = {
      amount: "",
      unit: "",
      calories: "",
      fat: "",
      carbs: "",
      protein: ""
    },
    [values, setValues] = React.useState(initialState),
    onChange = (event: any) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    },
    changed = (() => {
      if (!values.amount) return false;
      if (!values.calories) return false;
      if (!values.fat) return false;
      if (!values.carbs) return false;
      if (!values.protein) return false;
      if (!values.unit) return false;
      return true;
    })();

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
        defaultValue={`${values[name.toLowerCase()]}`}
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
            const variables = {
              food_id: props.food_id,
              amount: parseFloat(values.amount) || 0,
              unit: values.unit,
              calories: parseInt(values.calories, 10) || 0,
              fat: parseInt(values.fat, 10) || 0,
              carbs: parseInt(values.carbs, 10) || 0,
              protein: parseInt(values.protein, 10) || 0
            };
            createMeasurement({
              variables,
              optimisticResponse: {
                __typename: "Mutation",
                createMeasurement: {
                  __typename: "Measurement",
                  id: -1,
                  food_id: props.food_id,
                  ...variables
                }
              },
              update: (proxy, { data: { createMeasurement } }) => {
                const data: any = proxy.readQuery({
                  query: readFood,
                  variables: { id: props.food_id }
                });
                data.food.measurements.push(createMeasurement);
                proxy.writeQuery({
                  query: readFood,
                  variables: { id: props.food_id },
                  data
                });
              }
            });
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
                <GhostInvertedButton
                  className={`bg-transparent p-3 text-foreground rounded ${
                    changed ? "" : "opacity-75"
                  }`}
                  type="submit"
                  disabled={!changed}
                >
                  <span>&#43;</span>
                  <span className="ml-2">Add</span>
                </GhostInvertedButton>
              </div>
            </div>
          </PanelInverted>
        </form>
      )}
    </Mutation>
  );
}
