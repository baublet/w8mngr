import * as React from "react";
import Input from "components/Forms/InputFoodEntry";
import { FoodEntryType } from "api/foodEntries/types";
import PrimaryIcon from "components/Button/PrimaryIcon";
import { Mutation } from "react-apollo";
import deleteFoodEntryQuery from "queries/foodEntryDelete";
import updateFoodEntryQuery from "queries/foodEntryUpdate";
import foodLogQuery from "queries/foodLog";

interface FoodEntryState {
  description: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string | number;
}

export default function FoodEntry(props: FoodEntryType) {
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
    <div className="relative">
      {props.id == -1 ? (
        false
      ) : (
        <Mutation mutation={deleteFoodEntryQuery}>
          {deleteFoodEntry => (
            <PrimaryIcon
              className="absolute pin-r pin-t"
              onClick={e => {
                deleteFoodEntry({
                  variables: { id: props.id },
                  update: (proxy, { data: { deleteFoodEntry } }) => {
                    // Read the data from our cache for this query.
                    const data: any = proxy.readQuery({
                      query: foodLogQuery,
                      variables: { day: props.day }
                    });
                    proxy.writeQuery({
                      query: foodLogQuery,
                      variables: { day: props.day },
                      data: {
                        foodEntries: data.foodEntries.filter(
                          (entry: FoodEntryType) => entry.id !== props.id
                        )
                      }
                    });
                  }
                });
              }}
            >
              &times;
            </PrimaryIcon>
          )}
        </Mutation>
      )}
      <Mutation mutation={updateFoodEntryQuery}>
        {updateFoodEntry => {
          const updateOnBlur = () => {
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
          };
          return (
            <>
              <Input
                name="description"
                value={values.description}
                placeholder="Description"
                onChange={onChange}
                hideLabel={true}
                onBlur={updateOnBlur}
              />
              <div className="flex">
                <div>
                  <Input
                    name="calories"
                    value={values.calories}
                    label="Calories"
                    onChange={onChange}
                    onBlur={updateOnBlur}
                  />
                </div>
                <div>
                  <Input
                    name="fat"
                    value={values.fat}
                    label="Fat"
                    onChange={onChange}
                    onBlur={updateOnBlur}
                  />
                </div>
                <div>
                  <Input
                    name="carbs"
                    value={values.carbs}
                    label="Carbs"
                    onChange={onChange}
                    onBlur={updateOnBlur}
                  />
                </div>
                <div>
                  <Input
                    name="protein"
                    value={values.protein}
                    label="Protein"
                    onChange={onChange}
                    onBlur={updateOnBlur}
                  />
                </div>
              </div>
            </>
          );
        }}
      </Mutation>
    </div>
  );
}
