import { FoodEntryState } from "components/FoodEntry/FoodEntry";
import { MutationFn } from "react-apollo";
import foodLogQuery from "queries/foodLog";
import { Dispatch, SetStateAction } from "react";

export default function createFoodEntry(
  day: number,
  values: FoodEntryState,
  setValues: Dispatch<SetStateAction<FoodEntryState>>,
  addFoodEntry: MutationFn
): void {
  addFoodEntry({
    variables: {
      description: values.description || "",
      calories: parseInt(values.calories, 10) || 0,
      fat: parseInt(values.fat, 10) || 0,
      carbs: parseInt(values.carbs, 10) || 0,
      protein: parseInt(values.protein, 10) || 0,
      day: day
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
        day: day
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
        variables: { day: day }
      });
      // Add the food entry temporarily
      data.foodEntries.push(createFoodEntry);

      // Add our comment from the mutation to the end.
      // Write our data back to the cache.
      proxy.writeQuery({
        query: foodLogQuery,
        variables: { day: day },
        data
      });
    }
  });
}
