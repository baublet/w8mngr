import { MeasurementFormState } from "client/components/Measurement/NewMeasurement";
import { MutationFn } from "react-apollo";

export default function updateMeasurement(
  id: number,
  foodId: number,
  values: MeasurementFormState,
  updateMeasurement: MutationFn
): void {
  const variables = {
    id: id,
    food_id: foodId,
    amount: parseFloat(values.amount),
    unit: values.unit,
    calories: parseInt(values.calories, 10),
    fat: parseInt(values.fat, 10),
    carbs: parseInt(values.carbs, 10),
    protein: parseInt(values.protein, 10)
  };
  updateMeasurement({
    variables,
    optimisticResponse: {
      __typename: "Mutation",
      updateMeasurement: {
        __typename: "Measurement",
        ...variables
      }
    }
  });
}
