import gql from "graphql-tag";
import foodEntryParts from "./foodEntry.parts";

export default gql`
mutation updateFoodEntry(
  $id: Int
  $description: String
  $calories: Int
  $fat: Int
  $carbs: Int
  $protein: Int
) {
  updateFoodEntry(
    id: $id
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
