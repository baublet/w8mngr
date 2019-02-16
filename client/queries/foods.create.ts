import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
mutation createFood(
  $name: String
  $description: String
) {
  createFood(
    name: $name
    description: $description
  ) {
    ${foodParts}
  }
}
`;
