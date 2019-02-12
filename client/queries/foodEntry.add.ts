import gql from "graphql-tag";
import foodEntryParts from "./foodEntry.parts";

export default gql`
mutation createFoodEntry(
  $day: Int
  $description: String
  $calories: Int
  $fat: Int
  $carbs: Int
  $protein: Int
) {
  createFoodEntry(
    day: $day
    description: $description
    calories: $calories
    fat: $fat
    carbs: $carbs
    protein: $protein
  ) {
    ${foodEntryParts}
  }
}
`;
