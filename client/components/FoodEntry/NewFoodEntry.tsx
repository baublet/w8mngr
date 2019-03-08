import * as React from "react";
import Input from "client/components/Forms/InputInverted";
import { Mutation, MutationFn } from "react-apollo";
import addFoodEntryQuery from "shared/queries/foodEntry.add";
import PanelInverted from "client/components/Containers/PanelInverted";
import createFoodEntry from "client/operations/foodEntries/create";
import AddButton from "client/components/Button/AddButton";
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
  console.log("Render NewFoodEntry");
  const initialState: NewFoodLogState = {
    description: "",
    calories: "",
    fat: "",
    carbs: "",
    protein: ""
  };

  const [values, setValues] = React.useState(initialState),
    setFoodEntryData = (
      description: string,
      calories: string,
      fat: string,
      carbs: string,
      protein: string
    ) => {
      console.log("setValues");
      if (description == values.description) return;
      if (calories == values.calories) return;
      if (fat == values.fat) return;
      if (carbs == values.carbs) return;
      if (protein == values.protein) return;
      setValues({
        description,
        calories,
        fat,
        carbs,
        protein
      });
    };

  const onChange = (event: any) => {
    console.log("onChange");
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const InputComponent = (
    label: string,
    type: string = "number",
    required: boolean = false
  ) => {
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
        required={required}
      />
    );
  };

  return (
    <Mutation mutation={addFoodEntryQuery}>
      {addFoodEntryFn => {
        const handleSubmit = () => {
          createFoodEntry(props.day, values, setValues, addFoodEntryFn);
        };
        return (
          <PanelInverted className="mt-5 mx-2">
            <h3 className="screen-reader-text">Add Food Entry</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {InputComponent("Description", "text", true)}
              <div className="flex mt-2 w-full">
                <div className="flex-grow">{InputComponent("Calories")}</div>
                <div className="flex-grow ml-1">{InputComponent("Fat")}</div>
                <div className="flex-grow ml-1">{InputComponent("Carbs")}</div>
                <div className="flex-grow ml-1">
                  {InputComponent("Protein")}
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <AddButton type="submit" />
              </div>
            </form>
            {!values.description || values.description.length < 3 ? (
              false
            ) : (
              <FoodAutocomplete
                input={values.description}
                handlePushFoodEntryData={setFoodEntryData}
                handleAddFoodEntry={handleSubmit}
              />
            )}
          </PanelInverted>
        );
      }}
    </Mutation>
  );
}
