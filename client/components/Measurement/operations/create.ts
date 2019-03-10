import readFood from "shared/queries/foods.read";
import { MeasurementFormState } from "client/components/Measurement/NewMeasurement";
import { MutationFn } from "react-apollo";

export default function submitNewMeasurement(
  foodId: number,
  values: MeasurementFormState,
  createMeasurement: MutationFn
) {
  const variables = {
    food_id: foodId,
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
        food_id: foodId,
        ...variables
      }
    },
    update: (proxy: any, { data: { createMeasurement } }: any) => {
      const data: any = proxy.readQuery({
        query: readFood,
        variables: { id: foodId }
      });
      data.food.measurements.push(createMeasurement);
      proxy.writeQuery({
        query: readFood,
        variables: { id: foodId },
        data
      });
    }
  });
}
