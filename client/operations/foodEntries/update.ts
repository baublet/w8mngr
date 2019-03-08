import { FoodEntryState } from "client/components/FoodEntry/FoodEntry";
import { MutationFn } from "react-apollo";

export default function updateFoodEntry(
  id: number,
  values: FoodEntryState,
  updateFoodEntry: MutationFn
): void {
  updateFoodEntry({
    variables: {
      id: id,
      description: values.description,
      calories: parseInt(values.calories, 10),
      fat: parseInt(values.fat, 10),
      carbs: parseInt(values.carbs, 10),
      protein: parseInt(values.protein, 10)
    }
  });
}
