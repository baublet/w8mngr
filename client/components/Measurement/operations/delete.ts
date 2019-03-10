import readFood from "shared/queries/foods.read";
import { MutationFn } from "react-apollo";

export default function deleteMeasurement(
  id: number,
  foodId: number,
  deleteMeasurement: MutationFn
) {
  deleteMeasurement({
    variables: {
      id: id,
      food_id: foodId
    },
    optimisticResponse: {
      __typename: "Mutation",
      deleteMeasurement: {
        __typename: "Measurement",
        id: id
      }
    },
    update: (proxy: any, { data: { deleteMeasurement } }: any) => {
      // Read the data from our cache for this query.
      const data: any = proxy.readQuery({
        query: readFood,
        variables: {
          id: foodId
        }
      });
      // Add our comment from the mutation to the end.
      data.food.measurements = data.food.measurements.filter(
        (measurement: any) => measurement.id != id
      );
      // Write our data back to the cache.
      proxy.writeQuery({
        query: readFood,
        variables: {
          id: foodId
        },
        data
      });
    }
  });
}
