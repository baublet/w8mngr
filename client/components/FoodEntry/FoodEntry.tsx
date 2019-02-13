import * as React from "react";
import Input from "components/Forms/InputFoodEntry";
import { FoodEntryType } from "api/foodEntries/types";
import { Mutation } from "react-apollo";
import updateFoodEntryQuery from "queries/foodEntry.update";
import FoodEntryDelete from "components/FoodEntry/FoodEntryDelete";

interface FoodEntryState {
  description: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string | number;
}

export default function FoodEntry(
  props: FoodEntryType
): React.ReactComponentElement<any> {
  const initialState: FoodEntryState = {
    description: props.description || "",
    calories: props.calories ? props.calories.toString() : "",
    fat: props.fat ? props.fat.toString() : "",
    carbs: props.carbs ? props.carbs.toString() : "",
    protein: props.protein ? props.protein.toString() : ""
  };

  const [values, setValues] = React.useState(initialState),
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    };

  return (
    <>
      <FoodEntryDelete id={props.id} day={props.day} />
      <Mutation mutation={updateFoodEntryQuery}>
        {updateFoodEntry => {
          const updater = () => {
              console.log("updating");
              updateFoodEntry({
                variables: {
                  id: props.id,
                  description: values.description,
                  calories: parseInt(values.calories, 10),
                  fat: parseInt(values.fat, 10),
                  carbs: parseInt(values.carbs, 10),
                  protein: parseInt(values.protein, 10)
                }
              });
            },
            EntryInput = (type: string, hideLabel = false) => (
              <Input
                name={type.toLowerCase()}
                value={values[type.toLocaleLowerCase()]}
                placeholder={type}
                onChange={onChange}
                hideLabel={hideLabel}
                onBlur={updater}
                autoComplete="off"
              />
            );
          return (
            <form
              onSubmit={e => {
                e.preventDefault();
                updater();
              }}
            >
              <div className="pr-5">{EntryInput("Description", true)}</div>
              <div className="flex">
                <div>{EntryInput("Calories")}</div>
                <div>{EntryInput("Fat")}</div>
                <div>{EntryInput("Carbs")}</div>
                <div>{EntryInput("Protein")}</div>
              </div>
              <button type="submit" className="screen-reader-text">
                Save Food Entry
              </button>
            </form>
          );
        }}
      </Mutation>
    </>
  );
}
