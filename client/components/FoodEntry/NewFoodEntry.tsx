import * as React from "react";
import Input from "components/Forms/InputInverted";
import { Mutation } from "react-apollo";
import addFoodEntryQuery from "queries/foodEntry.add";
import PanelInverted from "components/Containers/PanelInverted";
import createFoodEntry from "operations/foodEntries/create";
import AddButton from "components/Button/AddButton";
import FoodAutocomplete from "./FoodAutocomplete";

interface NewFoodEntryProps {
  day: number;
}

interface NewFoodLogState {
  description: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string | number;
}

export default function NewFoodEntry(props: NewFoodEntryProps) {
  const initialState: NewFoodLogState = {
    description: "",
    calories: "",
    fat: "",
    carbs: "",
    protein: ""
  };

  const [values, setValues] = React.useState(initialState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const InputComponent = (label: string, type: string = "number") => {
    const name = label.toLowerCase(),
      value = values[name];
    return (
      <Input
        label={label}
        placeholder={label}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    );
  };

  return (
    <Mutation mutation={addFoodEntryQuery}>
      {addFoodEntryFn => (
        <PanelInverted className="mt-5 mx-2">
          <h3 className="screen-reader-text">Add Food Entry</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              createFoodEntry(props.day, values, setValues, addFoodEntryFn);
            }}
          >
            {InputComponent("Description", "text")}
            <div className="flex mt-2 w-full">
              <div className="flex-grow">{InputComponent("Calories")}</div>
              <div className="flex-grow ml-1">{InputComponent("Fat")}</div>
              <div className="flex-grow ml-1">{InputComponent("Carbs")}</div>
              <div className="flex-grow ml-1">{InputComponent("Protein")}</div>
            </div>
            <div className="mt-5 flex justify-end">
              <AddButton type="submit">&#43;&nbsp;&nbsp;Add</AddButton>
            </div>
          </form>
          {!values.description || values.description.length < 3 ? (
            false
          ) : (
            <FoodAutocomplete input={values.description} />
          )}
        </PanelInverted>
      )}
    </Mutation>
  );
}
