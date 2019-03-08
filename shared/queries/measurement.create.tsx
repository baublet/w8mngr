import gql from "graphql-tag";
import measurementParts from "./measurement.parts";

export default gql`
mutation createMeasurement(
  $food_id: Int,
  $amount: Float,
  $unit: String,
  $calories: Int
  $fat: Int
  $carbs: Int
  $protein: Int
) {
  createMeasurement(
    food_id: $food_id
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
