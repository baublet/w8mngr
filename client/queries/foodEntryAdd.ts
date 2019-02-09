import gql from "graphql-tag";
import foodEntryParts from "./foodEntry.parts";

export default gql`
mutation addFoodEntry(
  $day: Int
  $description: String
  $calories: Int
  $fat: Int
  $carbs: Int
  $protein: Int
) {
  addFoodEntry(
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
