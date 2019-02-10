import * as React from "react";
import foodLogQuery from "queries/foodLog";
import Input from "components/Forms/InputInverted";
import Button from "components/Button/GhostInverted";
import { Mutation } from "react-apollo";
import addFoodEntryQuery from "queries/foodEntryAdd";
import PanelInverted from "components/Panels/Inverted";

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
      {addFoodEntry => (
        <PanelInverted className="mt-5 mx-2">
          <h3 className="screen-reader-text">Add Food Entry</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              addFoodEntry({
                variables: {
                  description: values.description || "",
                  calories: parseInt(values.calories, 10) || 0,
                  fat: parseInt(values.fat, 10) || 0,
                  carbs: parseInt(values.carbs, 10) || 0,
                  protein: parseInt(values.protein, 10) || 0,
                  day: props.day
                },
                optimisticResponse: {
                  __typename: "Mutation",
                  createFoodEntry: {
                    __typename: "FoodEntry",
                    description: values.description,
                    calories: parseInt(values.calories, 10) || 0,
                    fat: parseInt(values.fat, 10) || 0,
                    carbs: parseInt(values.carbs, 10) || 0,
                    protein: parseInt(values.protein, 10) || 0,
                    id: -1,
                    day: props.day
                  }
                },
                update: (proxy, { data: { createFoodEntry } }) => {
                  setValues({
                    ...values,
                    description: "",
                    calories: "",
                    fat: "",
                    carbs: "",
                    protein: ""
                  });
                  // Read the data from our cache for this query.
                  const data: any = proxy.readQuery({
                    query: foodLogQuery,
                    variables: { day: props.day }
                  });
                  // Add the food entry temporarily
                  data.foodEntries.push(createFoodEntry);

                  // Add our comment from the mutation to the end.
                  // Write our data back to the cache.
                  proxy.writeQuery({
                    query: foodLogQuery,
                    variables: { day: props.day },
                    data
                  });
                }
              });
            }}
          >
            <Input
              label="Description"
              type="description"
              name="description"
              placeholder="e.g., cereal"
              required
              value={values.description}
              onChange={onChange}
            />
            <div className="flex mt-2 w-full">
              <div className="flex-grow">{InputComponent("Calories")}</div>
              <div className="flex-grow ml-1">{InputComponent("Fat")}</div>
              <div className="flex-grow ml-1">{InputComponent("Carbs")}</div>
              <div className="flex-grow ml-1">{InputComponent("Protein")}</div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit">&#43;&nbsp;&nbsp;Add</Button>
            </div>
          </form>
        </PanelInverted>
      )}
    </Mutation>
  );
}
