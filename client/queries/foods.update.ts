import gql from "graphql-tag";
import foodParts from "./foods.parts";

export default gql`
mutation updateFood(
  $id: Int
  $name: String
  $description: String
) {
  updateFood(
    id: $id
    name: $name
    description: $description
  ) {
    ${foodParts}
  }
}
`;
