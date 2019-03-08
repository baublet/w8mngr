import gql from "graphql-tag";
import measurementParts from "./measurement.parts";

export default gql`
mutation updateMeasurement(
  $id: Int
  $food_id: Int,
  $amount: Float,
  $unit: String,
  $calories: Int
  $fat: Int
  $carbs: Int
  $protein: Int
) {
  updateMeasurement(
    id: $id
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
