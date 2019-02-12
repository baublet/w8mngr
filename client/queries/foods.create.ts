import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
mutation createFood(
  $id: Int
  $name: String
  $description: String
) {
  createFoodEntry(
    id: $id
    name: $name
    description: $description
  ) {
    ${foodParts}
  }
}
`;
