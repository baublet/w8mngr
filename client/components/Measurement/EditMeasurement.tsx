import * as React from "react";
import { MeasurementType } from "api/measurements/types";
import updateMeasurementQuery from "shared/queries/measurement.update";
import Input from "client/components/Forms/Input";
import GhostButton from "client/components/Button/Ghost";
import UpdateIcon from "client/components/Icons/Update";
import { Mutation } from "react-apollo";
import DeleteMeasurementsButton from "./DeleteMeasurement";
import updateMeasurement from "./operations/update";

type EditMeasurementProps = MeasurementType;

interface MeasurementFormState {
  amount: string;
  unit: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string;
}

export default function EditMeasurements(
  props: EditMeasurementProps
): React.ReactComponentElement<any> {
  const initialState: MeasurementFormState = {
      amount: props.amount.toString(),
      unit: props.unit,
      calories: props.calories.toString(),
      fat: props.fat.toString(),
      carbs: props.carbs.toString(),
      protein: props.protein.toString()
    },
    [values, setValues] = React.useState(initialState),
    onChange = (event: any) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    },
    changed = () => {
      if (props.amount != parseFloat(values.amount)) return true;
      if (props.calories != parseInt(values.calories, 10)) return true;
      if (props.fat != parseInt(values.fat, 10)) return true;
      if (props.carbs != parseInt(values.carbs, 10)) return true;
      if (props.protein != parseInt(values.protein, 10)) return true;
      if (props.unit != values.unit) return true;
      return false;
    };

  const InputField = (
    name: string,
    type: string = "number"
  ): React.ReactComponentElement<any> => {
    return (
      <Input
        type={type}
        name={name.toLowerCase()}
        label={name}
        defaultValue={values[name.toLowerCase()]}
        onChange={onChange}
        className={`text-xs`}
        showLabel={true}
      />
    );
  };

  return (
    <Mutation mutation={updateMeasurementQuery}>
      {updateMeasurementFn => (
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            updateMeasurement(
              props.id,
              props.food_id,
              values,
              updateMeasurementFn
            );
          }}
        >
          <div className="mt-2 flex items-center">
            <div className="w-12">{InputField("Amount")}</div>
            <div className="flex-grow ml-1">{InputField("Unit", "text")}</div>
            <div className="w-12 ml-1">{InputField("Calories")}</div>
            <div className="w-8 ml-1">{InputField("Fat")}</div>
            <div className="w-8 ml-1">{InputField("Carbs")}</div>
            <div className="w-12 ml-1">{InputField("Protein")}</div>
            <div className="relative">
              {changed() ? (
                <GhostButton
                  className="bg-transparent p-3 text-foreground rounded "
                  type="submit"
                >
                  <UpdateIcon />
                  <span className="screen-reader-text">Save measurement</span>
                </GhostButton>
              ) : (
                <DeleteMeasurementsButton
                  id={props.id}
                  food_id={props.food_id}
                />
              )}
            </div>
          </div>
        </form>
      )}
    </Mutation>
  );
}
