import gql from "graphql-tag";
import measurementParts from "./measurement.parts";

export default gql`
mutation updateMeasurement(
  $id: Int
  $foodId: Int,
  $amount: Float,
  $unit: String,
  $calories: Int
  $fat: Int
  $carbs: Int
  $protein: Int
) {
  updateMeasurement(
    id: $id
    foodId: $foodId
    amount: $amount
    unit: $unit
    calories: $calories
    fat: $fat
    carbs: $carbs
    protein: $protein
  ) {
    ${measurementParts}
  }
}
`;
